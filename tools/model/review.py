"""Review sheet for a kit lamp: product photo beside day, night and 3/4 renders of the model, plus a profile-fit score.

    python tools/model/review.py <modelKey> shots --slug <product-slug> [--finish <slug>] [--photo <imageId>]
    python tools/model/review.py <modelKey> sheet --slug <product-slug> [--finish <slug>] [--photo <imageId>] [--upload]
        camera options for both: [--under] (the photo shows the hat's/shade's underside) or [--cam-height <cm>]

1. `shots` prints the window.shot calls. Run them in the console of a freshly loaded /dev-render page (dev server
   running); they save to public/renders/_test/. The front views are framed like the photo, so photo and renders line
   up side by side; the night card image is framed like the photo inside the 5:6 product card.
2. `sheet` writes tools/model/out/<key>-sheet.webp from the saved frames and prints the profile fit, in mm.
   --upload then sets public/renders/_test/night-<key>.webp as the product's nightImage (tools/upload-night.mjs).

The fit: the spec's parts (body, foot, hat, shade, top button) are turned and seen through a pinhole camera whose
height and distance are fitted to the photo, so the photo's perspective (a base seen from above, its top face
widening the silhouette above it) is in the model's outline too. Then the distance between the two outlines, row by
row (on a wall that is |dr|; at a shoulder it is the distance across it). The camera may see the bottom and the top
from different heights (studio photos are often composites), at a cost, so one camera wins unless two fit clearly
better. A silhouette looks the same from a camera some way above a flat face as from one as far below it, so when the
photo shows a hat's lit underside pass --under (or --cam-height when the height is known); check the fitted heights
the sheet prints. Glass and other see-through parts can't be
measured on the photo (see extract.py).

--slug is the Light Design / Sanity product slug (a prefix is enough to find the photo). The photo defaults to the
one whose file name names the finish, else the first; the finish defaults to the one the photo's name names.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract import DATA, OUT, ROOT, Silhouette, _smooth, find_product, load_rgb, silhouette  # noqa: E402

RENDERS = ROOT / "public" / "renders"
SPECS = ROOT / "src" / "three" / "kit" / "specs"

PANEL = (1000, 1200)  # 5:6 like the photos and the cards
CARD = (800, 1000)  # as the existing night images; the 5:6 card crops 2 % off top and bottom
# Azimuth 8 deg off the front keeps the glasses at 0 deg out of the frame and the wall behind the lamp dark and plain.
FRONT = {"fov": 17, "azimuth": 8}
THREE_Q = {"azimuth": 35, "elevation": 20, "fov": 22, "top": 0.17, "bottom": 0.85}
SHOT = {"samples": 32, "quality": 0.93}
NIGHT_K = 2700


def load_spec(key: str) -> dict:
    url = (SPECS / f"{key}.ts").resolve().as_uri()
    code = f"const s = (await import({json.dumps(url)})).default; console.log(JSON.stringify(s));"
    out = subprocess.run(["node", "--no-warnings", "--input-type=module", "-e", code], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def finishes() -> list[str]:
    src = (ROOT / "src" / "three" / "finishes.ts").read_text(encoding="utf-8")
    block = src[src.index("const FINISHES") : src.index("const SHADES")]
    return re.findall(r'^\s+"?([\w-]+)"?: \{', block, re.M)


# --- spec outline ---------------------------------------------------------------------------------------------------


def catmull_rom(pts: np.ndarray, n: int) -> np.ndarray:
    """THREE.SplineCurve through the points (uniform Catmull-Rom), as build.ts turns each run."""
    if len(pts) < 3:
        return pts
    t = np.linspace(0, 1, n) * (len(pts) - 1)
    i = np.minimum(t.astype(int), len(pts) - 2)
    w = (t - i)[:, None]
    p0, p1 = pts[np.maximum(i - 1, 0)], pts[i]
    p2, p3 = pts[i + 1], pts[np.minimum(i + 2, len(pts) - 1)]
    v0, v1 = (p2 - p0) / 2, (p3 - p1) / 2
    return (2 * p1 - 2 * p2 + v0 + v1) * w**3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * w**2 + v0 * w + p1


def turned(profile: list) -> np.ndarray:
    runs = [[]]
    for k, p in enumerate(profile):
        runs[-1].append(p[:2])
        if len(p) > 2 and k < len(profile) - 1:
            runs.append([p[:2]])
    return np.concatenate([catmull_rom(np.array(r, float), 60 * len(r)) for r in runs])


def faceted(outline: np.ndarray, f: dict | None) -> np.ndarray:
    """An N-sided part's (Facets in specs/index.ts) half-width as the front camera sees it, in place of r."""
    if not f:
        return outline
    half = math.pi / f["n"]
    corner = 1 / math.cos(half) if f["across"] == "flats" else 1
    centres = np.radians(f.get("angle", 0)) + 2 * half * np.arange(f["n"])
    corners = np.concatenate([centres - half, centres + half]) - np.radians(FRONT["azimuth"])
    seen = corner * (np.sin(corners).max() + (-np.sin(corners)).max()) / 2
    lo, hi = f.get("from", -np.inf) - 1e-4, f.get("to", np.inf) + 1e-4
    out = outline.copy()
    inside = (out[:, 1] >= lo) & (out[:, 1] <= hi)
    out[inside, 0] *= seen
    return out


