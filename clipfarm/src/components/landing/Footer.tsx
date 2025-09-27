'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  const footerLinks = {
    resources: [
      { text: 'Getting started', href: '#' },
      { text: 'API Docs', href: '#' },
      { text: 'API Endpoints', href: '#' },
      { text: 'Health status', href: '#' },
      { text: 'Pricing', href: '#pricing' }
    ],
    company: [
      { text: 'Support channels', href: '#' },
      { text: 'Systems', href: '#' },
      { text: 'Blog', href: '#' },
      { text: 'Twitter', href: 'https://twitter.com/pauls_freeman' },
      { text: 'Github', href: 'https://github.com/PaulleDemon' }
    ],
    legal: [
      { text: 'Terms of service', href: '#' },
      { text: 'Privacy Policy', href: '#' },
      { text: 'DCMA - Content Takedown', href: '#' }
    ]
  };

  return (
    <footer className="mt-auto flex flex-col w-full gap-4 text-sm pt-[5%] pb-10 px-[10%] text-black dark:text-white max-md:flex-col">
      <div className="flex max-md:flex-col max-md:gap-6 gap-3 w-full justify-around">
        <div className="flex h-full w-[250px] flex-col items-center gap-6 max-md:w-full">
          <Link href="#" className="w-full items-center flex flex-col gap-6">
            <Image
              src="/assets/logo/image.png"
              alt="logo"
              width={120}
              height={120}
              className="max-w-[120px]"
            />
            <div className="max-w-[120px] text-center text-3xl h-fit">ClipFarm</div>
          </Link>
          
          <div className="flex gap-4 text-lg">
            <Link href="https://github.com/PaulleDemon/" aria-label="Github" className="hover:text-blue-600 transition-colors">
              <i className="bi bi-github"></i>
            </Link>
            <Link href="https://twitter.com/pauls_freeman" aria-label="Twitter" className="hover:text-blue-600 transition-colors">
              <i className="bi bi-twitter"></i>
            </Link>
            <Link href="https://www.linkedin.com/" aria-label="Linkedin" className="hover:text-blue-600 transition-colors">
              <i className="bi bi-linkedin"></i>
            </Link>
          </div>
        </div>

        <div className="flex max-md:flex-col flex-wrap gap-6 h-full w-full justify-around">
          <div className="flex h-full w-[200px] flex-col gap-4">
            <h2 className="text-xl">Resources</h2>
            <div className="flex flex-col gap-3">
              {footerLinks.resources.map((link, index) => (
                <Link key={index} href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex h-full w-[200px] flex-col gap-4">
            <h2 className="text-xl">Company</h2>
            <div className="flex flex-col gap-3">
              {footerLinks.company.map((link, index) => (
                <Link key={index} href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex h-full w-[200px] flex-col gap-4">
            <h2 className="text-xl">Legal</h2>
            <div className="flex flex-col gap-3">
              {footerLinks.legal.map((link, index) => (
                <Link key={index} href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr className="mt-8" />
      <div className="mt-2 flex gap-2 flex-col text-gray-700 dark:text-gray-300 items-center text-[12px] w-full text-center justify-around">
        <span>Copyright © 2023-2025</span>
        <span>All trademarks and copyrights belong to their respective owners.</span>
      </div>
    </footer>
  );
};
