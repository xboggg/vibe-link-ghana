import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { AnimatedHeading, AnimatedText } from "@/components/AnimatedHeading";

const eventTypes = [
  { icon: "💒", title: "Weddings", slug: "wedding" },
  { icon: "⚰️", title: "Funerals", slug: "funeral" },
  { icon: "👶", title: "Naming Ceremonies", slug: "naming" },
  { icon: "💍", title: "Anniversaries", slug: "anniversary" },
  { icon: "🎓", title: "Graduations", slug: "graduation" },
  { icon: "⛪", title: "Church Events", slug: "church" },
  { icon: "🏢", title: "Corporate Events", slug: "corporate" },
];

export function EventTypesSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/50 relative overflow-hidden">
      <ParallaxBackground variant="waves" />
      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <AnimatedHeading
            as="span"
            variant="fade-up"
            className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-4"
          >
            Our Expertise
          </AnimatedHeading>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            <AnimatedText text="For Every" className="justify-center" />
            {" "}
            <AnimatedHeading
              as="span"
              variant="blur"
              delay={0.3}
              className="text-gradient-gold inline-block"
            >
              Ghanaian
            </AnimatedHeading>
            {" "}
            <AnimatedHeading as="span" variant="wave" delay={0.5} className="inline-block">
              Celebration
            </AnimatedHeading>
          </h2>
          <AnimatedHeading
            as="p"
            variant="fade-up"
            delay={0.4}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            From joyful weddings to solemn funerals, we create beautiful digital
            experiences that honor your traditions.
          </AnimatedHeading>
        </div>

        {/* Event Types Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {eventTypes.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/portfolio?type=${event.slug}`}
                className="group flex flex-col items-center p-6 rounded-2xl bg-card border border-border hover:border-secondary/50 hover:shadow-gold transition-all duration-300"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {event.icon}
                </span>
                <span className="text-sm font-medium text-foreground text-center">
                  {event.title}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