def foot(f: dict) -> np.ndarray:
    """The rubber foot's outline: a plain one as a box, a tapered or rounded one as footGeometry in build.ts."""
    r, h = f["r"], f["h"]
    if "rBottom" not in f and not f.get("round"):
        return np.array([[0, 0], [r, 0], [r, h], [0, h]], float)
    rb, rd = f.get("rBottom", r * 0.97), f.get("round", 0)
    wx, wy = (r - rb) / math.hypot(r - rb, h), h / math.hypot(r - rb, h)
    t = rd / math.tan(math.acos(-wx) / 2)
    end = math.atan2(wy * t - rd, t + wx * t)
    a = -math.pi / 2 + (end + math.pi / 2) * np.linspace(0, 1, 9)
    edge = np.stack([rb - t + rd * np.cos(a), rd + rd * np.sin(a)], 1) if rd > 0 else np.array([[rb, 0]])
    return np.concatenate([[[0, 0]], edge, [[r, h], [0, h]]]).astype(float)


def top_button(tb: dict, yb: float) -> np.ndarray:
    """The top button's outline on a part ending at yb: its `shape` (units of r and h) or the default dome."""
    shape = tb.get("shape") or [[0, 0], [1, 0], [1, 0.2], [0.9, 0.6], [0.55, 0.92], [0, 1]]
    pts = np.array([[p[0] * tb["r"], yb + p[1] * tb["h"]] for p in shape], float)
    return turned([[*q, *p[2:]] for q, p in zip(pts.tolist(), shape)]) if tb.get("shape") else pts


def parts(spec: dict) -> list[np.ndarray]:
    """(r, y) outlines of every turned part, in cm, as build.ts makes them."""
    out = [faceted(turned(spec["body"]["profile"]), spec["body"].get("facets"))]
    out.append(foot(spec["body"]["foot"]))
    if hat := spec.get("hat"):
        out.append(faceted(turned(hat["profile"]), hat.get("facets")))
        if (o := hat.get("opal")) and "profile" in o:
            out.append(turned(o["profile"]))
        elif o:
            out.append(np.array([[0, o["y"]], [o["r"], o["y"]], [o["r"], o["y"] + o["h"]], [0, o["y"] + o["h"]]], float))
    for own in ("opal", "glass"):  # a lamp's own opal part, clear glass (its outer surface)
        if p := spec.get(own):
            out.append(turned(p["profile"]))
    if (s := spec.get("shade")) and "profile" in s:
        out.append(turned(s["profile"]))
        if tb := spec.get("topButton"):
            out.append(top_button(tb, max(p[1] for p in s["profile"])))
    elif s:
        y0, y1, t2 = s["y"], s["y"] + s["h"], s["thickness"] / 2
        pad, tape = (t2, 0) if s.get("opal") else (t2 + 0.08, s["tape"])  # the tape folded over each rim
        r_at = lambda y: s["rBottom"] + (s["rTop"] - s["rBottom"]) * (y - y0) / s["h"]  # noqa: E731
        out.append(np.array([
            [0, y1 + t2], [r_at(y1) + pad, y1 + pad], [r_at(y1 - tape) + pad, y1 - tape], [r_at(y1 - tape) + t2, y1 - tape],
            [r_at(y0 + tape) + t2, y0 + tape], [r_at(y0 + tape) + pad, y0 + tape], [r_at(y0) + pad, y0 - pad], [0, y0 - pad],
        ]))
        if tb := spec.get("topButton"):
            out.append(top_button(tb, y1 + t2))
    return out


