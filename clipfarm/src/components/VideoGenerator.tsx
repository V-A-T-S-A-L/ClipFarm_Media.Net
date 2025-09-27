
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import TrueFocus from "./TrueFocus";
import GeneratorForm from "./video-generator/GeneratorForm";
import EditingInterface from "./video-generator/EditingInterface";
import FinalVideo from "./video-generator/FinalVideo";
import { useVideoGenerator } from "@/hooks/useVideoGenerator";

export default function VideoGenerator() {
    const videoGenerator = useVideoGenerator();
    const { darkMode, toggleDarkMode, randomSlang, isGenerating, isEditing, videoUrl } = videoGenerator;

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <>
            <div className="flex justify-between">
                <div className="flex items-center h-[30px] max-w-[100px]">
                    <img
                        src="/assets/logo/image.png"
                        alt="ClipFarm logo"
                        width={100}
                        height={30}
                        className="object-contain h-full w-full"
                    />
                    <Link href="/" className="flex items-center">
                        <span className="ml-3 uppercase text-base font-medium">ClipFarm</span>
                    </Link>
                </div>
                <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="header-links text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                    title="toggle-theme"
                    id="theme-toggle"
                >
                    {darkMode ? <Moon size={24} /> : <Sun size={24} />}
                </button>
            </div>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
                <div className="text-center text-purple-500">
                    <TrueFocus
                        sentence="ClipFarm:AI Reel Generator"
                        manualMode={true}
                        blurAmount={5}
                        borderColor="pink"
                        animationDuration={0.5}
                        pauseBetweenAnimations={1}
                    />
                    <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">Turn your ideas into viral videos in seconds.</p>
                </div>

                <GeneratorForm videoGenerator={videoGenerator} />

                {!isGenerating && !isEditing && !videoUrl && randomSlang && (
                    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
                        <div className="w-full max-w-md mx-auto mb-6 px-4 pointer-events-auto">
                            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg border border-white/30 dark:border-zinc-800/70 rounded-2xl shadow-xl p-5">
                                <div className="text-center">
                                    <p className="font-bold text-2xl text-pink-500">{randomSlang.term}</p>
                                    <p className="text-base mt-2 text-zinc-600 dark:text-zinc-300">{randomSlang.definition}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isEditing && <EditingInterface videoGenerator={videoGenerator} />}

                <FinalVideo videoUrl={videoUrl} />
            </div>
        </>
    );
}
