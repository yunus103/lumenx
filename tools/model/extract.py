"""Lathe profile from a product photo, for the kit specs (src/three/kit/specs).

    python tools/model/extract.py <slug> --height <cm> [--image <id>] [--split y1,y2...] [--y0 <px>]

Reads tools/data/lightdesign.json and tools/data/images/<id>.webp (first image unless --image; a slug or id prefix
is enough), prints a ready-to-paste `profile: [...]` per part and writes tools/model/out/<slug>.json and
<slug>-overlay.png (outline mirrored on both sides, axis in blue, ground plane y0 and top in green).

How it works: the background is the median colour of the image border; a pixel is lamp when its colour distance
from it is large, or when it sits on a strong edge (so white parts on the grey background are still outlined).
Per row the silhouette is walked outward from the lamp's axis, bridging small gaps and any gap that is matched on the
other side (white interiors), so one-sided things like the TÜRK PATENT logo drop out. Edges are then placed at half
contrast for sub-pixel accuracy, and r is the two sides' mean weighted by how crisp each edge is (a lit white side
fading into the background comes out short). The camera looks down, so the base's bottom shows as half an ellipse:
the row where the base reaches its full width is taken as the ground plane (check the green line in the overlay; a
flared or rounded base can fool it, then pass --y0), and the height from there to the top is the given --height.

Limits: glass and other see-through parts can't be extracted (the background shows through, the outline breaks up);
model those by hand. Perspective also turns the top rim of a wide part into the back half of an ellipse, so just
above a wide flat top (a base, a hat) the silhouette is a little higher and narrower than the real profile.
"""

from __future__ import annotations

import argparse
import json
import math
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "tools" / "data"
OUT = ROOT / "tools" / "model" / "out"

COLOR_T = 5.0  # a white rim can be only ~8 off the grey; the cutout halos this also catches are undone by _edge
GRAD_T = 4.0  # a blurred white-on-grey edge still clears this
GRAD_FLOOR = 3.0  # an edge pixel must itself differ a little from the background, so the edge isn't grown outward
EDGE_SPAN = 16  # px inward from the outermost lamp pixel sampled for the inside level, past any halo or ringing
GAP = 8  # px of background a row walk may cross on one side only
HALO_RATIO = 0.3
HALO_MAX = 25.0  # ringing on the scraped cutouts stays under this; a lit white rim can be fainter still, see _trim_halo
HALO_SPAN = 16  # rows
DP_TOL = 0.03  # cm
CORNER_DEG = 35.0
CORNER_ARM = 0.15  # cm


def load_rgb(path: Path | str) -> np.ndarray:
    return np.asarray(Image.open(path).convert("RGB"), dtype=np.float32)


def background(img: np.ndarray, border: int = 6) -> tuple[np.ndarray, float]:
    """Median border colour and the border's noise (99th percentile distance from it)."""
    strip = np.concatenate(
        [img[:border].reshape(-1, 3), img[-border:].reshape(-1, 3), img[:, :border].reshape(-1, 3), img[:, -border:].reshape(-1, 3)]
    )
    colour = np.median(strip, axis=0)
    noise = float(np.percentile(np.sqrt(((strip - colour) ** 2).sum(1)), 99))
    return colour, noise


def distance(img: np.ndarray, colour: np.ndarray) -> np.ndarray:
    return np.sqrt(((img - colour) ** 2).sum(2))


def gradient(d: np.ndarray) -> np.ndarray:
    p = np.pad(d, 1, mode="edge")
    gx = (p[:-2, 2:] + 2 * p[1:-1, 2:] + p[2:, 2:]) - (p[:-2, :-2] + 2 * p[1:-1, :-2] + p[2:, :-2])
    gy = (p[2:, :-2] + 2 * p[2:, 1:-1] + p[2:, 2:]) - (p[:-2, :-2] + 2 * p[:-2, 1:-1] + p[:-2, 2:])
    return np.hypot(gx, gy) / 8


def foreground(d: np.ndarray, noise: float) -> np.ndarray:
    # noisy backgrounds (renders, real photos) raise the thresholds; the scraped cutouts have a perfectly flat one
    color_t = max(COLOR_T, 3 * noise)
    grad_t = max(GRAD_T, 1.5 * noise)
    floor = max(GRAD_FLOOR, 1.5 * noise)
    return (d > color_t) | ((gradient(d) > grad_t) & (d > floor))


