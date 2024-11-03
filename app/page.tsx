"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Youtube, Sparkles, Shield, Zap, ArrowRight, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { PricingSection } from "@/components/pricing/pricing-section";
import { FAQSection } from "@/components/faq/faq-section";
import { Footer } from "@/components/layout/footer";
import { useState, useRef } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (!ref.current) return;
    setIsOpen(false);

    const targetPosition = ref.current.offsetTop - 64;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start: number | null = null;

    function animation(currentTime: number) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease = (t: number) => {
        return t < 0.5
          ? 4 * t * t * t
          : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      window.scrollTo(0, startPosition + distance * ease(progress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  };

  const NavLinks = ({ className = "", onClick = () => {} }) => (
    <>
      <Button 
        variant="ghost" 
        onClick={() => {
          scrollToSection(featuresRef);
          onClick();
        }}
        className={className}
      >
        Features
      </Button>
      <Button 
        variant="ghost" 
        onClick={() => {
          scrollToSection(pricingRef);
          onClick();
        }}
        className={className}
      >
        Pricing
      </Button>
      <Button 
        variant="ghost" 
        onClick={() => {
          scrollToSection(faqRef);
          onClick();
        }}
        className={className}
      >
        FAQ
      </Button>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b fixed top-0 w-full bg-background z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Youtube className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">TubeBot</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetTitle>Navigation Menu</SheetTitle>
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks className="w-full justify-start" onClick={() => setIsOpen(false)} />
                  <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Manage Youtube Comments
              <span className="text-gradient"> with AI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Automatically moderate, respond, and engage with your YouTube audience using
              advanced AI. Save time while building a stronger community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="container mx-auto px-4 py-12 md:py-20 scroll-mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Powerful Features for Content Creators
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6 text-primary" />}
              title="Smart Responses"
              description="AI-powered responses that sound natural and engage your audience effectively"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-primary" />}
              title="Spam Protection"
              description="Automatically detect and remove spam comments to keep your community clean"
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6 text-primary" />}
              title="Sentiment Analysis"
              description="Understand viewer sentiment and track community engagement trends"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-primary" />}
              title="Quick Actions"
              description="Batch moderate comments and take actions with just one click"
            />
          </div>
        </section>

        {/* Social Proof */}
        <section className="bg-muted py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Trusted by Content Creators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center opacity-75">
              <div>
                <span className="text-2xl font-bold block">1M+</span>
                <span className="text-lg">Comments Managed</span>
              </div>
              <div>
                <span className="text-2xl font-bold block">50K+</span>
                <span className="text-lg">Creators</span>
              </div>
              <div>
                <span className="text-2xl font-bold block">99%</span>
                <span className="text-lg">Satisfaction</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="scroll-mt-16">
          <PricingSection />
        </section>

        {/* FAQ Section */}
        <section ref={faqRef} className="scroll-mt-16">
          <FAQSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}