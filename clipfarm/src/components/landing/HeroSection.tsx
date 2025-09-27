'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    PlayCircle,
    ArrowRight,
    Image as ImageIcon,
    FileText,
    Code2,
    ChevronDown,
    ChevronUp,
    XCircle,
    Bot,
    Brain,
    Globe,
    Layers,
    Paperclip
} from 'lucide-react';

const HeroSection: React.FC = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState('');
    const [selectedModel, setSelectedModel] = useState({
        name: 'GPT 4o',
        icon: <Bot className="w-5 h-5" />,
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // State to manage the 3D transform style (only X-axis rotation now)
    const [transformStyle, setTransformStyle] = useState({});

    const prompts = [
        "Create chaotic brainrot Reel about procrastination memes",
        "Transform a video snippet of my cat into a meme-style Reel with voiceover",
        "Turn my workout routine photos into an energetic, hype TikTok clip",
        "Generate a short Reel explaining a fun science fact in chaotic text overlays",
        "Transform a scenic travel photo into a dreamy, cinematic social media clip"
    ];


    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentPrompt = prompts[currentPromptIndex];
        const typingSpeed = isDeleting ? 50 : 100; // faster when deleting

        const timer = setTimeout(() => {
            setDisplayedText(prev =>
                isDeleting
                    ? currentPrompt.substring(0, prev.length - 1)
                    : currentPrompt.substring(0, prev.length + 1)
            );

            // Switch to deleting
            if (!isDeleting && displayedText === currentPrompt) {
                setTimeout(() => setIsDeleting(true), 1000); // wait before deleting
            }

            // Switch to next prompt
            if (isDeleting && displayedText === '') {
                setIsDeleting(false);
                setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
            }

        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, currentPromptIndex]);


    // Effect for the scroll-based 3D transform
    useEffect(() => {
        // Function to handle the scroll event and update the transform style
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Define a threshold for the scroll effect to end (e.g., 500px)
            const maxScroll = 500;
            // Clamp the scroll value to be between 0 and maxScroll
            const clampedScroll = Math.min(scrollY, maxScroll);

            // Calculate the rotation. Starts at 10deg (tilted away) and goes to 0deg (straight)
            // Initial tilt away from user is achieved with a positive rotateX value.
            const rotationX = 20 - (clampedScroll / maxScroll) * 20;

            setTransformStyle({
                // Only applying rotateX now, with a defined perspective
                transform: `perspective(1500px) rotateX(${rotationX}deg)`,
                transition: 'transform 0.3s ease-out'
            });
        };

        // Initialize the rotation when the component mounts
        handleScroll();

        // Add the scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="hero-section relative mt-20 flex min-h-screen w-full max-w-[100vw] flex-col overflow-hidden max-lg:mt-[100px]">
            {/* Video Modal */}
            <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#71717a_1px,transparent_1px),linear-gradient(to_bottom,#71717a_1px,transparent_1px)] [background-size:40px_40px]" />

            {isVideoOpen && (
                <div className="fixed bg-black/70 dark:bg-gray-500/50 top-0 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-300 p-2 w-full h-full flex justify-center items-center">
                    <div className="max-w-[80vw] max-lg:max-w-full max-lg:w-full transition-transform duration-500 p-6 rounded-xl max-lg:px-2 w-full gap-2 shadow-md h-[90vh] max-lg:h-auto max-lg:min-h-[400px] bg-white dark:bg-[#16171A] max-h-full">
                        <div className="w-full flex">
                            <button
                                type="button"
                                onClick={() => setIsVideoOpen(false)}
                                className="ml-auto text-xl hover:text-gray-600 transition-colors"
                                title="close"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex w-full rounded-xl px-[5%] max-md:px-2 min-h-[300px] max-h-[90%] h-full">
                            <div className="relative bg-black min-w-full min-h-full overflow-clip rounded-md">
                                <iframe
                                    className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full h-full"
                                    src="https://www.youtube.com/embed/6j4fPVkA3EA?si=llcTrXPRM-MRXDZB&controls=0&rel=0&showinfo=0&autoplay=1&loop=1&mute=1"
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="hero-bg-gradient relative flex h-full min-h-screen w-full flex-col justify-center gap-6 p-[5%] max-xl:items-center max-lg:p-4">
                {/* Background gradient */}

                <div className="flex flex-col min-h-[60vh] justify-center items-center">
                    <h1 className="text-center text-7xl font-semibold uppercase leading-[90px] max-lg:text-4xl max-md:leading-snug">
                        <span>All your Content Creation</span>
                        <br />
                        <span className="font-thin font-serif">in one place</span>
                    </h1>

                    <div className='bg-gradient-to-r from-pink-400 to-blue-400 h-0.5 w-[100px] md:w-[500px] mt-10'></div>

                    <div className="mt-8 max-w-[450px] text-lg max-lg:text-base p-2 text-center text-gray-800 dark:text-white max-lg:max-w-full">
                        Your all in one AI companion. Generate videos with captions, voiceovers and subtitles, all with ClipFarm&apos;s interface.
                    </div>

                    <div className="mt-10 max-md:flex-col flex items-center gap-4">
                        <button
                            onClick={() => setIsVideoOpen(true)}
                            className="group w-[170px] max-lg:w-[160px] rounded-xl py-4 max-lg:py-2 flex gap-2 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                        >
                            <span className='text-center w-full'>Watch video</span>
                        </button>

                        <Link
                            href="/create"
                            className="group max-lg:w-[160px] flex gap-2 shadow-lg hover:shadow-2xl w-[170px] rounded-xl py-4 max-lg:py-2 transition duration-300 hover:scale-x-[1.03] bg-white text-black px-4"
                        >
                            <span className='text-center w-full'>Get started</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 duration-300" />
                        </Link>
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 top-[48%]  md:h-[120px] md:w-[800px] bg-gray-400 rounded-full opacity-20 blur-xl"></div>

                {/* Dashboard Preview - This is the element with the new transform effect */}
                <div
                    className="relative mt-8 flex w-full justify-center items-center"
                    style={transformStyle}
                >
                    <div className="absolute left-1/2 -translate-x-1/2 top-[5%] h-[200px] w-[200px] bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-xl"></div>

                    <div className="relative max-w-[80%] bg-white dark:bg-black border dark:border-[#36393c] lg:w-[1024px] lg:h-[650px] flex shadow-xl max-lg:h-[450px] max-lg:w-full overflow-hidden min-w-[320px] md:w-full min-h-[450px] rounded-xl max-md:max-w-full">
                        {/* Animated border effect */}
                        <div className="w-full h-full rounded-xl overflow-hidden flex bg-white dark:bg-black">
                            {/* Sidebar */}
                            <div className="min-w-[250px] max-lg:hidden p-2 gap-2 flex flex-col bg-gray-100 dark:bg-[#171717] h-full">
                                <h2 className="text-xl font-bold opacity-80">ClipFarm</h2>

                                <div className="flex mt-2 gap-2 flex-col">
                                    {[
                                        { icon: <ImageIcon className="w-5 h-5" />, text: 'Video generator', href: '/create' },
                                        { icon: <FileText className="w-5 h-5" />, text: 'Script generator', href: '#' },
                                        { icon: <Code2 className="w-5 h-5" />, text: 'Documentation', href: '#' },
                                    ].map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className="items-center flex rounded-sm gap-2 p-2 dark:hover:bg-[#2d2d2ddb] hover:bg-gray-200 transition-colors"
                                        >
                                            {item.icon}
                                            <span>{item.text}</span>
                                        </Link>
                                    ))}

                                    <Link
                                        href="#"
                                        className="items-center flex rounded-sm group gap-2 p-2 dark:hover:bg-[#2d2d2ddb] hover:bg-gray-200 transition-colors"
                                    >
                                        <span>Show all</span>
                                        <ArrowRight className="items-center w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="mt-auto w-full flex px-6 justify-center">
                                    <Link
                                        href="#"
                                        className="w-full bg-transparent duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black text-black dark:border-white dark:text-white px-4 py-2 rounded-lg text-center transition-colors"
                                    >
                                        Signup
                                    </Link>
                                </div>
                            </div>

                            {/* Main Chat Interface */}
                            <div className="flex w-full p-4 bg-white dark:bg-black h-full flex-col">
                                <div className="relative w-full flex justify-center h-full">
                                    <div className="overflow-y-auto px-[5%] max-lg:px-2 max-lg:max-h-[80%] max-h-[550px] max-lg:mt-12 w-full h-full z-10 flex flex-col items-center">

                                        <div className="relative w-full flex justify-center h-full">
                                            <div className="overflow-y-auto px-[5%] max-lg:px-2 max-lg:max-h-[80%] max-h-[550px] max-lg:mt-12 w-full h-full z-10 flex flex-col items-center">

                                                <div className="w-full flex text-center flex-col justify-center">
                                                    <h2 className="text-4xl max-md:text-2xl max-md:mt-3 opacity-80">
                                                        Try Prompts
                                                    </h2>
                                                    <div className="inline mt-6 max-md:mt-3 h-[30px]">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            {displayedText}
                                                            <span className="animate-pulse">|</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <img
                                                    src={'/assets/logo/image.png'}
                                                    className='m-auto h-[200px] w-[200px] grayscale'
                                                    alt="Logo"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Form */}
                                <form
                                    className="mt-auto h-[50px] p-1 items-center justify-around flex gap-1 bottom-2 w-full rounded-md bg-[#f3f4f6] dark:bg-[#171717]"
                                    onSubmit={(e) => e.preventDefault()}
                                >
                                    <Paperclip className='w-5 h-5 text-zinc-400' />
                                    <input
                                        placeholder="A day in the life of a coffee addict"
                                        type="text"
                                        className="p-2 outline-none bg-transparent border-none w-full placeholder-gray-500 dark:placeholder-opacity-60 dark:placeholder-gray-300 max-w-[80%] h-full"
                                        name="prompt"
                                    />

                                    <button
                                        type="submit"
                                        className="bg-[#6366f1] p-2 px-3 text-white rounded-md hover:bg-[#5856eb] transition-colors"
                                        title="submit"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;