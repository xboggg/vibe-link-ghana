import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationVariant = "fade-up" | "fade-down" | "slide-right" | "slide-left" | "blur" | "split" | "wave";

interface AnimatedHeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
}

const getVariants = (variant: AnimationVariant): Variants => {
  switch (variant) {
    case "fade-up":
      return {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      };
    case "fade-down":
      return {
        hidden: { opacity: 0, y: -30 },
        visible: { opacity: 1, y: 0 }
      };
    case "slide-right":
      return {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
      };
    case "slide-left":
      return {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 }
      };
    case "blur":
      return {
        hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
        visible: { opacity: 1, filter: "blur(0px)", y: 0 }
      };
    case "split":
      return {
        hidden: { opacity: 0, scaleY: 0, originY: 0 },
        visible: { opacity: 1, scaleY: 1 }
      };
    case "wave":
      return {
        hidden: { opacity: 0, y: 40, rotateX: -90 },
        visible: { opacity: 1, y: 0, rotateX: 0 }
      };
    default:
      return {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      };
  }
};

export function AnimatedHeading({
  children,
  as: Component = "h2",
  className,
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  once = true
}: AnimatedHeadingProps) {
  const MotionComponent = motion[Component];

  return (
    <MotionComponent
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={getVariants(variant)}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
    >
      {children}
    </MotionComponent>
  );
}

// Character-by-character animation for special headings
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

export function AnimatedText({
  text,
  className,
  delay = 0,
  staggerDelay = 0.03,
  once = true
}: AnimatedTextProps) {
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay
      }
    }
  };

  const wordVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: -90
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  return (
    <motion.span
      className={cn("inline-flex flex-wrap", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={containerVariants}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.25em]"
          variants={wordVariants}
          style={{ perspective: "1000px" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Highlight text with reveal animation
interface AnimatedHighlightProps {
  children: React.ReactNode;
  className?: string;
  highlightClassName?: string;
  delay?: number;
  once?: boolean;
}

export function AnimatedHighlight({
  children,
  className,
  highlightClassName = "text-primary",
  delay = 0.3,
  once = true
}: AnimatedHighlightProps) {
  return (
    <motion.span
      className={cn("relative inline-block", className)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <span className={highlightClassName}>{children}</span>
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-current"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once, margin: "-50px" }}
        transition={{ duration: 0.6, delay: delay + 0.2, ease: [0.25, 0.4, 0.25, 1] }}
      />
    </motion.span>
  );
}