def envelope(outlines: list[np.ndarray], ys: np.ndarray) -> np.ndarray:
    """Radius of the turned solid per height: the widest part crossing it."""
    r = np.zeros_like(ys)
    for o in outlines:
        for (ra, ya), (rb, yb) in zip(o[:-1], o[1:]):
            sel = (ys >= min(ya, yb)) & (ys <= max(ya, yb))
            if sel.any():
                rr = np.full(sel.sum(), max(ra, rb)) if yb == ya else ra + (rb - ra) * (ys[sel] - ya) / (yb - ya)
                r[sel] = np.maximum(r[sel], rr)
    return r


# --- the photo's camera and the profile fit -------------------------------------------------------------------------


@dataclass
class PhotoFit:
    eye: tuple[float, float]  # camera height seen from the lamp's bottom and from its top, cm
    dist: float  # camera distance from the axis, cm
    height: float
    rows: np.ndarray  # photo rows, top to bottom
    photo: np.ndarray  # photo half-width per row, px
    model: np.ndarray  # the model's half-width seen by the fitted camera, px
    cm_px: float  # at the axis
    to_row: object  # y (cm, on the axis) -> photo row

    def eye_at(self, y: float) -> float:
        return self.eye[0] + (self.eye[1] - self.eye[0]) * y / self.height

    @property
    def label(self) -> str:
        b, t = self.eye
        return f"{b:.1f} cm" if abs(t - b) < 0.5 else f"{b:.1f} cm (alt) → {t:.1f} cm (üst)"


def seen(outlines: list[np.ndarray], height: float, eye: tuple[float, float], dist: float, sil: Silhouette, n=(2500, 121)):
    """The turned model through a level pinhole camera dist from the axis, scaled so its top and bottom meet the
    photo's: half-width in px per photo row, px per screen unit and the screen offset.
    eye: camera height for the bottom and the top of the lamp, linear in between. Equal, it is one camera. Apart,
    each height is seen from its own camera height, as in a composite of two shots (the studio photos often show a
    hat's lit underside, so a camera below it, and a base's top face, so a camera well above that).
    n: samples along the height and around the half turn."""
    ys = np.linspace(0, height, n[0])
    r = envelope(outlines, ys)
    th = np.linspace(0, np.pi, n[1])
    x = np.outer(r, np.sin(th))
    z = np.outer(r, np.cos(th))
    depth = dist - z
    e = eye[0] + (eye[1] - eye[0]) * ys / height
    u = (x / depth).ravel()
    # the axis point at y lands at -y / dist; the ring around it opens by the camera height above it
    v = (-ys[:, None] / dist + (e - ys)[:, None] * (1 / depth - 1 / dist)).ravel()
    s = (sil.bottom - sil.top) / (v.max() - v.min())
    off = sil.top - s * v.min()
    row = np.clip(np.rint(off + s * v).astype(int) - sil.top, 0, sil.bottom - sil.top)
    half = np.zeros(sil.bottom - sil.top + 1)
    np.maximum.at(half, row, u * s)
    # rows no sample landed on take their neighbours'
    empty = half == 0
    if empty.any():
        k = np.arange(half.size)
        half[empty] = np.interp(k[empty], k[~empty], half[~empty])
    return half, s, off


# px of mean error a camera-height difference of one lamp height must save before the fit takes it over one camera
SPLIT_COST = 0.3


