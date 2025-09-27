// Simplified placeholder components for missing sections
// components/APISection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Iridescence from '../Iridescence';
import { ArrowUpRight, Film, Image, Mic } from 'lucide-react';

const APISection: React.FC = () => (
    <section className="relative flex w-full mt-20 max-lg:min-h-[80vh] flex-col justify-center items-center overflow-hidden text-black">
        <div className="absolute inset-0 z-0">
            <Iridescence
                color={[0.5, 0.6, 0.8]}
                mouseReact={false}
                amplitude={0.1}
                speed={0.5}
            />
        </div>

        <div className="w-full justify-center items-center flex flex-col max-w-[900px] gap-4 p-4 z-10">
            <h2 className="text-6xl max-lg:text-4xl text-center leading-normal uppercase">
                <span className="font-semibold">Make your own Content</span>
                <br />
                <span className="font-serif">on ClipFarm</span>
            </h2>
            <p className="mt-8 max-w-[650px] text-black text-center max-md:text-sm">
                ClipFarm harnesses powerful AI models to help creators effortlessly turn ideas into content. From instant story generation and snappy scripts to AI voiceovers and captions, it makes producing short-form, social-ready videos fast, fun, and totally hassle-free.            </p>
            <div className="flex mt-8">
                <Link href="#" className="text-black shadow-md hover:shadow-xl shadow-gray-800 transition-all duration-300 border border-black p-3 px-4 rounded-md">
                    Check ClipFarm
                </Link>
            </div>
        </div>
    </section>
);

