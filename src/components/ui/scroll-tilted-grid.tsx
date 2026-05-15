import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  cubicBezier,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const easeIntoFocus = cubicBezier(0.22, 1, 0.36, 1);
const easeOutOfFocus = cubicBezier(0, 0, 0.58, 1);
const focusEase: [typeof easeIntoFocus, typeof easeOutOfFocus] = [
  easeIntoFocus,
  easeOutOfFocus,
];

const GAP_PX: Record<number, number> = { 4: 16, 6: 24, 8: 32, 10: 40, 12: 48, 14: 56 };
const MAX_WIDTH_PX: Record<string, string> = {
  sm: "384px", md: "448px", lg: "512px", xl: "576px",
  "2xl": "672px", "3xl": "768px", none: "100%",
};

export type MaxWidthToken = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "none";
export type GapToken = 4 | 6 | 8 | 10 | 12 | 14;

type Side = "L" | "R";

type TileConfig = {
  aspectRatio: string;
  perspective: number;
  maxTilt: number;
  maxBlur: number;
  rounded: string;
  onImageClick?: (src: string) => void;
};

function Tile({ src, side, config }: { src: string; side: Side; config: TileConfig }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const reduce = useReducedMotion();
  const sign = side === "L" ? -1 : 1;
  const { aspectRatio, perspective, maxTilt, maxBlur, rounded } = config;

  const blur     = useTransform(p, [0, 0.5, 1], [maxBlur, 0, maxBlur],   { ease: focusEase });
  const bright   = useTransform(p, [0, 0.5, 1], [0.1, 1, 0.1],           { ease: focusEase });
  const contrast = useTransform(p, [0, 0.5, 1], [2, 1, 2],               { ease: focusEase });
  const ty = useTransform(p, [0, 0.5, 1], ["80%", "0%", "-80%"],         { ease: focusEase });
  const tz = useTransform(p, [0, 0.5, 1], [200, 0, 200],                 { ease: focusEase });
  const rx = useTransform(p, [0, 0.5, 1], [maxTilt, 0, -maxTilt],        { ease: focusEase });
  const tx  = useTransform(p, [0, 0.5, 1], [`${sign * 30}%`, "0%", `${sign * 30}%`], { ease: focusEase });
  const rot = useTransform(p, [0, 0.5, 1], [-sign * 4, 0, sign * 4],     { ease: focusEase });
  const sk  = useTransform(p, [0, 0.5, 1], [sign * 15, 0, -sign * 15],   { ease: focusEase });
  const innerSY = useTransform(p, [0, 0.5, 1], [1.6, 1, 1.6],            { ease: focusEase });
  const filter = useMotionTemplate`blur(${blur}px) brightness(${bright}) contrast(${contrast})`;

  const { onImageClick } = config;

  if (reduce) {
    return (
      <figure ref={ref} style={{ position: "relative", margin: 0, cursor: onImageClick ? "pointer" : "default" }} onClick={() => onImageClick?.(src)}>
        <div style={{ position: "relative", width: "100%", overflow: "hidden", aspectRatio, borderRadius: rounded }}>
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </figure>
    );
  }

  return (
    <motion.figure
      ref={ref}
      style={{ position: "relative", margin: 0, perspective, willChange: "transform", cursor: onImageClick ? "pointer" : "default" }}
      onClick={() => onImageClick?.(src)}
    >
      <motion.div
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          aspectRatio,
          borderRadius: rounded,
          filter,
          x: tx,
          y: ty,
          z: tz,
          rotate: rot,
          rotateX: rx,
          skewX: sk,
          willChange: "filter, transform",
        }}
      >
        <motion.img
          src={src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            scaleY: innerSY,
            transformOrigin: "center",
          }}
        />
      </motion.div>
    </motion.figure>
  );
}

export type ScrollTiltedGridProps = {
  images?: readonly string[];
  loop?: boolean;
  initialCycles?: number;
  aspectRatio?: string;
  maxWidth?: MaxWidthToken;
  gap?: GapToken;
  perspective?: number;
  maxTilt?: number;
  maxBlur?: number;
  rounded?: string;
  className?: string;
  onImageClick?: (src: string) => void;
};

export function ScrollTiltedGrid({
  images = [],
  loop = false,
  initialCycles = 3,
  aspectRatio = "3/4",
  maxWidth = "2xl",
  gap = 10,
  perspective = 900,
  maxTilt = 70,
  maxBlur = 8,
  rounded = "4px",
  onImageClick,
}: ScrollTiltedGridProps = {}) {
  const [cycles, setCycles] = useState(loop ? initialCycles : 1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loop) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) setCycles((c) => c + 2); },
      { rootMargin: "1500px 0px 1500px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loop]);

  const items = useMemo(
    () => loop ? Array.from({ length: cycles }, () => images).flat() : [...images],
    [loop, cycles, images]
  );

  const config = useMemo<TileConfig>(
    () => ({ aspectRatio, perspective, maxTilt, maxBlur, rounded, onImageClick }),
    [aspectRatio, perspective, maxTilt, maxBlur, rounded, onImageClick]
  );

  const gapPx = GAP_PX[gap] ?? 40;
  const maxWidthPx = MAX_WIDTH_PX[maxWidth] ?? "672px";

  return (
    <section style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          margin: "0 auto",
          marginTop: "20vh",
          marginBottom: "10vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: gapPx,
          padding: "20vh 24px",
          width: "100%",
          maxWidth: maxWidthPx,
          boxSizing: "border-box",
        }}
      >
        {items.map((src, i) => (
          <Tile
            key={`${i}-${src}`}
            src={src}
            side={i % 2 === 0 ? "L" : "R"}
            config={config}
          />
        ))}
      </div>
      {loop ? <div ref={sentinelRef} aria-hidden style={{ height: 1, width: "100%" }} /> : null}
    </section>
  );
}
