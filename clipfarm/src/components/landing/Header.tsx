'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// 1. Import Lucide React icons
import {
    Menu,
    ChevronDown,
    ArrowRight,
    Sun,
    Moon,
    Grid,
    Globe,
    Image as ImageIcon, // Renamed to avoid conflict with Next/Image
    Calendar,
    Languages,
    ListChecks // Closest match for bi-list-columns-reverse (Prompt library)
} from 'lucide-react';

// 2. Map the old icon keys to Lucide Components
// This is done to keep the structure of the featureList clean and component-driven.
const iconMap = {
    "bi-list-columns-reverse": ListChecks,
    "bi-grid-1x2-fill": Grid,
    "bi-globe": Globe,
    "bi-image-fill": ImageIcon,
    "bi-calendar-range": Calendar,
    "bi-translate": Languages
};

// Define the shape of the props for type safety
interface HeaderProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const featuresList = [
    {
        iconKey: "bi-list-columns-reverse",
        title: "Prompt library",
        description: "Comes packed with pre-made prompt templates"
    },
    {
        iconKey: "bi-grid-1x2-fill",
        title: "Unified Interface",
        description: "Test multiple AI models in one interface"
    },
    {
        iconKey: "bi-globe",
        title: "Realtime web search",
        description: "Search the internet in realtime"
    },
    {
        iconKey: "bi-image-fill",
        title: "Image generation",
        description: "Generate images from prompts"
    },
    {
        iconKey: "bi-calendar-range",
        title: "History",
        description: "Continue from where you left off"
    },
    {
        iconKey: "bi-translate",
        title: "Multilingual",
        description: "Converse in multiple languages"
    }
];

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
        if (!isMenuOpen) setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    return (
        <header
            className={`
                lg:px-4 max-w-[100vw] max-w-lg:mr-auto max-lg:top-0 fixed top-4 lg:left-1/2 lg:-translate-x-1/2 z-20 flex h-[60px] w-full 
                text-gray-700 bg-white dark:text-gray-200 dark:bg-[#17181b] px-[3%] rounded-md lg:max-w-5xl border-b-1 dark:border-white border-black
                lg:justify-around lg:!backdrop-blur-lg lg:opacity-[0.99]
            `}
        >
            <Link className="flex p-[4px] gap-2 items-center" href="#" onClick={() => {
                setIsMenuOpen(false);
                setIsDropdownOpen(false);
            }}>
                <div className="h-[30px] max-w-[100px]">
                    <Image
                        src="/assets/logo/image.png"
                        alt="ClipFarm logo"
                        width={100}
                        height={30}
                        className="object-contain h-full w-full"
                        priority
                    />
                </div>
                <span className="uppercase text-base font-medium">ClipFarm</span>
            </Link>

            <div
                className={`collapsible-header animated-collapse max-lg:shadow-md 
                    ${isMenuOpen ? 'max-lg:scale-100 max-lg:opacity-100' : 'max-lg:scale-0 max-lg:opacity-0'}
                    transition-transform duration-300 ease-in-out lg:flex
                `}
                id="collapsed-header-items"
            >
                <nav
                    className="relative flex h-full max-lg:h-max w-max gap-10 text-base max-lg:mt-[30px] max-lg:flex-col 
                        max-lg:gap-5 lg:mx-auto items-center"
                >
                    <Link className="header-links" href="#"> API </Link>
                    <Link className="header-links" href="#"> Blog </Link>
                    <Link className="header-links" href="#"> Solutions </Link>

                    <div className="relative flex flex-col items-center">
                        <button
                            id="nav-dropdown-toggle-0"
                            className="max-lg:max-w-fit flex header-links gap-1 items-center"
                            onClick={toggleDropdown}
                        >
                            <span> Features </span>
                            {/* 3. Replace i tag with Lucide component */}
                            <ChevronDown size={14} className="text-sm" /> 
                        </button>

                        {/* Dropdown Menu */}
                        <nav
                            className={`absolute lg:fixed flex 
                                ${isDropdownOpen
                                    ? 'scale-100 opacity-100 max-lg:top-[105%] z-50'
                                    : 'scale-0 opacity-0 max-lg:h-0 max-lg:w-0 pointer-events-none'} 
                                lg:top-[80px] lg:left-1/2 lg:-translate-x-1/2 w-[90%] rounded-lg 
                                lg:h-[450px] overflow-hidden
                                bg-white dark:bg-[#17181B] duration-300 
                                transition-all shadow-lg p-4
                            `}
                        >
                            <div className="grid max-xl:flex max-xl:flex-col justify-around grid-cols-2 w-full">
                                {featuresList.map((feature, index) => {
                                    // 4. Dynamically render the Lucide icon based on the iconKey
                                    const IconComponent = iconMap[feature.iconKey as keyof typeof iconMap];

                                    return (
                                        <Link
                                            key={index}
                                            className="header-links flex text-left gap-4 !p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                                            href="#"
                                        >
                                            <div className="font-semibold text-3xl">
                                                {IconComponent && <IconComponent size={32} />} {/* Render icon with size */}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="text-lg text-black dark:text-white font-medium">{feature.title}</div>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>

                    <Link className="header-links" href="#pricing"> Pricing </Link>

                </nav>

                <div
                    className="lg:mx-4 flex items-center gap-[20px] text-base max-md:w-full 
                                max-md:flex-col max-md:justify-center"
                >
                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        className="header-links text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                        title="toggle-theme"
                        id="theme-toggle"
                    >
                        {/* 5. Replace theme toggle icon with Lucide components */}
                        {darkMode ? <Moon size={24} /> : <Sun size={24} />}
                    </button>
                    <Link
                        href="/create"
                        aria-label="Try Pixa Playground"
                        className="bg-white text-black border-1 border-black px-4 py-2 rounded-lg flex gap-3 transition-all duration-300 hover:translate-x-2"
                    >
                        <span>Try playground</span>
                        {/* 6. Replace arrow icon */}
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>

            <button
                className="absolute right-3 top-3 z-50 text-3xl text-gray-500 lg:hidden"
                onClick={toggleMenu}
                aria-label="menu"
                id="collapse-btn"
            >
                {/* 7. Replace menu icon */}
                <Menu size={32} />
            </button>
        </header>
    );
};

export default Header;