const BenefitsSection: React.FC = () => (
    <section className="relative flex max-w-[100vw] flex-col justify-center items-center overflow-hidden">
        <div className="mt-8 flex flex-col w-full h-full items-center gap-5">
            <div className="mt-5 flex flex-col gap-3 text-center">
                <h2 className="text-6xl font-medium max-md:text-3xl p-2">
                    Experience all the benefits of AI
                </h2>
            </div>
            <div className="mt-6 flex flex-col max-w-[1150px] max-lg:max-w-full h-full p-4 max-lg:justify-center gap-8">
                <div className="max-xl:flex max-xl:flex-col items-center grid grid-cols-3 gap-8 justify-center">
                    {[
                        {
                            title: "One-Stop Creator Hub",
                            description: "Upload an idea or snippet and get a full AI-generated short-form video in one seamless platform.",
                            image: "/assets/images/home/article1.png"
                        },
                        {
                            title: "AI-Powered Generation",
                            description: "From scripts to voiceovers, captions, and trending edits, ClipFarm’s AI brings your stories to life instantly.",
                            image: "/assets/images/home/article2.jpg"
                        },
                        {
                            title: "Social-Ready Tools",
                            description: "Pre-built reels, scene generation, and motion edits make creating IG Reels, TikToks, and Pinterest videos effortless.",
                            image: "/assets/images/home/article3.png"
                        }
                    ].map((benefit, index) => (
                        <div key={index} className="w-[350px] h-[540px] flex max-md:w-full">
                            <Link href="#" className="relative p-10 transition-all duration-300 group gap-5 flex flex-col w-full h-full bg-[#f6f7fb] dark:bg-[#171717] rounded-3xl hover:scale-[1.02]">
                                <div className="overflow-hidden w-full min-h-[200px] h-[400px] rounded-2xl">
                                    <img src={benefit.image} className='h-full w-full object-cover transition-transform duration-700 hover:scale-[1.3]' />
                                </div>
                                <h2 className="text-3xl max-md:text-2xl font-medium">{benefit.title}</h2>
                                <p className="text-base leading-normal text-gray-800 dark:text-gray-200">
                                    {benefit.description}
                                </p>
                                <div className="flex items-center gap-2 mt-auto">
                                    <span>Learn more</span>
                                    <i className="bi bi-arrow-right transform transition-transform duration-300 group-hover:translate-x-2"></i>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

// Remaining simplified components
const PrebuiltToolsSection: React.FC = () => {
    const tools = [
        {
            icon: <Film className="w-10 h-10 text-black dark:text-white" />,
            title: "AI Script & Story Generator",
            description:
                "Turn text or ideas into full short-form video scripts and storyboards, ready for social media reels.",
        },
        {
            icon: <Mic className="w-10 h-10 text-black dark:text-white" />,
            title: "Voiceover & Captions",
            description:
                "Automatically generate Gen-Z style voiceovers and captions to bring your videos to life.",
        },
        {
            icon: <Image className="w-10 h-10 text-black dark:text-white" />,
            title: "Scene & Visual Creation",
            description:
                "Generate AI-powered scene images and motion visuals to match your story aesthetic instantly.",
        },
    ];

    return (
        <section className="relative mt-10 flex min-h-screen w-full max-w-[100vw] flex-col items-center lg:p-6">
            <div className="mt-[5%] flex h-full w-full justify-center gap-2 p-4 max-lg:max-w-full max-lg:flex-col">
                {/* Left title section */}
                <div className="relative flex max-w-[30%] max-lg:max-w-full flex-col items-start gap-4 p-2 max-lg:items-center max-lg:justify-center max-lg:w-full">
                    <div className="top-40 flex flex-col lg:sticky items-center max-h-fit max-w-[850px] max-lg:max-h-fit max-lg:max-w-[320px] overflow-hidden">
                        <h2 className="text-5xl font-serif text-center font-medium max-md:text-3xl">
                            Pre-built AI Tools
                        </h2>
                        <Link
                            href="#"
                            className="mt-8 bg-transparent text-black border border-black dark:border-white dark:text-white px-4 py-2 rounded-md"
                        >
                            Start Creating
                        </Link>
                    </div>
                </div>

                {/* Tools cards */}
                <div className="flex flex-col gap-10 h-full max-w-1/2 max-lg:max-w-full px-[10%] max-lg:px-4 max-lg:gap-3 max-lg:w-full lg:top-[20%] items-center">
                    {tools.map((tool, index) => (
                        <div key={index} className="h-[240px] w-[450px] max-md:w-full">
                            <Link
                                href="#"
                                className="flex w-full h-full gap-8 rounded-xl hover:shadow-lg dark:shadow-[#171717] duration-300 transition-all p-8 group"
                            >
                                {/* Icon */}
                                <div className="text-4xl max-md:text-2xl">{tool.icon}</div>

                                {/* Title & Description */}
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-2xl max-md:text-xl">{tool.title}</h3>
                                    <p className="text-gray-800 dark:text-gray-100 max-md:text-sm">
                                        {tool.description}
                                    </p>

                                    {/* Learn more link */}
                                    <div className="mt-auto flex gap-2 underline underline-offset-4 items-center">
                                        <span>Learn more</span>
                                        <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 duration-300 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const AdditionalFeaturesSection: React.FC = () => (
    <section className="relative flex w-full flex-col justify-center items-center overflow-hidden">
        <div className="w-full max-lg:max-w-full justify-center items-center flex flex-col max-w-[80%] gap-4 p-4">
            <h3 className="text-5xl font-medium max-md:text-3xl text-center leading-normal">
                Additional Features
            </h3>
            <div className="mt-8 relative gap-10 p-4 grid items-center grid-cols-3 max-lg:flex max-lg:flex-col">
                {[
                    { title: "Prompt Library", description: "Forget about writing your own prompt, use the prompt templates and supercharge your workflow.", image: "prompts2.png" },
                    { title: "Real-time web search", description: "Our Real-time web search AI Bot provides instant, live search results directly within the AI chat playground.", image: "search.png" },
                    { title: "Image Generation", description: "Generate Image instantly from multiple models, create visuals from text descriptions or templates.", image: "image.png" }
                ].map((feature, index) => (
                    <div key={index} className="w-[350px] border h-[400px] rounded-md items-center p-4 bg-[#f2f3f4] max-md:w-[320px] dark:bg-[#141414] dark:border-[#1f2123] flex flex-col gap-3">
                        <div className="w-full h-[250px] p-4 rounded-xl overflow-hidden flex justify-center">
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">Feature Image</span>
                            </div>
                        </div>
                        <h3 className="text-2xl">{feature.title}</h3>
                        <p className="text-gray-700 dark:text-gray-300 px-4 text-center text-sm">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const SubscriptionSection: React.FC = () => (
    <section className="relative flex w-full min-h-screen max-md:min-h-[80vh] flex-col justify-center items-center overflow-hidden">
        <div className="w-full max-lg:max-w-full justify-center items-center flex flex-col max-w-[80%] gap-4 p-4">
            <h3 className="text-5xl font-medium max-md:text-3xl text-center leading-normal">
                One Subscription for it all
            </h3>
            <p className="mt-3 max-w-[600px] text-center">
                Why pay for multiple expensive subscriptions when one subscription can do it all? Access multiple AI models and save 1000's of dollar per year.
            </p>
            <div className="mt-8 relative flex max-lg:flex-col gap-5">
                <div className="flex w-full max-w-[650px] max-md:max-w-full flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white dark:bg-[#080808] dark:border-[#1f2123] p-2 shadow-xl max-lg:w-[320px]">
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Comparison Image</span>
                    </div>
                </div>
            </div>
            <Link href="#" className="group shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex gap-2 mt-10">
                <span>Start Chat</span>
                <i className="bi bi-arrow-right duration-300 group-hover:translate-x-1"></i>
            </Link>
        </div>
    </section>
);

const gradients = [
    "bg-gradient-to-tr from-pink-400 via-red-400 to-yellow-400",
    "bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500",
    "bg-gradient-to-tr from-green-400 via-lime-400 to-yellow-300",
    "bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400",
    "bg-gradient-to-tr from-teal-400 via-cyan-400 to-blue-400",
    "bg-gradient-to-tr from-orange-400 via-red-400 to-pink-400",
];

const TestimonialsSection: React.FC = () => (
    <section className="flex min-h-screen w-full flex-col justify-center items-center p-[2%]">
        <h3 className="text-4xl font-medium text-center max-md:text-2xl">
            Join the professionals using ClipFarm
        </h3>
        <div className="mt-20 gap-10 space-y-8 max-md:columns-1 lg:columns-2 xl:columns-3">
            {[
                {
                    name: "Mante",
                    company: "Glu, CTO",
                    text: "ClipFarm has completely transformed how we create content. I can turn any idea into a polished short-form video ready for TikTok, Instagram, or Pinterest in minutes."
                },
                {
                    name: "Trich B",
                    company: "AMI, CEO",
                    text: "Using ClipFarm, our team produces engaging Reels and TikToks faster than ever. The AI-generated scripts, captions, and visuals save us hours of editing."
                },
                {
                    name: "Ravi K",
                    company: "NextGen Media, Founder",
                    text: "The AI storytelling and one-click exports have revolutionized our workflow. We now produce more content with higher engagement across Instagram, TikTok, and Pinterest."
                },
                {
                    name: "Alex R",
                    company: "Vibe Media, Content Lead",
                    text: "We've scaled our social content across platforms effortlessly. ClipFarm's voiceovers, scene generation, and trending edits make every video feel unique and on-brand."
                },
                {
                    name: "John B",
                    company: "Benz, CEO",
                    text: "ClipFarm lets us experiment with different aesthetics instantly. From chaotic brainrot to anime-style visuals, creating viral-ready content has never been easier."
                },
                {
                    name: "Sophie L",
                    company: "Trendify, Social Media Manager",
                    text: "I love how ClipFarm handles the heavy lifting. Just a prompt or snippet, and it generates a full Reel with captions, effects, and audio in minutes."
                }
            ].map((testimonial, index) => (
                <div
                    key={index}
                    className="flex h-fit w-[350px] break-inside-avoid flex-col gap-4 rounded-lg border bg-[#f6f7fb] dark:bg-[#080808] dark:border-[#1f2123] p-4 max-lg:w-[320px]"
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`h-[50px] w-[50px] rounded-full ${gradients[index % gradients.length]}`}
                        ></div>
                        <div className="flex flex-col gap-1">
                            <div className="font-semibold">{testimonial.name}</div>
                            <div className="text-gray-700 dark:text-gray-300">
                                {testimonial.company}
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-800 dark:text-gray-200">{testimonial.text}</p>
                </div>
            ))}
        </div>
    </section>
);

const BlogSection: React.FC = () => {
    const articles = [
        {
            title: "Why Gen-Z stops scrolling: Hooks that actually work",
            image: "/assets/images/home/article4.jpg",
            category: "Content Strategy",
            date: "Sep 25, 2025",
        },
        {
            title: "Trending sounds & effects that boost your reach",
            image: "/assets/images/home/article5.jpg",
            category: "Creator Tools",
            date: "Sep 20, 2025",
        },
        {
            title: "The science of binge-worthy short-form storytelling",
            image: "/assets/images/home/article6.jpg",
            category: "Growth Hacks",
            date: "Sep 15, 2025",
        },
    ];

    return (
        <section className="mt-5 flex min-h-[80vh] w-full flex-col justify-center items-center p-[2%] max-lg:p-3">
            <h3 className="text-4xl font-medium max-md:text-2xl text-center">
                Learn what makes content go viral
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-[600px] text-center">
                Insights, hacks, and strategies from creators and experts on how to grab
                Gen-Z's attention and turn every clip into a scroll-stopping reel.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-10 max-lg:flex-col">
                {articles.map((article, index) => (
                    <Link
                        key={index}
                        href="#"
                        className="flex h-[500px] w-[400px] flex-col gap-2 overflow-clip rounded-lg p-4 max-lg:w-[350px]"
                    >
                        {/* Article Image */}
                        <div className="h-[350px] min-h-[350px] w-full overflow-hidden rounded-2xl">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Meta */}
                        <div className="text-gray-600 dark:text-gray-300 justify-between flex gap-2 mt-2">
                            <div className="text-gray-800 dark:text-gray-200">
                                {article.category}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                                {article.date}
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="mt-1 font-medium text-xl max-md:text-lg">
                            {article.title}
                        </h3>
                    </Link>
                ))}
            </div>
        </section>
    );
};


const CTASection: React.FC = () => (
    <section className="relative flex p-2 w-full min-h-[60vh] flex-col justify-center items-center overflow-hidden">
        <div className="w-full h-full min-h-[450px] max-lg:max-w-full rounded-md lg:py-[5%] bg-[#f6f7fb] dark:bg-[#171717] justify-center items-center flex flex-col max-w-[80%] gap-4 p-4">
            <h3 className="text-5xl font-medium max-md:text-3xl text-center leading-normal">
                Access and compare multiple AI models
            </h3>
            <div className="mt-8 relative flex max-lg:flex-col gap-5">
                <Link href="#" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 font-medium">
                    Launch Playground
                </Link>
            </div>
        </div>
    </section>
);

const NewsletterSection: React.FC = () => (
    <section className="flex w-full flex-col justify-center items-center gap-16 p-10 max-md:px-4">
        <div className="flex w-full max-w-[1000px] flex-col md:flex-row justify-between items-center gap-6 rounded-2xl bg-[#F6F7FB] dark:bg-[#171717] p-8 shadow-lg transition-all duration-300 hover:shadow-2xl max-md:w-full max-md:gap-4">

            {/* Text Section */}
            <div className="flex flex-col gap-2 md:text-left text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 max-md:text-2xl">
                    Join our Newsletter
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                    Get product insights, updates, and exclusive content straight to your inbox.
                </p>
            </div>

            {/* Input Section */}
            <div className="flex flex-col md:flex-row w-full md:w-auto h-24 md:h-[60px] items-center gap-3 p-1">
                <input
                    type="email"
                    className="flex-1 h-full px-4 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300"
                    placeholder="Enter your email"
                />
                <Link
                    href="#"
                    className="h-full px-6 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300"
                >
                    Signup
                </Link>
            </div>

        </div>
    </section>
);


export {
    APISection,
    BenefitsSection,
    PrebuiltToolsSection,
    AdditionalFeaturesSection,
    SubscriptionSection,
    TestimonialsSection,
    BlogSection,
    CTASection,
    NewsletterSection
};