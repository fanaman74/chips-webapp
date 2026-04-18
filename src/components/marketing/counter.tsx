"use client";

import * as React from "react";
import { animate, useInView, useMotionValue, useTransform } from "framer-motion";

type Props = {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
};

export function Counter({ value, decimals = 0, duration = 1.6, className }: Props) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    v.toLocaleString("en-EU", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration,
      ease: [0.2, 0.8, 0.2, 1],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, value, duration, mv, rounded]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