def fit_camera(outlines: list[np.ndarray], height: float, sil: Silhouette, cam_height: float | None = None, below: float | None = None) -> PhotoFit:
    """cam_height: a known single camera height (cm); only the distance is fitted then.
    below: the camera that sees the lamp's top is below this height (cm). A silhouette can't tell a camera some way
    above a flat face from one as far below it, so where the photo shows a hat's underside the fit needs telling."""
    rows = np.arange(sil.top, sil.bottom + 1)
    photo = sil.r[sil.top : sil.bottom + 1]
    ok = np.isfinite(photo)
    # smoothed as extract.measure does: webp blocks shift faint edges by a few px in steps
    photo = np.convolve(np.pad(_smooth(np.interp(rows, rows[ok], photo[ok]), 9), 1, mode="edge"), np.ones(3) / 3, "valid")

    def loss(eb, et, d):
        half, _, _ = seen(outlines, height, (eb * height, et * height), d * height, sil, (1200, 61))
        return float(np.minimum(np.abs(half - photo), 8).mean()) + SPLIT_COST * abs(et - eb)

    dists = (2, 3, 4, 5, 6, 8, 11, 16, 25)
    if cam_height is not None:
        e = cam_height / height
        _, d0 = min((loss(e, e, d), d) for d in dists)
        for _ in range(3):
            _, d0 = min((loss(e, e, d), d) for d in d0 * np.linspace(0.8, 1.25, 7))
        eb = et = e
    else:
        top = below / height - 0.005 if below is not None else 1.6
        _, eb, d0 = min((loss(e, e, d), e, d) for e in np.linspace(0, min(1.4, top), 15) for d in dists)
        # then the two heights apart, at that distance
        _, eb, et = min((loss(b, t, d0), b, t) for b in np.linspace(0, 1.6, 17) for t in np.linspace(0, top, 17))
        for step in (0.05, 0.02):  # finer around the best, all three together
            _, eb, et, d0 = min(
                (loss(b, t, d), b, t, d)
                for b in eb + step * np.array([-1, 0, 1])
                for t in np.minimum(et + step * np.array([-1, 0, 1]), top)
                for d in d0 * np.array([0.88, 1, 1.13])
                if d > 1
            )
    eye, dist = (eb * height, et * height), d0 * height
    half, s, off = seen(outlines, height, eye, dist, sil)
    return PhotoFit(eye, dist, height, rows, photo, half, dist / s, lambda y: off - s * y / dist)


def seg_distance(pts: np.ndarray, line: np.ndarray) -> np.ndarray:
    """Distance from each point to a polyline."""
    a, b = line[:-1], line[1:]
    ab = b - a
    l2 = np.maximum((ab**2).sum(1), 1e-12)
    best = np.full(len(pts), np.inf)
    for k in range(0, len(pts), 256):
        p = pts[k : k + 256, None, :]
        t = np.clip(((p - a) * ab).sum(2) / l2, 0, 1)
        best[k : k + 256] = np.sqrt(((a + t[..., None] * ab - p) ** 2).sum(2)).min(1)
    return best


def score(f: PhotoFit) -> dict:
    photo = np.column_stack([f.photo, f.rows])
    model = np.column_stack([f.model, f.rows])
    # closed along the axis, so the top and bottom edges count as lines, not as their end rows
    close = lambda line: np.r_[[[0, f.rows[0]]], line, [[0, f.rows[-1]]]]  # noqa: E731
    # both ways, so a part the photo has and the model lacks counts as much as the other way round
    d_photo = seg_distance(photo, close(model)) * f.cm_px * 10
    d_model = seg_distance(model, close(photo)) * f.cm_px * 10
    both = np.r_[d_photo, d_model]
    k = int(np.argmax(both))
    row = f.rows[k % f.rows.size]
    sign = np.sign(f.photo - f.model)
    return {
        "meanMm": float(both.mean()),
        "p95Mm": float(np.percentile(both, 95)),
        "maxMm": float(both[k]),
        "maxAtCm": float((f.to_row(0) - row) * f.cm_px),
        "maxSide": "model narrower" if sign[k % f.rows.size] > 0 else "model wider",
        "signed": d_photo * sign,  # per photo row: + where the photo is wider
    }


# --- render cameras -------------------------------------------------------------------------------------------------


