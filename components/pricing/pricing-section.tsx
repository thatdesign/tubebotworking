"use client";

import { PriceCard } from "./price-card";

export function PricingSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your channel. All plans include our core features with different quota limits.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <PriceCard
          name="Starter"
          price="$29"
          description="Perfect for growing channels"
          features={[
            "Up to 1,000 comments/month",
            "AI-powered responses",
            "Basic spam protection",
            "24/7 moderation",
            "Email support"
          ]}
        />
        
        <PriceCard
          name="Professional"
          price="$79"
          description="For established content creators"
          popular={true}
          features={[
            "Up to 10,000 comments/month",
            "Advanced AI responses",
            "Premium spam protection",
            "Custom response templates",
            "Priority support",
            "Analytics dashboard",
            "Team collaboration"
          ]}
        />
        
        <PriceCard
          name="Enterprise"
          price="Custom"
          description="For large channels & teams"
          ctaText="Contact Sales"
          features={[
            "Unlimited comments",
            "Custom AI training",
            "Advanced analytics",
            "Dedicated account manager",
            "Custom integration",
            "SLA guarantee",
            "API access"
          ]}
        />
      </div>
    </section>
  );
}