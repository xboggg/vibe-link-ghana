import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useRef } from "react";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-[#7C3AED] relative overflow-hidden">
      {/* Background Effects with Parallax */}
      <div className="absolute inset-0 bg-pattern-dots opacity-10" />
      <motion.div style={{ y: y1 }} className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <motion.div style={{ y: y2 }} className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      {/* Parallax decorative elements */}
      <motion.div 
        style={{ y: y1 }} 
        className="absolute top-20 right-[10%] w-20 h-20 border border-white/10 rounded-lg rotate-12"
      />
      <motion.div 
        style={{ y: y2 }} 
        className="absolute bottom-20 left-[8%] w-16 h-16 border border-white/10 rounded-full"
      />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Create Something Beautiful?
          </h2>

          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Let us help you celebrate your next milestone with a stunning digital invitation.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild 
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8"
            >
              <Link to="/get-started">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8"
            >
              <Link to="/portfolio">
                View Our Work
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
