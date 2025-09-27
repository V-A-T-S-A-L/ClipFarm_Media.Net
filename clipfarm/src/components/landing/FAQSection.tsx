'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What's ClipFarm?",
      answer:
        "ClipFarm is a Gen-Z-focused AI tool that instantly turns ideas, images, or video snippets into short-form social media videos for Instagram Reels, TikTok, and Pinterest."
    },
    {
      question: "How does ClipFarm work?",
      answer:
        "Simply provide a text prompt or media snippet, and ClipFarm generates scripts, storyboards, AI voiceovers, captions, and scene visuals—all optimized for vertical social videos."
    },
    {
      question: "Can I customize the style?",
      answer:
        "Yes! You can choose different aesthetics like chaotic brainrot, aesthetic core, or anime to match the vibe you want for your video."
    },
    {
      question: "Is ClipFarm free?",
      answer:
        "You can start creating videos for free, with optional upgrades to unlock advanced features and customizations."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative flex w-full flex-col justify-center items-center gap-[10%] p-[5%] px-[10%]">
      <h3 className="text-4xl font-medium max-md:text-2xl">FAQ</h3>

      <div className="mt-5 flex min-h-[300px] w-full max-w-[850px] flex-col gap-4">
        {faqs.map((faq, index) => (
          <div key={index} className="w-full">
            <h4
              className="flex w-full select-none text-xl max-md:text-lg cursor-pointer p-4 rounded-lg transition-colors items-center"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span className="ml-auto">
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-black dark:text-white transition-transform duration-300" />
                ) : (
                  <Plus className="w-5 h-5 text-black dark:text-white transition-transform duration-300" />
                )}
              </span>
            </h4>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4 pt-0 max-lg:text-sm text-gray-700 dark:text-gray-300">
                {faq.answer}
              </div>
            </div>
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
          </div>
        ))}
      </div>
    </section>
  );
};
