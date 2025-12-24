import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxBackgroundProps {
  variant?: "dots" | "waves" | "geometric" | "gradient";
  className?: string;
}

export function ParallaxBackground({ 
  variant = "dots",
  className = ""
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  if (variant === "dots") {
    return (
      <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Floating dots with parallax */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-[10%] w-3 h-3 rounded-full bg-primary/20"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-40 right-[15%] w-2 h-2 rounded-full bg-secondary/30"
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute bottom-40 left-[20%] w-4 h-4 rounded-full bg-primary/15"
        />
        <motion.div
          style={{ y: y3 }}
          className="absolute top-1/3 right-[25%] w-2 h-2 rounded-full bg-secondary/25"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-1/4 right-[10%] w-3 h-3 rounded-full bg-primary/20"
        />
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Parallax wave patterns */}
        <motion.svg
          style={{ y: y1 }}
          className="absolute bottom-0 left-0 w-full h-32 opacity-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C150,20 350,100 600,60 C850,20 1050,100 1200,60 L1200,120 L0,120 Z"
            fill="hsl(var(--primary))"
          />
        </motion.svg>
        <motion.svg
          style={{ y: y2 }}
          className="absolute bottom-0 left-0 w-full h-24 opacity-10"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C200,40 400,120 600,80 C800,40 1000,120 1200,80 L1200,120 L0,120 Z"
            fill="hsl(var(--secondary))"
          />
        </motion.svg>
        {/* Top decorative wave */}
        <motion.svg
          style={{ y: y3 }}
          className="absolute top-0 left-0 w-full h-20 opacity-10 rotate-180"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C150,100 350,20 600,60 C850,100 1050,20 1200,60 L1200,0 L0,0 Z"
            fill="hsl(var(--primary))"
          />
        </motion.svg>
      </div>
    );
  }

  if (variant === "geometric") {
    return (
      <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Floating geometric shapes with parallax */}
        <motion.div
          style={{ y: y1, rotate }}
          className="absolute top-20 right-[10%] w-16 h-16 border border-primary/20 rounded-lg"
        />
        <motion.div
          style={{ y: y2, rotate }}
          className="absolute bottom-32 left-[8%] w-12 h-12 border border-secondary/25 rotate-45"
        />
        <motion.div
          style={{ y: y3 }}
          className="absolute top-1/2 right-[5%] w-20 h-20 border border-primary/15 rounded-full"
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute bottom-1/4 left-[15%] w-8 h-8 bg-primary/10 rounded"
        />
        {/* Diagonal lines */}
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/3 left-[5%] w-px h-24 bg-gradient-to-b from-transparent via-primary/20 to-transparent rotate-45"
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute bottom-1/3 right-[12%] w-px h-32 bg-gradient-to-b from-transparent via-secondary/20 to-transparent -rotate-45"
        />
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Animated gradient blobs */}
        <motion.div
          style={{ y: y1, scale }}
          className="absolute -top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2, scale }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/3 rounded-full blur-2xl"
        />
      </div>
    );
  }

  return null;
}
