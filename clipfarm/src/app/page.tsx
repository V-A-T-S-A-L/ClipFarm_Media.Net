// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import { BrandsSection } from '@/components/landing/BrandsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { Footer } from '@/components/landing/Footer';
import { AdditionalFeaturesSection, APISection, BenefitsSection, BlogSection, CTASection, NewsletterSection, PrebuiltToolsSection, SubscriptionSection, TestimonialsSection } from '@/components/landing/Sections';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc] text-black dark:bg-black dark:text-white">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <HeroSection />
        <BrandsSection />
        <APISection />
        <BenefitsSection />
        <PrebuiltToolsSection />
        <TestimonialsSection />
        <PricingSection />
        <BlogSection />
        <FAQSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}