def project_v(pts: np.ndarray, cam: np.ndarray, target: np.ndarray, fov: float) -> np.ndarray:
    """Screen v (0 top, 1 bottom) of world points for a three.js camera looking at target, up +y."""
    f = target - cam
    f /= np.linalg.norm(f)
    r = np.cross(f, [0, 1, 0])
    r /= np.linalg.norm(r)
    u = np.cross(r, f)
    d = pts - cam
    return 0.5 - 0.5 * (d @ u) / ((d @ f) * math.tan(math.radians(fov) / 2))


def lamp_points(outlines: list[np.ndarray], height: float) -> np.ndarray:
    ys = np.linspace(0, height, 300)
    r = envelope(outlines, ys)
    a = np.linspace(0, 2 * np.pi, 48, endpoint=False)
    return np.stack([np.outer(r, np.sin(a)), np.repeat(ys[:, None], a.size, 1), np.outer(r, np.cos(a))], -1).reshape(-1, 3) / 100


def frame(points: np.ndarray, top: float, bottom: float, fov: float, place) -> tuple[list, list]:
    """Camera distance and target height that make the lamp span screen v top..bottom. place(d, ty) -> position."""
    d, ty = 1.0, float(points[:, 1].mean())
    for _ in range(200):
        v = project_v(points, place(d, ty), np.array([0, ty, 0]), fov)
        span, mid = v.max() - v.min(), (v.max() + v.min()) / 2
        d *= (span / (bottom - top)) ** 0.7
        ty -= (mid - (top + bottom) / 2) * 2 * d * math.tan(math.radians(fov) / 2) * 0.7
    return [round(float(c), 4) for c in place(d, ty)], [0, round(ty, 4), 0]


def cameras(outlines: list[np.ndarray], height: float, eye: float, top: float, bottom: float) -> dict:
    """Front views from the photo camera's height, framed as the photo; the 3/4 view as a seated guest sees it."""
    pts = lamp_points(outlines, height)
    fa = math.radians(FRONT["azimuth"])
    front = lambda d, ty: np.array([d * math.sin(fa), eye / 100, d * math.cos(fa)])  # noqa: E731
    az, el = math.radians(THREE_Q["azimuth"]), math.radians(THREE_Q["elevation"])
    quarter = lambda d, ty: np.array([d * math.cos(el) * math.sin(az), ty + d * math.sin(el), d * math.cos(el) * math.cos(az)])  # noqa: E731
    card = lambda v: 0.02 + 0.96 * v  # noqa: E731
    return {
        "front": frame(pts, top, bottom, FRONT["fov"], front),
        "card": frame(pts, card(top), card(bottom), FRONT["fov"], front),
        "quarter": frame(pts, THREE_Q["top"], THREE_Q["bottom"], THREE_Q["fov"], quarter),
    }


# --- sheet ----------------------------------------------------------------------------------------------------------


