'use client';

import React from 'react';
import Link from 'next/link';

interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: { text: string; included: boolean }[];
  popular?: boolean;
}

export const PricingSection: React.FC = () => {
  const plans: PricingPlan[] = [
    {
      name: "Starter",
      price: 5,
      description: "Perfect to get started creating viral short-form videos",
      features: [
        { text: "1,000 AI-generated video scripts & storyboards", included: true },
        { text: "30 AI-generated scene images", included: true },
        { text: "10 AI-generated music tracks or sound effects", included: true },
        { text: "Access to all premium AI aesthetics & styles", included: false },
        { text: "Early access to new ClipFarm features", included: false }
      ]
    },
    {
      name: "Pro",
      price: 15,
      description: "For creators who want to level up their social media content",
      features: [
        { text: "5,000 AI-generated video scripts & storyboards", included: true },
        { text: "100 AI-generated scene images", included: true },
        { text: "40 AI-generated music tracks or sound effects", included: true },
        { text: "Access to all premium AI aesthetics & styles", included: true },
        { text: "Early access to new ClipFarm features", included: false }
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: 25,
      description: "Unlimited creativity for professional content creators",
      features: [
        { text: "10,000 AI-generated video scripts & storyboards", included: true },
        { text: "300 AI-generated scene images", included: true },
        { text: "100 AI-generated music tracks or sound effects", included: true },
        { text: "Access to all premium AI aesthetics & styles", included: true },
        { text: "Early access to new ClipFarm features", included: true }
      ]
    }
  ];


  return (
    <section id="pricing" className="mt-5 flex w-full flex-col gap-6 items-center p-[2%]">
      <h3 className="text-5xl font-medium max-md:text-2xl">
        Choose the right plan for you
      </h3>

      <div className="mt-10 flex flex-wrap justify-center gap-8 max-lg:flex-col">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`flex w-[350px] flex-col items-center gap-2 rounded-lg border-[1px] bg-white dark:bg-[#080808] p-8 shadow-xl max-lg:w-[320px] ${plan.popular ? 'border-2 border-gray-500 dark:border-[#595858]' : 'border-gray-200 dark:border-[#1f2123]'
              }`}
          >
            <h3>
              <span className="text-5xl max-md:text-3xl font-semibold">${plan.price}</span>
              <span className="text-2xl text-gray-600 dark:text-gray-300">/mo</span>
            </h3>
            <p className="mt-3 text-center text-gray-800 dark:text-gray-100">
              {plan.description}
            </p>
            <hr className="w-full my-4" />
            <ul className="mt-4 flex flex-col gap-4 text-base text-gray-800 dark:text-gray-200">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex gap-2">
                  <i className={`bi bi-check-circle-fill ${feature.included ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}></i>
                  <span className={!feature.included ? 'text-gray-400 dark:text-gray-500' : ''}>{feature.text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="#"
              className={`mt-auto w-full text-center px-4 py-2 rounded-lg transition-transform duration-300 hover:scale-x-[1.02] ${plan.popular
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-transparent text-black border border-black dark:border-white dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                }`}
            >
              Choose plan
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};