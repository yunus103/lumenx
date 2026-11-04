"use client";

import { useRef } from "react";
import Link from "next/link";
import { easeOut, motion, transform, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SanityImage } from "@/components/ui/SanityImage";
import type { SanityImage as SanityImageType } from "@/types";

type LightStageProps = {
  day: SanityImageType;
  night: SanityImageType;
  alt: string;
  dayText?: string;
  nightText?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

// framer-motion can't interpolate var() colours, so these mirror --paper, --paper-ink and --fg.
const PAPER = "#efe9e0";
const DUSK = "#1e1517";
const FG = "#f3eadf";

// The switch happens in a short window (0.40–0.50): a flicker, then the room settles into the warm night state,
// which holds for the rest of the scroll (transform clamps past the last stop). The day copy is gone before the
// page starts to darken.
// These are plain functions on purpose: given a range array, useTransform on a useScroll value hands opacity and
// scale to a native ScrollTimeline, which ignores the target offsets here and left the day photo half visible.
const SWITCH = [0.4, 0.42, 0.44, 0.46, 0.5];
const toBg = transform([0.41, 0.5], [PAPER, DUSK], { ease: easeOut });
const toFg = transform([0.41, 0.5], [DUSK, FG], { ease: easeOut });
const toDayOpacity = transform(SWITCH, [1, 0.45, 0.8, 0.15, 0]);
const toNightOpacity = transform(SWITCH, [0, 0.65, 0.3, 0.9, 1]);
// a slow push-in; the night render frames the lamp a little larger than the studio photo
const toDayScale = transform([0, 0.5], [1, 1.1]);
const toNightScale = transform([0.4, 1], [1, 1.03]);
const toGlowOpacity = transform([0.42, 0.44, 0.46, 0.5, 0.62], [0, 0.5, 0.15, 0.7, 1]);
const toGlowScale = transform([0.42, 0.75], [0.75, 1.08], { ease: easeOut });
const toDayTextOpacity = transform([0.04, 0.14, 0.3, 0.38], [0, 1, 1, 0]);
const toDayTextY = transform([0.04, 0.14, 0.3, 0.38], [24, 0, 0, -24]);
const toNightTextOpacity = transform([0.56, 0.66], [0, 1]);
const toNightTextY = transform([0.56, 0.66], [24, 0]);

/**
 * A tall section with a sticky stage: scrolling through it switches the lamp on. The studio photo crossfades
 * into the night render while the paper around it darkens and a warm glow blooms; the copy follows the light.
 * Reduced motion shows the lit state as a plain section.
 */
export function LightStage({ day, night, alt, dayText, nightText, ctaLabel, ctaHref }: LightStageProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const bg = useTransform(p, toBg);
  const fg = useTransform(p, toFg);
  const dayOpacity = useTransform(p, toDayOpacity);
  const nightOpacity = useTransform(p, toNightOpacity);
  const dayScale = useTransform(p, toDayScale);
  const nightScale = useTransform(p, toNightScale);
  const glowOpacity = useTransform(p, toGlowOpacity);
  const glowScale = useTransform(p, toGlowScale);
  const dayTextOpacity = useTransform(p, toDayTextOpacity);
  const dayTextY = useTransform(p, toDayTextY);
  const nightTextOpacity = useTransform(p, toNightTextOpacity);
  const nightTextY = useTransform(p, toNightTextY);

  const lit = !!reduce;

  return (
    <motion.section
      ref={ref}
      className={`ls${lit ? " ls-static" : ""}`}
      style={lit ? { backgroundColor: DUSK, color: FG } : { backgroundColor: bg, color: fg }}
    >
      <div className="wrap ls-stage">
        <div className="ls-frame">
          <motion.div className="ls-glow" aria-hidden="true" style={lit ? undefined : { opacity: glowOpacity, scale: glowScale }} />
          {/* both load eagerly: a lazy night photo would still be fading in when the switch happens */}
          <motion.div className="ls-img" style={lit ? { opacity: 0 } : { opacity: dayOpacity, scale: dayScale }}>
            <SanityImage image={day} alt={alt} fill sizes="(max-width: 860px) 90vw, 46vw" quality={85} noBlur priority />
          </motion.div>
          <motion.div className="ls-img" style={lit ? undefined : { opacity: nightOpacity, scale: nightScale }}>
            <SanityImage image={night} alt="" fill sizes="(max-width: 860px) 90vw, 46vw" quality={85} noBlur priority />
          </motion.div>
          <motion.div className="ls-bloom" aria-hidden="true" style={lit ? undefined : { opacity: glowOpacity }} />
        </div>

        <div className="ls-copy">
          {dayText && (
            <motion.p style={lit ? undefined : { opacity: dayTextOpacity, y: dayTextY }}>{dayText}</motion.p>
          )}
          <motion.div className="ls-night" style={lit ? undefined : { opacity: nightTextOpacity, y: nightTextY }}>
            {nightText && <p>{nightText}</p>}
            {ctaLabel && ctaHref && (
              <Link className="btn btn-amber" href={ctaHref}>
                {ctaLabel}
              </Link>
            )}
          </motion.div>
        </div>
      </div>
      {/* dark runout below the released stage, so the night state hands over to the footer */}
      <div className="ls-runout" aria-hidden="true" />
    </motion.section>
  );
}