def font(size: int, bold: bool = False):
    for name in ("segoeuib.ttf", "arialbd.ttf") if bold else ("segoeui.ttf", "arial.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def profile_panel(img: np.ndarray, sil: Silhouette, f: PhotoFit, size: tuple[int, int]) -> Image.Image:
    """The photo, faded, with the model's outline as the fitted camera sees it (red) over it."""
    im = Image.fromarray((255 - (255 - img) * 0.45).astype(np.uint8))
    dr = ImageDraw.Draw(im)
    for side in (-1, 1):
        dr.line([(sil.axis + side * h, r) for h, r in zip(f.model, f.rows)], fill=(220, 20, 30), width=3)
    return im.resize(size, Image.LANCZOS)


def delta_panel(f: PhotoFit, photo_h: int, height: float, sc: dict, size: tuple[int, int]) -> Image.Image:
    """Signed outline distance per photo row (+: photo wider than the model), lined up with the photo panel."""
    w, h = size
    im = Image.new("RGB", size, (250, 250, 248))
    dr = ImageDraw.Draw(im)
    to_y = lambda row: row * h / photo_h  # noqa: E731
    lim = max(2.0, min(10.0, math.ceil(sc["p95Mm"] * 1.5)))
    x0, x1 = 100, w - 40
    to_x = lambda mm: (x0 + x1) / 2 + mm / lim * (x1 - x0) / 2  # noqa: E731
    ft = font(22)
    y_top, y_bot = to_y(f.rows[0]), to_y(f.rows[-1])
    for y in range(0, int(height) + 1, 2):
        py = to_y(f.to_row(y))
        dr.line([(x0, py), (x1, py)], fill=(236, 236, 233), width=1)
        dr.text((x0 - 12, py), f"{y} cm", fill=(130, 130, 130), font=ft, anchor="rm")
    for mm in (-lim, -lim / 2, 0, lim / 2, lim):
        dr.line([(to_x(mm), y_top - 10), (to_x(mm), y_bot + 10)], fill=(150, 150, 150) if mm == 0 else (222, 222, 219), width=1)
        dr.text((to_x(mm), y_bot + 16), f"{mm:+.1f}" if mm else "0", fill=(110, 110, 110), font=ft, anchor="mt")
    pts = [(to_x(float(np.clip(v, -lim, lim))), to_y(r)) for v, r in zip(sc["signed"], f.rows)]
    dr.line(pts, fill=(30, 60, 200), width=2)
    dr.text((to_x(0), y_bot + 52), "mm, + fotoğraf geniş (model ince), − model geniş", fill=(90, 90, 90), font=ft, anchor="mt")
    dr.text(
        (to_x(0), y_bot + 84),
        f"fotoğraf kamerası: {f.label} yükseklik, {f.dist:.0f} cm uzaklık",
        fill=(90, 90, 90),
        font=ft,
        anchor="mt",
    )
    return im


def compose(key: str, product: dict, finish: str, photo: Path, frames: dict[str, Path], sil, f: PhotoFit, height, sc, out: Path):
    W, H = 800, 960
    gap, head, label = 24, 150, 40
    sheet = Image.new("RGB", (3 * W + 4 * gap, head + 2 * (H + label) + gap + 30), (255, 255, 255))
    dr = ImageDraw.Draw(sheet)
    dr.text((gap, 26), f"{product['name']}  ·  model {key}  ·  {finish}", fill=(20, 20, 20), font=font(44, True))
    side = "model ince" if sc["maxSide"] == "model narrower" else "model geniş"
    dr.text(
        (gap, 90),
        f"Profil uyumu: ortalama {sc['meanMm']:.2f} mm · %95 {sc['p95Mm']:.2f} mm · en büyük {sc['maxMm']:.2f} mm (y {sc['maxAtCm']:.1f} cm, {side})",
        fill=(60, 60, 60),
        font=font(30),
    )
    img = load_rgb(photo)
    tiles = [
        ("Fotoğraf", Image.open(photo).convert("RGB")),
        ("Gündüz · lamba kapalı", Image.open(frames["day"]).convert("RGB")),
        (f"Gece · {NIGHT_K} K", Image.open(frames["night"]).convert("RGB")),
        ("3/4 · akşam", Image.open(frames["quarter"]).convert("RGB")),
        ("Profil: model (kırmızı) fotoğrafın üstünde", profile_panel(img, sil, f, (W, H))),
        ("Fark", delta_panel(f, img.shape[0], height, sc, (W, H))),
    ]
    for i, (text, tile) in enumerate(tiles):
        x = gap + (i % 3) * (W + gap)
        y = head + (i // 3) * (H + label + gap)
        sheet.paste(tile.resize((W, H), Image.LANCZOS), (x, y + label))
        dr.text((x, y), text, fill=(40, 40, 40), font=font(26, True))
    sheet.save(out, quality=92)


# --- main -----------------------------------------------------------------------------------------------------------


def shot_call(model: str, finish: str, out: str, mode: str, on: bool, cam: tuple, fov: float, size: tuple[int, int], **extra) -> str:
    args = {"model": model, "finish": finish, "mode": mode, "on": on, "k": NIGHT_K, "pos": cam[0], "target": cam[1], "fov": fov,
            "size": list(size), **SHOT, **extra, "out": out}
    return f"await window.shot({json.dumps(args)});"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("key", help="modelKey (src/three/kit/specs/<key>.ts)")
    ap.add_argument("action", choices=["shots", "sheet"])
    ap.add_argument("--slug", required=True, help="product slug (or prefix)")
    ap.add_argument("--finish", help="finish slug (src/three/finishes.ts)")
    ap.add_argument("--photo", help="image id or prefix")
    ap.add_argument("--cam-height", type=float, help="the photo camera's height in cm, when the fit gets it wrong (one camera)")
    ap.add_argument("--under", action="store_true", help="the photo shows the hat's or shade's underside: camera below it")
    ap.add_argument("--upload", action="store_true", help="sheet: upload the night card image as the product's nightImage")
    args = ap.parse_args()

    spec = load_spec(args.key)
    product = find_product(args.slug)
    images = product["images"]
    known = finishes()
    if args.photo:
        image = next(i for i in images if i["id"].startswith(args.photo))
    else:
        image = next((i for i in images if args.finish and args.finish in i["fileName"]), images[0])
    finish = args.finish or next((f for f in known if f in image["fileName"]), "ceviz" if spec["body"].get("grain") else "gold")
    if finish not in known:
        raise SystemExit(f"unknown finish '{finish}': {known}")
    photo = DATA / "images" / f"{image['id']}.webp"

    outlines = parts(spec)
    height = float(max(o[:, 1].max() for o in outlines))
    img = load_rgb(photo)
    sil = silhouette(img)
    under = (spec["hat"]["led"]["y"] if spec.get("hat") else spec["shade"]["y"]) if args.under else None
    f = fit_camera(outlines, height, sil, args.cam_height, under)
    names = {k: f"_test/review-{args.key}-{k}.webp" for k in ("day", "night", "quarter")}
    card_name = f"_test/night-{args.key}.webp"

    if args.action == "shots":
        # the photo camera's height, kept to the lamp's lower and upper thirds' range so the view stays a front view
        # the photo camera's height where the head (hat, shade) is, kept to a front view
        eye = min(max(f.eye_at(0.8 * height), 0.3 * height), 1.1 * height)
        cams = cameras(outlines, height, eye, sil.top / img.shape[0], sil.bottom / img.shape[0])
        print(f"// {product['slug']}  photo {image['fileName']}  finish {finish}  height {height:.2f} cm  eye {eye:.1f} cm")
        print("// freshly loaded /dev-render tab, then in its console:")
        print(shot_call(args.key, finish, names["day"], "gunduz", False, cams["front"], FRONT["fov"], PANEL))
        print(shot_call(args.key, finish, names["night"], "gece", True, cams["front"], FRONT["fov"], PANEL))
        print(shot_call(args.key, finish, names["quarter"], "aksam", True, cams["quarter"], THREE_Q["fov"], PANEL))
        print(shot_call(args.key, finish, card_name, "gece", True, cams["card"], FRONT["fov"], CARD, quality=0.9))
        if math.hypot(*cams["front"][0]) > 2.2:
            print("// note: the camera is over 2 m away; check it isn't behind something in the room, else raise FRONT['fov']")
        return

    missing = [n for n in [*names.values(), card_name] if not (RENDERS / n).exists()]
    if missing:
        raise SystemExit(f"missing renders (run `shots` first): {missing}")
    sc = score(f)
    print(f"{product['slug']}  photo {image['fileName']}  finish {finish}  height {height:.2f} cm")
    b, t = f.eye
    print(f"photo camera: {b:.1f} cm high seen from the bottom, {t:.1f} cm from the top, {f.dist:.0f} cm away")
    print(
        f"profile fit: mean {sc['meanMm']:.2f} mm, 95% {sc['p95Mm']:.2f} mm, max {sc['maxMm']:.2f} mm"
        f" at y {sc['maxAtCm']:.2f} cm ({sc['maxSide']})"
    )
    OUT.mkdir(parents=True, exist_ok=True)
    sheet = OUT / f"{args.key}-sheet.webp"
    compose(args.key, product, finish, photo, {k: RENDERS / n for k, n in names.items()}, sil, f, height, sc, sheet)
    print(f"wrote {sheet}")
    if args.upload:
        card = RENDERS / card_name
        sys.stdout.flush()
        subprocess.run(["node", "--no-warnings", "--env-file=.env.local", "tools/upload-night.mjs", args.slug, str(card)], cwd=ROOT, check=True)


if __name__ == "__main__":
    main()
