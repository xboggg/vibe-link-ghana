import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/sections/CTASection";
import { Heart, Globe, Sparkles, Shield, Users, Clock, Star, MapPin, Instagram, Facebook, Twitter, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/vibelink_ghana" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/VibeLink Ghana" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/VibeLink_GH" },
  { name: "TikTok", icon: TikTokIcon, href: "https://tiktok.com/@vibelink.ghana" },
];

const values = [
  {
    icon: Heart,
    title: "Dignity",
    description: "Every ceremony deserves respect. We treat each project with the care it deserves.",
  },
  {
    icon: Globe,
    title: "Culture",
    description: "We celebrate Ghanaian traditions and honor the unique aspects of every celebration.",
  },
  {
    icon: Sparkles,
    title: "Simplicity",
    description: "One link does everything. We believe beautiful design should be effortless to share.",
  },
  {
    icon: Shield,
    title: "Trust",
    description: "Transparent pricing, reliable service. We deliver what we promise, every time.",
  },
];

const stats = [
  { icon: Users, value: "100+", label: "Events Created" },
  { icon: Heart, value: "500+", label: "Happy Guests" },
  { icon: Clock, value: "< 2hr", label: "Response Time" },
  { icon: Star, value: "4.9★", label: "Client Rating" },
];

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventType: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Please enter your name (at least 2 characters)";
    }
    if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Please enter a message (at least 10 characters)";
    }
    if (formData.message.length > 1000) {
      newErrors.message = "Message must be less than 1000 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form fields and try again.",
        variant: "destructive",
      });
      return;
    }

    // Build WhatsApp message
    const message = `Hi VibeLink! 👋

*Name:* ${formData.name.trim()}
${formData.email ? `*Email:* ${formData.email.trim()}` : ""}
${formData.eventType ? `*Event Type:* ${formData.eventType.trim()}` : ""}

*Message:*
${formData.message.trim()}`;

    const whatsappUrl = `https://wa.me/233245817973?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "Opening WhatsApp",
      description: "Complete your message in WhatsApp to reach us!",
    });

    // Reset form
    setFormData({ name: "", email: "", eventType: "", message: "" });
    setErrors({});
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 lg:pt-32 pb-16 bg-gradient-to-b from-navy to-navy-light">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              About VibeLink Ghana
            </h1>
            <p className="text-primary-foreground/80 text-lg lg:text-xl mb-8">
              Transforming Ghanaian ceremonies, one link at a time. We're on a
              mission to make event invitations beautiful, shareable, and
              unforgettable.
            </p>
            {/* Social Links */}
            <div className="flex items-center justify-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-3 rounded-full bg-primary-foreground/10 text-primary-foreground/70 hover:bg-secondary hover:text-navy transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              
              <div className="prose prose-lg text-muted-foreground space-y-4">
                <p>
                  VibeLink Ghana was born from a simple observation: Ghanaian
                  families were struggling with the chaos of event coordination.
                  Paper invitations got lost, WhatsApp messages were confusing,
                  and diaspora family members often missed important details.
                </p>
                
                <p>
                  We saw families printing hundreds of invitation cards, only to
                  make last-minute changes that couldn't be communicated. We saw
                  funeral committees overwhelmed with coordinating contributions.
                  We saw beautiful ceremonies that deserved better digital
                  representation.
                </p>
                
                <p>
                  So we created VibeLink – a platform that transforms traditional
                  event invitations into beautiful, interactive digital
                  experiences. One link that does everything: shares details,
                  collects RSVPs, accepts MoMo contributions, and looks stunning
                  on any phone.
                </p>
                
                <p>
                  Today, we're proud to serve Ghanaian families across the world,
                  helping them celebrate weddings, honor loved ones at funerals,
                  welcome new babies, and mark every milestone with the dignity
                  and beauty they deserve.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Our Mission
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We transform traditional event invitations into beautiful,
                interactive digital experiences that honor Ghanaian culture and
                connect families across the world.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-secondary" />
                Our Vision
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To be Ghana's #1 digital front door to all ceremonies – the
                first choice for every family celebrating life's important
                moments.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-navy">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/70 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Based in Accra, Ghana
            </h2>
            <p className="text-muted-foreground text-lg">
              Proudly Ghanaian, serving families worldwide. Whether you're in
              Kumasi, London, or New York – we're here to make your celebration
              unforgettable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                <MessageCircle className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get In Touch
              </h2>
              <p className="text-muted-foreground text-lg">
                Have a question or want to discuss your event? Send us a message
                and we'll get back to you on WhatsApp.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl bg-card border border-border space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Your Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Kwame Asante"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={errors.name ? "border-destructive" : ""}
                    maxLength={100}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email (optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="kwame@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={errors.email ? "border-destructive" : ""}
                    maxLength={255}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-foreground">
                  Event Type (optional)
                </Label>
                <Input
                  id="eventType"
                  placeholder="e.g. Wedding, Funeral, Birthday"
                  value={formData.eventType}
                  onChange={(e) =>
                    setFormData({ ...formData, eventType: e.target.value })
                  }
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">
                  Your Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your event or ask any questions..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={`min-h-[120px] ${errors.message ? "border-destructive" : ""}`}
                  maxLength={1000}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message}</p>
                )}
                <p className="text-xs text-muted-foreground text-right">
                  {formData.message.length}/1000
                </p>
              </div>

              <Button type="submit" variant="gold" size="lg" className="w-full">
                <Send className="h-5 w-5 mr-2" />
                Send via WhatsApp
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default About;