def _walk(dl: np.ndarray, dr: np.ndarray) -> tuple[int, int] | None:
    """Outermost lamp pixel on each side, as distances from the axis column. dl/dr: sorted distances of foreground
    pixels left/right of it. Crosses gaps up to GAP on its own; a larger gap only when it lands no further out than
    the other side already reaches, or when both sides have a matching one, because a turned part is symmetric and a
    logo or a neighbour object is not."""
    il = ir = 0
    last_l = last_r = 0
    found = False
    while True:
        while il < dl.size and dl[il] - last_l <= GAP + 1:
            last_l = dl[il]
            il += 1
        while ir < dr.size and dr[ir] - last_r <= GAP + 1:
            last_r = dr[ir]
            ir += 1
        found = found or il > 0 or ir > 0
        nl = dl[il] if il < dl.size else None
        nr = dr[ir] if ir < dr.size else None
        if found and nl is not None and nl <= last_r + max(4, 0.06 * last_r):
            last_l = nl
        elif found and nr is not None and nr <= last_l + max(4, 0.06 * last_l):
            last_r = nr
        elif nl is not None and nr is not None and abs(nl - nr) <= max(4, 0.06 * max(nl, nr)):
            last_l, last_r, found = nl, nr, True
        else:
            break
    return (int(last_l), int(last_r)) if found else None


def _edge(d: np.ndarray, mask: np.ndarray, x_out: int, step: int, reach: int) -> tuple[float, float]:
    """Sub-pixel edge near the outermost lamp pixel x_out of a row, at half the contrast between the background just
    outside and the part just inside (soft cutout halos and blurred fabric edges move a fixed threshold by pixels).
    The inside is the unbroken lamp run at the edge, so a faint rim line in front of a highlight sets its own level.
    Also returns the edge's steepness (distance step per px), low where a lit white side fades into the background.
    step points inward (+1 / -1); reach: px to the axis."""
    n = d.size
    span = 1
    while span < min(EDGE_SPAN, reach) and 0 <= x_out + span * step < n and mask[x_out + span * step]:
        span += 1
    if span < 3:  # a speck of compression noise, not a rim: look past it
        span = max(2, min(EDGE_SPAN, reach))
    inside = d[[x_out + k * step for k in range(span) if 0 <= x_out + k * step < n]]
    outside = d[[x_out - k * step for k in range(2, 5) if 0 <= x_out - k * step < n]]
    if not outside.size:
        return x_out - 0.5 * step, 0.0
    level = (float(np.median(inside)) + float(np.median(outside))) / 2
    x = x_out - 2 * step
    for _ in range(span + 2):
        if not 0 <= x + step < n:
            break
        a, b = d[x], d[x + step]
        if a < level <= b:
            near = d[[x + k * step for k in range(-2, 4) if 0 <= x + k * step < n]]
            return x + step * (level - a) / (b - a), float(np.abs(np.diff(near)).max())
        x += step
    return x_out - 0.5 * step, 0.0


@dataclass
class Silhouette:
    top: int  # first and last lamp row
    bottom: int
    axis: float  # column
    left: np.ndarray  # per row from top to bottom, px from the axis (NaN where empty)
    right: np.ndarray
    steep_l: np.ndarray  # edge steepness per row
    steep_r: np.ndarray

    @property
    def r(self) -> np.ndarray:
        """The two sides weighted by their edge's steepness, so a side that fades into the background (lit white
        paint, where the edge comes out short) gives way to a crisp one; equal edges give the plain mean."""
        wl = _smooth(self.steep_l, 9) ** 2 + 1e-6
        wr = _smooth(self.steep_r, 9) ** 2 + 1e-6
        return (wl * self.left + wr * self.right) / (wl + wr)


