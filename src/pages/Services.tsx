import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/sections/CTASection";
import SEO, { createServiceSchema, createBreadcrumbSchema } from "@/components/SEO";
import {
  Heart,
  Users,
  Baby,
  Cake,
  GraduationCap,
  Building,
  Check,
  Calendar,
  MapPin,
  Camera,
  MessageSquare,
  Video,
  Globe,
  Gift,
} from "lucide-react";

import weddingImg from "@/assets/service-wedding.jpg";
import funeralImg from "@/assets/hero-funeral.jpg";
import namingImg from "@/assets/hero-naming.jpg";
import anniversaryImg from "@/assets/service-anniversary.jpg";
import graduationImg from "@/assets/hero-graduation.jpg";
import corporateImg from "@/assets/hero-corporate.jpg";

const services = [
  {
    icon: Heart,
    title: "Wedding Invitations",
    description: "Beautiful digital invitations for your traditional, white wedding, or both.",
    features: ["Dual ceremony support", "Love story timeline", "RSVP with meal preferences", "Wedding party introductions", "Gift registry integration"],
    slug: "wedding",
    image: weddingImg,
    stats: { created: "500+", satisfaction: "98%", label: "Weddings Created" },
  },
  {
    icon: Users,
    title: "Funeral Programs",
    description: "Dignified memorial pages that honor your loved ones with respect.",
    features: ["Tribute wall", "Donation links", "Program timeline", "Photo memories", "Memorial page forever"],
    slug: "funeral",
    image: funeralImg,
    stats: { created: "200+", satisfaction: "100%", label: "Families Served" },
  },
  {
    icon: Baby,
    title: "Naming Ceremonies",
    description: "Celebrate the arrival of new life with joyful digital invitations.",
    features: ["Baby introduction", "Name meaning display", "Godparents section", "Photo gallery", "Gift suggestions"],
    slug: "naming",
    image: namingImg,
    stats: { created: "300+", satisfaction: "99%", label: "Babies Welcomed" },
  },
  {
    icon: Cake,
    title: "Anniversary & Vow Renewal",
    description: "Mark your milestones with elegant digital celebrations.",
    features: ["Journey timeline", "Photo memories", "Love quotes", "Guest messaging", "Celebration countdown"],
    slug: "anniversary",
    image: anniversaryImg,
    stats: { created: "150+", satisfaction: "97%", label: "Milestones Celebrated" },
  },
  {
    icon: GraduationCap,
    title: "Graduation Celebrations",
    description: "Share your academic achievements with family and friends.",
    features: ["Achievement showcase", "Ceremony details", "Party information", "Photo gallery", "Thank you messages"],
    slug: "graduation",
    image: graduationImg,
    stats: { created: "400+", satisfaction: "99%", label: "Graduates Honored" },
  },
  {
    icon: Building,
    title: "Church & Corporate Events",
    description: "Professional digital invitations for church programs, conferences, and corporate events.",
    features: ["Event schedule", "Speaker profiles", "Registration forms", "Venue information", "Program agenda"],
    slug: "corporate",
    image: corporateImg,
    stats: { created: "250+", satisfaction: "98%", label: "Events Hosted" },
  },
];

const featureCategories = [
  {
    icon: Calendar,
    title: "Event Details & Timeline",
    color: "bg-blue-100 text-blue-600",
    features: [
      { name: "Date, Time & Venue", description: "Display all essential event information beautifully" },
      { name: "Dress Code Display", description: "Let guests know the appropriate attire" },
      { name: "Event Timeline", description: "Show the program schedule so guests know what happens when" },
      { name: "Live Countdown", description: "Build excitement with a countdown to your ceremony day" },
    ]
  },
  {
    icon: MapPin,
    title: "Directions & Access",
    color: "bg-green-100 text-green-600",
    features: [
      { name: "Google Maps Integration", description: "One-tap navigation to your venue" },
      { name: "Multiple Venue Support", description: "Separate directions for ceremony and reception" },
      { name: "Parking Information", description: "Help guests find parking easily" },
    ]
  },
  {
    icon: Users,
    title: "RSVP & Guest Management",
    color: "bg-purple-100 text-purple-600",
    features: [
      { name: "RSVP Tracking", description: "Know exactly who is attending your event" },
      { name: "Meal Preferences", description: "Collect dietary requirements and food choices" },
      { name: "Guest Analytics", description: "See views, RSVPs, and engagement in real-time" },
      { name: "Better Planning", description: "Helps families, churches, and planners prepare accurately" },
    ]
  },
  {
    icon: Camera,
    title: "Media & Experience",
    color: "bg-pink-100 text-pink-600",
    features: [
      { name: "Photo Gallery", description: "Showcase beautiful images before and after your event" },
      { name: "Background Music", description: "Set the mood with ambient music that plays automatically" },
      { name: "Video Background", description: "Premium cinematic feel with video headers" },
      { name: "Photo Booth Frame", description: "Custom frames for event photos guests can share" },
    ]
  },
  {
    icon: MessageSquare,
    title: "Guest Interaction",
    color: "bg-orange-100 text-orange-600",
    features: [
      { name: "Guest Messaging Wall", description: "Collect wishes, prayers, and heartfelt messages" },
      { name: "Perfect for Celebrations", description: "Ideal for weddings, anniversaries, and church events" },
      { name: "Contact Cards", description: "Let guests save your details directly to their phones" },
      { name: "WhatsApp Sharing", description: "Easy one-click sharing to family and friends" },
    ]
  },
  {
    icon: Video,
    title: "Live & Hybrid Events",
    color: "bg-red-100 text-red-600",
    features: [
      { name: "Live Stream Embed", description: "Let guests who cannot attend watch in real-time" },
      { name: "Diaspora Friendly", description: "Perfect for family members abroad" },
      { name: "International Reach", description: "Connect with guests anywhere in the world" },
    ]
  },
  {
    icon: Heart,
    title: "Funeral & Memorial",
    color: "bg-slate-100 text-slate-600",
    features: [
      { name: "Memory Tribute Wall", description: "Collect condolences and remembrance messages" },
      { name: "Respectful Design", description: "Dignified layouts specifically for memorial services" },
      { name: "Donation Links", description: "Allow guests to contribute to family or charity" },
      { name: "Memorial Page Renewal", description: "Keep memories alive with annual renewals" },
    ]
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    color: "bg-teal-100 text-teal-600",
    features: [
      { name: "English + Twi", description: "Reach your local Ghanaian audience" },
      { name: "English + French", description: "Perfect for Francophone guests" },
      { name: "Additional Languages", description: "Custom translations available on request" },
      { name: "International Families", description: "Great for mixed-culture celebrations" },
    ]
  },
  {
    icon: Gift,
    title: "Post-Event & Extras",
    color: "bg-amber-100 text-amber-600",
    features: [
      { name: "Thank You Page", description: "Express gratitude after your event beautifully" },
      { name: "MoMo Collection", description: "Receive contributions directly via Mobile Money" },
      { name: "Calendar Integration", description: "Guests can add your event to their calendar" },
      { name: "Custom Domain", description: "Get a personalized URL like yournames.vibelinkgh.com" },
    ]
  },
];

