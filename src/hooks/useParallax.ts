import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

interface UseParallaxOptions {
  speed?: number;
  direction?: "up" | "down";
}

interface UseParallaxReturn {
  ref: React.RefObject<HTMLDivElement>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}

export function useParallax({ 
  speed = 0.5, 
  direction = "up" 
}: UseParallaxOptions = {}): UseParallaxReturn {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed * multiplier]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return { ref, y, opacity };
}