def silhouette(img: np.ndarray) -> Silhouette:
    colour, noise = background(img)
    d = distance(img, colour)
    mask = foreground(d, noise)
    h = mask.shape[0]

    cols = mask.sum(0)
    axis = float(np.median(np.flatnonzero(cols >= 0.9 * cols.max())))
    for _ in range(3):
        a = int(round(axis))
        left = np.full(h, np.nan)
        right = np.full(h, np.nan)
        steep_l = np.zeros(h)
        steep_r = np.zeros(h)
        for y in range(h):
            xs = np.flatnonzero(mask[y])
            if not xs.size:
                continue
            ext = _walk(a - xs[xs <= a][::-1], xs[xs >= a] - a)
            if ext is None:
                continue
            xl, steep_l[y] = _edge(d[y], mask[y], a - ext[0], 1, ext[0])
            xr, steep_r[y] = _edge(d[y], mask[y], a + ext[1], -1, ext[1])
            left[y], right[y] = axis - xl, xr - axis
        valid = np.isfinite(left) & (left + right > 2)
        mids = axis + (right[valid] - left[valid]) / 2
        shift = float(np.median(mids)) - axis
        axis += shift
        left -= shift
        right += shift
        if abs(shift) < 0.25:
            break

    # the lamp is the longest run of valid rows, allowing short breaks
    rows = np.flatnonzero(valid)
    breaks = np.flatnonzero(np.diff(rows) > 4)
    starts = np.r_[0, breaks + 1]
    ends = np.r_[breaks, rows.size - 1]
    i = int(np.argmax(rows[ends] - rows[starts]))
    top, bottom = int(rows[starts[i]]), int(rows[ends[i]])
    top, bottom = _trim_halo(d, axis, left, right, valid, top, 1), _trim_halo(d, axis, left, right, valid, bottom, -1)
    outside = np.ones(h, bool)
    outside[top : bottom + 1] = False
    left[outside | ~valid] = np.nan
    right[outside | ~valid] = np.nan
    return Silhouette(top, bottom, axis, left, right, steep_l, steep_r)


def _trim_halo(d: np.ndarray, axis: float, left: np.ndarray, right: np.ndarray, valid: np.ndarray, end: int, step: int) -> int:
    """First real lamp row from end (top, step +1, or bottom, step -1). Compression ringing leaves faint rows past a
    dark part's crisp end: they are dropped when they are faint in absolute terms and next to the strongest row within
    HALO_SPAN, and the part's own end rises sharply. A lit white top fades in over many rows and is kept whole."""

    def peak(y: int) -> float:
        return float(d[y, int(axis - left[y]) : int(axis + right[y]) + 1].max(initial=0)) if valid[y] else 0.0

    def inner(y: int) -> float:
        return max(peak(y + k * step) for k in range(1, HALO_SPAN + 1))

    y = end
    while abs(y - end) < HALO_SPAN and peak(y) < HALO_MAX and peak(y) < HALO_RATIO * inner(y):
        y += step
    sharp = peak(y + 2 * step) >= 0.5 * max(peak(y), inner(y))
    return y if sharp else end


