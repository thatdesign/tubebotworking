"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does TubeBot's AI moderation work?",
    answer: "TubeBot uses advanced natural language processing to understand comment context and sentiment. It automatically identifies spam, inappropriate content, and potential engagement opportunities, allowing you to focus on creating content while maintaining a healthy community."
  },
  {
    question: "Can I customize AI response templates?",
    answer: "Yes! Professional and Enterprise plans allow you to create and customize AI response templates that match your tone and style. You can set specific responses for different types of comments and train the AI to better understand your preferences."
  },
  {
    question: "Is there a limit to the number of YouTube channels I can manage?",
    answer: "The Starter plan supports one YouTube channel, Professional supports up to 3 channels, and Enterprise offers unlimited channel management. Each channel's comments count towards your monthly comment quota."
  },
  {
    question: "How accurate is the spam detection?",
    answer: "Our spam detection system has a 99.9% accuracy rate. It uses a combination of AI and community-driven patterns to identify spam, self-promotion, and harmful content. You can also customize the sensitivity levels to match your moderation preferences."
  },
  {
    question: "Can I export analytics and reports?",
    answer: "Yes, all plans include basic analytics. Professional and Enterprise plans offer advanced analytics with exportable reports in various formats (CSV, PDF, API access) and custom dashboard creation capabilities."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes! We offer a 14-day free trial of our Professional plan, allowing you to experience all our premium features. No credit card required to start your trial."
  }
];

export function FAQSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about TubeBot and how it can help you manage your YouTube community.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}