const quickFeatures = [
  { icon: "clock", label: "Countdown Timer" },
  { icon: "camera", label: "Photo Gallery" },
  { icon: "music", label: "Background Music" },
  { icon: "clipboard", label: "RSVP Tracking" },
  { icon: "map-pin", label: "Google Maps" },
  { icon: "calendar", label: "Calendar Sync" },
  { icon: "message", label: "Guest Messages" },
  { icon: "wallet", label: "MoMo Collection" },
  { icon: "chart", label: "Analytics" },
  { icon: "globe", label: "Custom Domain" },
  { icon: "smartphone", label: "Mobile Ready" },
  { icon: "share", label: "WhatsApp Share" },
];

const servicesSchema = createServiceSchema(
  services.map((s) => ({ name: s.title, description: s.description }))
);

const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
]);

const Services = () => {
  return (
    <Layout>
      <SEO
        title="Our Services"
        description="Digital invitations for weddings, funerals, naming ceremonies, anniversaries, graduations and corporate events in Ghana. Beautiful designs, easy sharing via WhatsApp."
        keywords="wedding invitations Ghana, funeral programs Accra, naming ceremony invitations, digital event invitations"
        canonical="/services"
        jsonLd={[servicesSchema, breadcrumbSchema]}
      />

      {/* Hero */}
      <section className="pt-24 lg:pt-32 pb-16 bg-gradient-to-b from-[#6B46C1] via-[#553C9A] to-[#44337A]">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
              Event Types We Serve
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Digital Invitations for Every Occasion
            </h1>
            <p className="text-primary-foreground/80 text-lg lg:text-xl">
              From joyful celebrations to dignified memorials
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services - Alternating Layout */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-16 lg:space-y-24">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              const IconComponent = service.icon;

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center`}
                >
                  <div className={`space-y-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                      {service.title}
                    </h2>

                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-accent flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button asChild variant="default" size="default">
                        <Link to={`/portfolio?type=${service.slug}`}>See Examples</Link>
                      </Button>
                      <Button asChild variant="ghost" size="default">
                        <Link to="/get-started">Get Quote</Link>
                      </Button>
                    </div>
                  </div>

                  <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="group relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] cursor-pointer"
                    >
                      <img
                        src={service.image}
                        alt={`${service.title} - Ghana`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-0" />

                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/70 to-primary/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6">
                        <div className="text-center text-primary-foreground">
                          <div className="text-5xl md:text-6xl font-bold mb-2">{service.stats.created}</div>
                          <div className="text-lg font-medium mb-4 opacity-90">{service.stats.label}</div>
                          <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm">Client Satisfaction:</span>
                            <span className="text-lg font-bold">{service.stats.satisfaction}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comprehensive Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything Your Invitation Needs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features packed into every VibeLink digital invitation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCategories.map((category, catIndex) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{category.title}</h3>
                  </div>

                  <ul className="space-y-4">
                    {category.features.map((feature) => (
                      <li key={feature.name} className="group">
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-foreground block">{feature.name}</span>
                            <span className="text-sm text-muted-foreground">{feature.description}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-6">
              Features availability varies by package.
              <Link to="/pricing" className="text-primary font-medium ml-1">View our pricing</Link> to see what is included in each tier.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="default" size="lg">
                <Link to="/pricing">View Pricing</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/get-started">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">At a Glance</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quick overview of what makes VibeLink special
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { emoji: "timer", label: "Countdown Timer" },
              { emoji: "camera", label: "Photo Gallery" },
              { emoji: "music", label: "Background Music" },
              { emoji: "clipboard", label: "RSVP Tracking" },
              { emoji: "map-pin", label: "Google Maps" },
              { emoji: "calendar", label: "Calendar Sync" },
              { emoji: "message", label: "Guest Messages" },
              { emoji: "wallet", label: "MoMo Collection" },
              { emoji: "chart", label: "Analytics" },
              { emoji: "globe", label: "Custom Domain" },
              { emoji: "smartphone", label: "Mobile Ready" },
              { emoji: "share", label: "WhatsApp Share" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <Check className="h-6 w-6 text-accent" />
                <span className="text-sm font-medium text-foreground text-center">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Services;