def _smooth(r: np.ndarray, k: int = 5) -> np.ndarray:
    p = np.pad(r, k // 2, mode="edge")
    return np.median(np.lib.stride_tricks.sliding_window_view(p, k), axis=1)


def _fill(r: np.ndarray) -> np.ndarray:
    ok = np.isfinite(r)
    idx = np.arange(r.size)
    return np.interp(idx, idx[ok], r[ok])


def ground_plane(r_up: np.ndarray, plateau: int = 8, tol: float = 1.0) -> int | None:
    """Rows above the bottom where the base reaches its full width (the centre of the base's bottom ellipse).
    r_up: radius per row from the bottom row up. None when the bottom is rounded (no flat-walled base)."""
    n = len(r_up)
    for k in range(1, int(0.15 * n)):
        ahead = r_up[k : k + plateau + 1]
        # an ellipse reaches its full width within r * sin(elevation) rows (elevation up to ~45 deg seen here); later
        # plateaus are the body's own shape
        if r_up[k] >= ahead.max() - tol and k <= 0.7 * r_up[k] and r_up[k] > 0.5 * r_up[: int(0.15 * n)].max():
            return k + int(np.argmax(ahead >= ahead.max() - 0.3))
    return None


@dataclass
class Measure:
    sil: Silhouette
    y0: int  # rows above the bottom row
    flat_base: bool
    cm_px: float
    y: np.ndarray  # cm, per row from the ground plane up
    r: np.ndarray  # cm, smoothed
    raw: np.ndarray  # cm, unsmoothed
    asym: np.ndarray  # cm, left minus right


def measure(img: np.ndarray, height: float, y0: int | None = None) -> Measure:
    """y0: ground plane in rows above the lowest lamp pixel, found from the base when not given."""
    sil = silhouette(img)
    rows = slice(sil.top, sil.bottom + 1)
    raw_px = _fill(sil.r[rows])[::-1]
    asym_px = _fill(sil.left[rows] - sil.right[rows])[::-1]
    # 8 px webp blocks shift faint edges in steps; this keeps them out of the simplified profile
    r_px = np.convolve(np.pad(_smooth(raw_px, 9), 1, mode="edge"), np.ones(3) / 3, "valid")
    if y0 is None:
        y0 = ground_plane(r_px)
    flat = y0 is not None
    y0 = y0 or 0
    ph = sil.bottom - sil.top
    cm_px = height / (ph - y0)
    k = np.arange(raw_px.size)
    keep = k >= y0
    return Measure(sil, y0, flat, cm_px, (k[keep] - y0) * cm_px, r_px[keep] * cm_px, raw_px[keep] * cm_px, asym_px[keep] * cm_px)


def douglas_peucker(pts: np.ndarray, tol: float) -> np.ndarray:
    keep = np.zeros(len(pts), bool)
    keep[[0, -1]] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        if j <= i + 1:
            continue
        a, b = pts[i], pts[j]
        ab = b - a
        n = math.hypot(*ab) or 1.0
        seg = pts[i + 1 : j] - a
        dist = np.abs(ab[0] * seg[:, 1] - ab[1] * seg[:, 0]) / n
        m = int(np.argmax(dist))
        if dist[m] > tol:
            keep[i + 1 + m] = True
            stack += [(i, i + 1 + m), (i + 1 + m, j)]
    return pts[keep]


def _along(poly: np.ndarray, cum: np.ndarray, s: float) -> np.ndarray:
    s = min(max(s, 0.0), float(cum[-1]))
    return np.array([np.interp(s, cum, poly[:, 0]), np.interp(s, cum, poly[:, 1])])


def corners(poly: np.ndarray) -> np.ndarray:
    """Vertices where the outline turns sharply, judged over CORNER_ARM on each side so pixel jitter between close
    vertices doesn't count, and only the sharpest vertex of each bend."""
    cum = np.r_[0, np.cumsum(np.hypot(*np.diff(poly, axis=0).T))]
    turn = np.zeros(len(poly))
    for i in range(1, len(poly) - 1):
        u = poly[i] - _along(poly, cum, cum[i] - CORNER_ARM)
        v = _along(poly, cum, cum[i] + CORNER_ARM) - poly[i]
        turn[i] = abs(math.degrees(math.atan2(u[0] * v[1] - u[1] * v[0], u @ v)))
    near = np.abs(cum[:, None] - cum[None, :]) < CORNER_ARM
    return (turn > CORNER_DEG) & (turn >= np.where(near, turn[None, :], 0).max(1))


def to_profile(y: np.ndarray, r: np.ndarray, y_from: float, y_to: float) -> list[list[float]]:
    """Closed turned profile [r, y, corner?] between two heights, axis to axis."""
    sel = (y >= y_from - 1e-9) & (y <= y_to + 1e-9)
    ys, rs = y[sel], r[sel]
    pts = np.column_stack([np.r_[0, rs, 0], np.r_[ys[0], ys, ys[-1]]])
    simple = douglas_peucker(pts, DP_TOL)
    hard = corners(simple)
    return [[round(float(pr), 2), round(float(py), 2), *([1] if c else [])] for (pr, py), c in zip(simple, hard)]


def format_profile(profile: list[list[float]], per_line: int = 6) -> str:
    def num(v: float) -> str:
        return f"{v:.2f}".rstrip("0").rstrip(".")

    items = ["[" + ", ".join(num(v) if k < 2 else "1" for k, v in enumerate(p)) + "]" for p in profile]
    lines = [", ".join(items[i : i + per_line]) + "," for i in range(0, len(items), per_line)]
    return "profile: [\n  " + "\n  ".join(lines) + "\n],"


def overlay(img: np.ndarray, m: Measure, parts: list[list[list[float]]], path: Path) -> None:
    im = Image.fromarray(img.astype(np.uint8))
    dr = ImageDraw.Draw(im)
    s = m.sil
    a = s.axis
    ground = s.bottom - m.y0
    dr.line([(a, s.top - 20), (a, s.bottom + 20)], fill=(40, 90, 255), width=1)
    for row in (ground, s.top):
        dr.line([(a - 400, row), (a + 400, row)], fill=(0, 170, 60), width=1)
    for prof in parts:
        px = [(p[0] / m.cm_px, ground - p[1] / m.cm_px) for p in prof]
        for side in (-1, 1):
            dr.line([(a + side * x, y) for x, y in px], fill=(230, 20, 20), width=1)
            for p, (x, y) in zip(prof, px):
                if len(p) > 2:
                    dr.ellipse([a + side * x - 2.5, y - 2.5, a + side * x + 2.5, y + 2.5], outline=(230, 20, 20))
    im.save(path)


def score(photo_path: Path | str, render_path: Path | str, samples: int = 400) -> dict[str, float]:
    """Silhouette match of a render against a photo, both normalised to their ground-to-top height: IoU of the two
    turned silhouettes and the mean width difference in % of the height."""
    widths = []
    for p in (photo_path, render_path):
        m = measure(load_rgb(p), 1.0)
        grid = np.linspace(0, 1, samples)
        widths.append(2 * np.interp(grid, m.y, m.raw))
    a, b = widths
    return {
        "iou": float(np.minimum(a, b).sum() / np.maximum(a, b).sum()),
        "widthError": float(np.abs(a - b).mean() * 100),
    }


def find_product(slug: str) -> dict:
    products = json.loads((DATA / "lightdesign.json").read_text(encoding="utf-8"))["products"]
    exact = [p for p in products if p["slug"] == slug]
    found = exact or [p for p in products if p["slug"].startswith(slug)]
    if len(found) != 1:
        raise SystemExit(f"{len(found)} products match '{slug}': {[p['slug'] for p in found][:8]}")
    return found[0]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("slug")
    ap.add_argument("--height", type=float, required=True, help="ground to top, cm")
    ap.add_argument("--image", help="image id or prefix (default: the first image)")
    ap.add_argument("--split", help="cut heights in cm, e.g. 18.3 for body / hat")
    ap.add_argument("--y0", type=int, help="ground plane in px above the lowest pixel, when the overlay shows it wrong")
    args = ap.parse_args()

    product = find_product(args.slug)
    images = product["images"]
    image = next((i for i in images if i["id"].startswith(args.image)), None) if args.image else images[0]
    if image is None:
        raise SystemExit(f"no image '{args.image}' in {[i['id'][:8] + ' ' + i['fileName'] for i in images]}")
    img = load_rgb(DATA / "images" / f"{image['id']}.webp")
    m = measure(img, args.height, args.y0)

    cuts = [0.0, *sorted(float(v) for v in args.split.split(","))] if args.split else [0.0]
    cuts.append(float(m.y[-1]))
    parts = [to_profile(m.y, m.r, a, b) for a, b in zip(cuts, cuts[1:])]

    asym_mm = np.abs(m.asym) * 10
    print(f"{product['slug']}  image {image['id'][:8]} {image['fileName']}")
    print(
        f"cm/px {m.cm_px:.4f}  y0 {m.y0}px above the bottom ({m.y0 * m.cm_px:.2f} cm)"
        + ("  [given]" if args.y0 is not None else "" if m.flat_base else "  [no flat base found: y0 = lowest pixel]")
    )
    worst = int(np.argmax(asym_mm))
    print(
        f"left-right asymmetry: mean {asym_mm.mean():.2f} mm, 95% under {np.percentile(asym_mm, 95):.2f} mm,"
        f" worst {asym_mm[worst]:.2f} mm at y {m.y[worst]:.2f}"
    )
    for (a, b), prof in zip(zip(cuts, cuts[1:]), parts):
        print(f"\n// y {a:.2f} .. {b:.2f}\n{format_profile(prof)}")

    OUT.mkdir(parents=True, exist_ok=True)
    name = product["slug"]
    (OUT / f"{name}.json").write_text(
        json.dumps(
            {
                "slug": name,
                "image": image["id"],
                "height": args.height,
                "cmPerPx": m.cm_px,
                "y0px": m.y0,
                "flatBase": m.flat_base,
                "axisPx": m.sil.axis,
                "topPx": m.sil.top,
                "bottomPx": m.sil.bottom,
                "asymmetryMm": {"mean": float(asym_mm.mean()), "p95": float(np.percentile(asym_mm, 95)), "max": float(asym_mm.max())},
                "rows": {
                    "y": np.round(m.y, 3).tolist(),
                    "r": np.round(m.raw, 3).tolist(),
                    "asym": np.round(m.asym, 3).tolist(),
                },
                "parts": [{"from": a, "to": b, "profile": p} for (a, b), p in zip(zip(cuts, cuts[1:]), parts)],
            },
            indent=1,
        ),
        encoding="utf-8",
    )
    overlay(img, m, parts, OUT / f"{name}-overlay.png")
    print(f"\nwrote {OUT / name}.json and -overlay.png")


if __name__ == "__main__":
    main()
