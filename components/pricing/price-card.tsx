"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PriceCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText?: string;
}

export function PriceCard({
  name,
  price,
  description,
  features,
  popular = false,
  ctaText = "Get Started"
}: PriceCardProps) {
  return (
    <Card className={`relative flex flex-col p-6 ${
      popular ? 'border-primary shadow-lg md:scale-105' : ''
    }`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-bold">{name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Custom" && <span className="text-muted-foreground">/month</span>}
        </div>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      
      <ul className="space-y-3 mb-6 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-1 shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className="w-full" 
        variant={popular ? "default" : "outline"}
      >
        {ctaText}
      </Button>
    </Card>
  );
}