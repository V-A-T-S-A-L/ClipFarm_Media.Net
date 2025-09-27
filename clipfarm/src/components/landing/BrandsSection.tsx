'use client';

import React from 'react';
import Image from 'next/image';

export const BrandsSection: React.FC = () => {
  const brands = [
    { name: 'Instagram', logo: '/assets/images/brand-logos/instagram.svg' },
    { name: 'TikTok', logo: '/assets/images/brand-logos/tiktok.svg' },
    { name: 'YouTube', logo: '/assets/images/brand-logos/youtube.svg' },
    { name: 'Facebook', logo: '/assets/images/brand-logos/facebook.svg' },
    { name: 'Reddit', logo: '/assets/images/brand-logos/reddit.svg' },
  ];

  return (
    <section className=" relative flex w-full max-w-[100vw] flex-col justify-center items-center overflow-hidden p-8">
      <h2 className="text-3xl max-md:text-xl">
        For the Platforms{" "}
        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          You Love {":)"}
        </span>
      </h2>


      <div className="mt-25 flex w-full gap-5 max-md:gap-2 justify-center flex-wrap">
        {brands.map((brand, index) => (
          <div key={index} className="h-[30px] w-[150px]">
            <Image
              src={brand.logo}
              alt={brand.name}
              width={150}
              height={30}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
};