"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, Film, Sparkles, Clock, MessageSquare, Eye, Search, Edit3, Play, ChevronLeft, ChevronRight, Heart, MessageCircle, Send, Bookmark, Battery, Wifi, Sun, Moon } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import TrueFocus from "./TrueFocus";
import SpeakerSelectionModal, { availableSpeakers } from "./SpeakerSelectionModal";
import Link from "next/link";

interface Scene {
    duration: number;
    voiceover: string;
    caption: string;
    visualDescription: string;
    imageQuery: string;
}

interface ScriptData {
    title: string;
    scenes: Scene[];
    totalDuration: number;
}

interface SceneWithImage extends Scene {
    imageUrl?: string;
    imageLoading?: boolean;
    audioStartTime?: number;
    audioEndTime?: number;
    speakerId?: string; // Speaker ID from availableSpeakers for conversational reels
    templateVideo?: string; // Template video URL if using template
}

export default function VideoGenerator() {
    const [prompt, setPrompt] = useState("");
    const [style] = useState("brainrot"); // Fixed to brainrot
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState("");
    const [scriptData, setScriptData] = useState<ScriptData | null>(null);
    const [scenesWithImages, setScenesWithImages] = useState<SceneWithImage[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
    const [ffmpegReady, setFfmpegReady] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPreviewScene, setCurrentPreviewScene] = useState(0);
    const [editingSceneIndex, setEditingSceneIndex] = useState<number | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
    
    // New state for enhanced features
    const [useTemplate, setUseTemplate] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("subway-surfers");
    const [isConversational, setIsConversational] = useState(false);
    const [showSpeakerSelectionModal, setShowSpeakerSelectionModal] = useState(false);
    const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);
    const [conversationalVoices, setConversationalVoices] = useState({ voice1: "male", voice2: "female" });
    const [randomSlang, setRandomSlang] = useState<{ term: string; definition: string } | null>(null);

    useEffect(() => {
        const slangs = [
            { term: 'Rizz', definition: 'Short for charisma. Effortless charm and flirtatiousness.' },
            { term: 'Bet', definition: '"Yes", "okay", or a response to a challenge. It\'s a confirmation.' },
            { term: 'Cap / No Cap', definition: 'A lie or exaggeration. "No cap" means "for real".' },
            { term: 'Skibidi', definition: 'Refers to the chaotic "Skibidi Toilet" YouTube series. Often nonsensical.' },
            { term: 'Fanum Tax', definition: 'The "tax" a friend takes from your food, popularized by streamer Fanum.' },
            { term: 'Gyatt', definition: 'An exclamation for someone with a large posterior. Short for "goddamn".' }
        ];
        const randomIndex = Math.floor(Math.random() * slangs.length);
        setRandomSlang(slangs[randomIndex]);
    }, []);

    useEffect(() => {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        const loadFFmpeg = async () => {
            const instance = new FFmpeg();
            instance.on("log", ({ message }) => console.log("FFmpeg:", message));

            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
            await instance.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            setFfmpeg(instance);
            setFfmpegReady(true);
        };
        loadFFmpeg();
    }, []);

    // Helper function to get speaker by ID
    const getSpeakerById = (speakerId: string) => {
        return availableSpeakers.find(s => s.id === speakerId);
    };

    const handleSpeakerSelection = (speakers: string[]) => {
        console.log('Selected speakers:', speakers);
        setSelectedSpeakers(speakers);
        setShowSpeakerSelectionModal(false);
        
        // If we have scenes already, update them with the new speaker assignments
        if (scenesWithImages.length > 0) {
            const updatedScenes = scenesWithImages.map((scene, index) => ({
                ...scene,
                speakerId: speakers[index % 2] // Alternate between the two selected speakers
            }));
            setScenesWithImages(updatedScenes);
        }
    };

    const generateScript = async () => {
        if (!prompt.trim()) return;

        // If conversational is selected, show speaker selection modal first
        if (isConversational && selectedSpeakers.length < 2) {
            setShowSpeakerSelectionModal(true);
            return;
        }

        setIsGenerating(true);
        setVideoUrl(null);
        setScriptData(null);
        setScenesWithImages([]);
        setIsEditing(false);

        try {
            // Step 1: Generate script
            setGenerationStep("Generating script with AI...");
            const scriptResponse = await fetch("/api/generate-script", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    prompt, 
                    style: "brainrot", 
                    isConversational,
                    useTemplate 
                }),
            });

            if (!scriptResponse.ok) throw new Error("Failed to generate script");
            const script: ScriptData = await scriptResponse.json();
            setScriptData(script);

            // Initialize scenes with loading state and calculate audio timing
            let currentTime = 0;
            const initialScenes = script.scenes.map((scene, index) => {
                const sceneWithTiming = {
                    ...scene,
                    imageLoading: !useTemplate,
                    templateVideo: useTemplate ? getTemplateVideo(selectedTemplate) : undefined,
                    speakerId: isConversational && selectedSpeakers.length >= 2 ? 
                        selectedSpeakers[index % 2] : // Alternate between the two selected speakers
                        undefined,
                    audioStartTime: currentTime,
                    audioEndTime: currentTime + scene.duration
                };
                currentTime += scene.duration;
                return sceneWithTiming;
            });
            setScenesWithImages(initialScenes);

            if (!useTemplate) {
                // Step 2: Fetch images (only if not using template)
                setGenerationStep("Fetching stock images...");
                const imageQueries = script.scenes.map((s) => s.imageQuery);
                const imagesResponse = await fetch("/api/fetch-images", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageQueries }),
                });

                if (!imagesResponse.ok) throw new Error("Failed to fetch images");
                const { images } = await imagesResponse.json();

                // Update scenes with actual images while preserving timing
                const updatedScenes = initialScenes.map((scene, index) => ({
                    ...scene,
                    imageUrl: images[index]?.url,
                    imageLoading: false
                }));
                setScenesWithImages(updatedScenes);
            }
            
            setIsEditing(true);
            setGenerationStep(useTemplate ? 
                "✅ Script and template ready for editing!" : 
                "✅ Script and images ready for editing!"
            );
        } catch (error) {
            console.error("Error generating script:", error);
            setGenerationStep(`Error: ${error}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const getTemplateVideo = (template: string): string => {
        const templates = {
            "subway-surfers": "/assets/templates/subway-surfers.mp4",
            "minecraft-parkour": "/assets/templates/minecraft-parkour.mp4",
            "satisfying-clips": "/assets/templates/satisfying-clips.mp4",
            "fidget-spinner": "/assets/templates/fidget-spinner.mp4"
        };
        return templates[template as keyof typeof templates] || templates["subway-surfers"];
    };

    // Add a function to get the duration from an audio Blob
    const getAudioDuration = async (audioBlob: Blob): Promise<number> => {
        return new Promise((resolve) => {
            const audio = new Audio();

            const cleanup = () => {
                URL.revokeObjectURL(audio.src);
                audio.removeEventListener('loadedmetadata', onLoadedMetadata);
                audio.removeEventListener('error', onError);
            };

            const onLoadedMetadata = () => {
                const duration = audio.duration;
                cleanup();
                resolve(duration);
            };

            const onError = () => {
                console.error("Failed to load audio metadata for duration calculation, assuming 0s.");
                cleanup();
                resolve(0);
            };

            audio.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
            audio.addEventListener('error', onError, { once: true });

            audio.src = URL.createObjectURL(audioBlob);
        });
    };

    const proceedToVideo = async () => {
        setIsGenerating(true);
        setIsEditing(false);

        try {
            setGenerationStep("Generating voiceover for each scene...");
            const audioFiles: Blob[] = [];
            const audioDurations: number[] = [];
            const newScenesWithImages = [...scenesWithImages];

            for (let i = 0; i < newScenesWithImages.length; i++) {
                const scene = newScenesWithImages[i];
                setGenerationStep(`Generating voiceover for scene ${i + 1}/${newScenesWithImages.length}...`);

                // Determine voice for conversational mode
                let voiceType = "default";
                if (isConversational && scene.speakerId) {
                    const speaker = getSpeakerById(scene.speakerId);
                    voiceType = speaker?.voice || "alloy";
                }

                const audioResponse = await fetch("/api/generate-audio", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        text: scene.voiceover,
                        voice: voiceType 
                    }),
                });

                if (!audioResponse.ok) throw new Error(`Failed to generate audio for scene ${i + 1}`);
                const audioBlob = await audioResponse.blob();

                // 1. Get actual audio duration
                const actualDuration = await getAudioDuration(audioBlob);

                // 2. Store audio file and actual duration
                audioFiles.push(audioBlob);
                audioDurations.push(actualDuration);

                // 3. CRITICAL FIX: Update the scene's duration with the actual audio duration
                newScenesWithImages[i] = {
                    ...scene,
                    duration: actualDuration,
                    audioStartTime: i === 0 ? 0 : audioDurations.slice(0, i).reduce((a, b) => a + b, 0),
                    audioEndTime: audioDurations.slice(0, i + 1).reduce((a, b) => a + b, 0),
                };
            }

            // Update state with synchronized durations
            setScenesWithImages(newScenesWithImages);

            // Update scriptData total duration
            const newTotalDuration = audioDurations.reduce((sum, duration) => sum + duration, 0);
            if (scriptData) {
                setScriptData(prev => prev ? { ...prev, totalDuration: newTotalDuration, scenes: newScenesWithImages } : null);
            }

            // Step 4: Combine into video
            setGenerationStep("Creating synchronized video...");
            const images = newScenesWithImages.map(scene => ({ url: scene.imageUrl }));

            // Pass the actual audio durations to the video creation function
            await createSynchronizedVideo(scriptData!, images, audioFiles, audioDurations);

            setGenerationStep("✅ Video generated!");
        } catch (error) {
            console.error("Error generating video:", error);
            setGenerationStep(`Error: ${error}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const updateScene = (index: number, field: keyof SceneWithImage, value: string | number) => {
        const updatedScenes = [...scenesWithImages];
        const oldDuration = updatedScenes[index].duration;
        updatedScenes[index] = { ...updatedScenes[index], [field]: value };

        // If duration changed, recalculate timing for all subsequent scenes
        if (field === 'duration') {
            const durationDiff = (value as number) - oldDuration;
            for (let i = index; i < updatedScenes.length; i++) {
                if (i === index) {
                    updatedScenes[i].audioEndTime = updatedScenes[i].audioStartTime! + (value as number);
                } else {
                    updatedScenes[i].audioStartTime! += durationDiff;
                    updatedScenes[i].audioEndTime! += durationDiff;
                }
            }
        }

        setScenesWithImages(updatedScenes);

        // Update script data as well
        if (scriptData) {
            const updatedScript = { ...scriptData };
            updatedScript.scenes[index] = { ...updatedScript.scenes[index], [field]: value };

            // Recalculate total duration
            if (field === 'duration') {
                updatedScript.totalDuration = updatedScript.scenes.reduce((total, scene) => total + scene.duration, 0);
            }

            setScriptData(updatedScript);
        }
    };

    const regenerateImage = async (index: number) => {
        const updatedScenes = [...scenesWithImages];
        updatedScenes[index] = { ...updatedScenes[index], imageLoading: true };
        setScenesWithImages(updatedScenes);

        try {
            const imagesResponse = await fetch("/api/fetch-images", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageQueries: [updatedScenes[index].imageQuery] }),
            });

            if (!imagesResponse.ok) throw new Error("Failed to fetch new image");
            const { images } = await imagesResponse.json();

            const finalUpdatedScenes = [...scenesWithImages];
            finalUpdatedScenes[index] = {
                ...finalUpdatedScenes[index],
                imageUrl: images[0]?.url,
                imageLoading: false
            };

            setScenesWithImages(finalUpdatedScenes);

        } catch (error) {
            console.error("Error regenerating image:", error);
            const errorUpdatedScenes = [...scenesWithImages];
            errorUpdatedScenes[index] = { ...errorUpdatedScenes[index], imageLoading: false };
            setScenesWithImages(errorUpdatedScenes);
        }
    };

    const getWrappedLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, font: string): string[] => {
        ctx.font = font;
        const words = text.split(" ");
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    };

    // Helper function to get sticker emoji by type
    function getStickerEmoji(type: "person1" | "person2" | "robot" | "cat" | "alien" | "wizard"): string {
        switch (type) {
            case "person1":
                return "👨";
            case "person2":
                return "👩";
            case "robot":
                return "🤖";
            case "cat":
                return "🐱";
            case "alien":
                return "👽";
            case "wizard":
                return "🧙";
            default:
                return "👤";
        }
    }

    const createSynchronizedVideo = async (script: ScriptData, images: any[], audioFiles: Blob[], audioDurations: number[]) => {
        if (!ffmpeg || !ffmpeg.loaded) {
            throw new Error("FFmpeg is not loaded. Please ensure it has loaded before calling this function.");
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = 1080;
        canvas.height = 1920;

        const fps = 30;
        let frameCount = 0;

        // Write individual audio files to FFmpeg
        for (let i = 0; i < audioFiles.length; i++) {
            await ffmpeg.writeFile(`audio_${i}.mp3`, await fetchFile(audioFiles[i]));
        }

        // Create frames for each scene
        for (let i = 0; i < script.scenes.length; i++) {
            const scene = script.scenes[i];
            const sceneWithImage = scenesWithImages[i];
            const actualSceneDuration = audioDurations[i] || scene.duration;

            // Handle background (template vs image)
            let backgroundElement = null;
            if (useTemplate) {
                backgroundElement = null;
            } else {
                const img = new Image();
                img.crossOrigin = "anonymous";

                await new Promise((resolve) => {
                    img.onload = () => resolve(undefined);
                    img.onerror = () => {
                        console.error(`Failed to load image for scene ${i}`);
                        resolve(undefined);
                    };
                    img.src = images[i]?.url || '';
                });
                backgroundElement = img;
            }

            const framesForScene = Math.floor(actualSceneDuration * fps);

            // Setup for Animated Voiceover Subtitles
            const voiceoverText = scene.voiceover;
            const allWords = voiceoverText.split(/\s+/).filter(w => w.length > 0);
            const totalWords = allWords.length;
            const wordDuration = totalWords > 0 ? actualSceneDuration / totalWords : 0;

            for (let f = 0; f < framesForScene; f++) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // 1. Draw background
                if (useTemplate) {
                    // Draw template background (gradient placeholder)
                    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                    gradient.addColorStop(0, '#3B82F6');
                    gradient.addColorStop(1, '#8B5CF6');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Add template title
                    ctx.fillStyle = "white";
                    ctx.font = "bold 48px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        selectedTemplate.replace('-', ' ').toUpperCase(),
                        canvas.width / 2,
                        canvas.height / 2 - 100
                    );
                    ctx.font = "24px Arial";
                    ctx.fillText("Template Background", canvas.width / 2, canvas.height / 2 - 50);
                } else if (backgroundElement && backgroundElement.complete && backgroundElement.naturalHeight !== 0) {
                    const scale = Math.max(canvas.width / backgroundElement.width, canvas.height / backgroundElement.height);
                    ctx.drawImage(
                        backgroundElement,
                        (canvas.width - backgroundElement.width * scale) / 2,
                        (canvas.height - backgroundElement.height * scale) / 2,
                        backgroundElement.width * scale,
                        backgroundElement.height * scale
                    );
                } else {
                    ctx.fillStyle = "#1f1f1f";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "white";
                    ctx.font = "bold 48px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("Loading...", canvas.width / 2, canvas.height / 2);
                }

                // 2. Draw conversational stickers if enabled
                if (isConversational && sceneWithImage?.speakerId) {
                    const speaker = getSpeakerById(sceneWithImage.speakerId);
                    if (speaker) {
                        const stickerEmoji = getStickerEmoji(speaker.sticker as "person1" | "person2" | "robot" | "cat" | "alien" | "wizard");
                        const stickerSize = 120;
                        const stickerX = canvas.width / 2;
                        const stickerY = canvas.height - 300;

                        // Draw sticker background
                        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                        ctx.beginPath();
                        ctx.arc(stickerX, stickerY, stickerSize / 2, 0, 2 * Math.PI);
                        ctx.fill();

                        // Draw sticker emoji
                        ctx.font = `${stickerSize - 20}px Arial`;
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(stickerEmoji, stickerX, stickerY);
                    }
                }

                // --- DRAWING AREA DEFINITIONS ---
                const subtitleY = canvas.height - 100;
                const captionY = canvas.height - (isConversational ? 180 : 250);
                const lineSpacing = 80;
                const textFont = "bold 64px Arial";
                const textFill = "white";
                const textStroke = "black";
                const strokeWidth = 10;
                ctx.font = textFont;
                ctx.textAlign = "center";
                ctx.textBaseline = "alphabetic";

                // 3. DRAW STATIC CAPTION
                if (scene.caption) {
                    const captionLines = getWrappedLines(ctx, scene.caption, canvas.width - 40, textFont);

                    ctx.fillStyle = "rgba(0,0,0,0.6)";
                    ctx.fillRect(0, captionY - lineSpacing, canvas.width, captionLines.length * lineSpacing + 40);

                    captionLines.forEach((line, index) => {
                        const textY = captionY + (index * lineSpacing);

                        ctx.strokeStyle = textStroke;
                        ctx.lineWidth = strokeWidth;
                        ctx.lineJoin = 'round';
                        ctx.strokeText(line, canvas.width / 2, textY);

                        ctx.fillStyle = textFill;
                        ctx.fillText(line, canvas.width / 2, textY);
                    });
                }

                // 4. DRAW ANIMATED DIALOGUE SUBTITLE
                if (subtitlesEnabled && voiceoverText && totalWords > 0) {
                    const currentTimeInScene = f / fps;
                    const wordsToShow = Math.min(totalWords, Math.ceil(currentTimeInScene / wordDuration));
                    const currentSubtitleText = allWords.slice(0, wordsToShow).join(' ');

                    const subtitleLines = getWrappedLines(ctx, currentSubtitleText, canvas.width - 40, textFont);

                    subtitleLines.forEach((line, index) => {
                        const textY = subtitleY + (index * lineSpacing) - (subtitleLines.length * lineSpacing);

                        ctx.strokeStyle = textStroke;
                        ctx.lineWidth = strokeWidth;
                        ctx.lineJoin = 'round';
                        ctx.strokeText(line, canvas.width / 2, textY);

                        ctx.fillStyle = textFill;
                        ctx.fillText(line, canvas.width / 2, textY);
                    });
                }

                const frameBlob = await new Promise<Blob>((resolve) =>
                    canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.9)
                );
                const frameBuffer = new Uint8Array(await frameBlob.arrayBuffer());

                await ffmpeg.writeFile(`frame_${String(frameCount).padStart(5, "0")}.jpg`, frameBuffer);
                frameCount++;
            }
        }

        // FFmpeg Audio Concatenation Logic
        let audioFilterComplex = "";
        let audioInputs = "";

        for (let i = 0; i < audioFiles.length; i++) {
            audioInputs += `-i audio_${i}.mp3 `;
        }

        let concatInputs = '';
        for (let i = 0; i < audioFiles.length; i++) {
            concatInputs += `[${i + 1}:a]`;
        }
        audioFilterComplex = `${concatInputs}concat=n=${audioFiles.length}:v=0:a=1[audio]`;

        // Execute FFmpeg command
        const ffmpegCommand = [
            "-r", String(fps),
            "-i", "frame_%05d.jpg",
            ...audioInputs.trim().split(" "),
            "-filter_complex", audioFilterComplex,
            "-map", "0:v",
            "-map", "[audio]",
            "-c:v", "libx264",
            "-c:a", "aac",
            "-pix_fmt", "yuv420p",
            "-shortest",
            "-y",
            "output.mp4"
        ];

        await ffmpeg.exec(ffmpegCommand);

        const data = await ffmpeg.readFile("output.mp4");

        // Convert string data to Uint8Array
        const uint8Data = typeof data === "string"
            ? new Uint8Array([...data].map((c) => c.charCodeAt(0)))
            : data;

        const regularBuffer = new ArrayBuffer(uint8Data.length);
        const regularView = new Uint8Array(regularBuffer);
        regularView.set(uint8Data);
        const videoBlob = new Blob([regularBuffer], { type: "video/mp4" });
        const videoObjectUrl = URL.createObjectURL(videoBlob);
        setVideoUrl(videoObjectUrl);

        // Cleanup files
        for (let f = 0; f < frameCount; f++) {
            await ffmpeg.deleteFile(`frame_${String(f).padStart(5, "0")}.jpg`);
        }
        for (let i = 0; i < audioFiles.length; i++) {
            await ffmpeg.deleteFile(`audio_${i}.mp3`);
        }
        await ffmpeg.deleteFile("output.mp4");
    };

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

                <Card className="w-auto m-auto bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl">
                            <Sparkles className="w-6 h-6 mr-2 text-purple-500" />
                            Create Your Reel
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                placeholder="e.g., A cat discovering a magic yarn ball"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="h-12 text-base dark:bg-zinc-800"
                                disabled={isEditing}
                            />
                            
                            {/* Template Selection */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="useTemplate"
                                        checked={useTemplate}
                                        onChange={(e) => setUseTemplate(e.target.checked)}
                                        disabled={isEditing}
                                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="useTemplate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        Use background video template
                                    </label>
                                </div>
                                
                                {useTemplate && (
                                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate} disabled={isEditing}>
                                        <SelectTrigger className="h-12 text-base text-purple-500 dark:bg-zinc-800">
                                            <SelectValue placeholder="Select a template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="subway-surfers">Subway Surfers</SelectItem>
                                            <SelectItem value="minecraft-parkour">Minecraft Parkour</SelectItem>
                                            <SelectItem value="satisfying-clips">Satisfying Clips</SelectItem>
                                            <SelectItem value="fidget-spinner">Fidget Spinner</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                            
                            {/* Conversational Reel Option */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isConversational"
                                        checked={isConversational}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setIsConversational(checked);
                                            if (checked && selectedSpeakers.length < 2) {
                                                setShowSpeakerSelectionModal(true);
                                            } else if (!checked) {
                                                setSelectedSpeakers([]);
                                            }
                                        }}
                                        disabled={isEditing}
                                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="isConversational" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        Make it conversational (dialogue between two people)
                                    </label>
                                </div>
                                
                                {isConversational && (
                                    <div className="space-y-2">
                                        <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg">
                                            This will create a dialogue between two people with animated stickers and different voices for each speaker.
                                        </div>
                                        
                                        {/* Show selected speakers */}
                                        {selectedSpeakers.length >= 2 && (
                                            <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Selected Speakers:</span>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded-full text-purple-700 dark:text-purple-300">
                                                            {getSpeakerById(selectedSpeakers[0])?.name || 'Unknown'}
                                                        </span>
                                                        <span className="text-xs text-purple-500">vs</span>
                                                        <span className="text-xs bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded-full text-purple-700 dark:text-purple-300">
                                                            {getSpeakerById(selectedSpeakers[1])?.name || 'Unknown'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowSpeakerSelectionModal(true)}
                                                    disabled={isEditing}
                                                    className="text-xs h-7"
                                                >
                                                    Change
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isEditing ? (
                            <Button
                                onClick={generateScript}
                                disabled={isGenerating || !prompt.trim() || !ffmpegReady}
                                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-transform transform hover:scale-101 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <div className="flex items-center">
                                        <Loader2 className="animate-spin mr-3" />
                                        <span>{generationStep || 'Generating...'}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-wrap">
                                        <Film className="mr-2" />
                                        <span>Generate Script & Images</span>
                                    </div>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={proceedToVideo}
                                disabled={isGenerating}
                                className="w-full h-14 text-lg font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-transform transform hover:scale-101 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <div className="flex items-center">
                                        <Loader2 className="animate-spin mr-3" />
                                        <span>{generationStep || 'Creating Video...'}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Play className="mr-2" />
                                        <span>Proceed to Generate Video</span>
                                    </div>
                                )}
                            </Button>
                        )}

                        {generationStep && <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">{generationStep}</p>}
                    </CardContent>
                </Card>

                {/* Speaker Selection Modal */}
                <SpeakerSelectionModal
                    isOpen={showSpeakerSelectionModal}
                    onClose={() => setShowSpeakerSelectionModal(false)}
                    onConfirm={handleSpeakerSelection}
                />

                {/* Dynamic Slang Section */}
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

                {/* Editing Interface */}
                {isEditing && scriptData && scenesWithImages.length > 0 && (
                    <div className="grid lg:grid-cols-2 gap-8 mt-20">

                        {/* Left Side - Editing Controls */}
                        <div className="space-y-4">
                            <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center">
                                        <Edit3 className="w-5 h-5 mr-2 text-purple-500" />
                                        Edit Scenes
                                        <span className="ml-auto text-sm text-zinc-500">
                                            Total: {scenesWithImages.reduce((sum, scene) => sum + scene.duration, 0)}s
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                                    {scenesWithImages.map((scene, index) => (
                                        <Card key={index} className={`border ${currentPreviewScene === index ? 'border-purple-500' : 'border-zinc-200 dark:border-zinc-700'} bg-zinc-50 dark:bg-zinc-800/50`}>
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                                        Scene {index + 1}
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentPreviewScene(index)}
                                                            className="h-8"
                                                        >
                                                            <Eye className="w-3 h-3 mr-1" />
                                                            Preview
                                                        </Button>
                                                        <div className="flex items-center text-xs text-zinc-500">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            <Input
                                                                type="number"
                                                                value={scene.duration}
                                                                onChange={(e) => updateScene(index, 'duration', Number(e.target.value))}
                                                                className="w-16 h-6 text-xs"
                                                                min="1"
                                                                max="10"
                                                            />
                                                            s
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {/* Speaker Selection for Conversational Mode */}
                                                {isConversational && (
                                                    <div className="mb-3">
                                                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                                                            Speaker:
                                                        </label>
                                                        <Select 
                                                            value={scene.speakerId || (selectedSpeakers.length > 0 ? selectedSpeakers[0] : '')} 
                                                            onValueChange={(value: string) => 
                                                                updateScene(index, 'speakerId', value)
                                                            }
                                                        >
                                                            <SelectTrigger className="h-8 text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {selectedSpeakers.map((speakerId) => {
                                                                    const speaker = getSpeakerById(speakerId);
                                                                    return (
                                                                        <SelectItem key={speakerId} value={speakerId}>
                                                                            <div className="flex items-center space-x-2">
                                                                                <span>{getStickerEmoji(speaker?.sticker as any)}</span>
                                                                                <span>{speaker?.name}</span>
                                                                            </div>
                                                                        </SelectItem>
                                                                    );
                                                                })}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}

                                                {/* Voiceover */}
                                                <div>
                                                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center">
                                                        <MessageSquare className="w-3 h-3 mr-1" />
                                                        {isConversational ? "Dialogue:" : "Voiceover:"}
                                                    </label>
                                                    <Textarea
                                                        value={scene.voiceover}
                                                        onChange={(e) => updateScene(index, 'voiceover', e.target.value)}
                                                        className="mt-1 min-h-[60px] text-sm"
                                                    />
                                                </div>

                                                {/* Caption */}
                                                <div>
                                                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                                        Caption:
                                                    </label>
                                                    <Input
                                                        value={scene.caption}
                                                        onChange={(e) => updateScene(index, 'caption', e.target.value)}
                                                        className="mt-1 text-sm"
                                                    />
                                                </div>

                                                {/* Image Query - Only show if not using template */}
                                                {!useTemplate && (
                                                    <div>
                                                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center">
                                                            <Search className="w-3 h-3 mr-1" />
                                                            Image Search:
                                                        </label>
                                                        <div className="flex space-x-2 mt-1">
                                                            <Input
                                                                value={scene.imageQuery}
                                                                onChange={(e) => updateScene(index, 'imageQuery', e.target.value)}
                                                                className="text-sm"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => regenerateImage(index)}
                                                                disabled={scene.imageLoading}
                                                                className="whitespace-nowrap"
                                                            >
                                                                {scene.imageLoading ? (
                                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                                ) : (
                                                                    "Re-gen"
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Template info - Show if using template */}
                                                {useTemplate && (
                                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                                            Using template: <strong>{selectedTemplate.replace('-', ' ')}</strong>
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Visual Description */}
                                                <div>
                                                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                                        Visual Description:
                                                    </label>
                                                    <Textarea
                                                        value={scene.visualDescription}
                                                        onChange={(e) => updateScene(index, 'visualDescription', e.target.value)}
                                                        className="mt-1 min-h-[40px] text-sm"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Side - Mobile Preview */}
                        <div className="space-y-4">
                            <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-lg min-h-full">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center justify-between">
                                        <span className="flex items-center">
                                            <Eye className="w-5 h-5 mr-2 text-purple-500" />
                                            Preview
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPreviewScene(Math.max(0, currentPreviewScene - 1))}
                                                disabled={currentPreviewScene === 0}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                {currentPreviewScene + 1} / {scenesWithImages.length}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPreviewScene(Math.min(scenesWithImages.length - 1, currentPreviewScene + 1))}
                                                disabled={currentPreviewScene === scenesWithImages.length - 1}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    {/* Mobile Phone Frame (iPhone Style) */}
                                    <div className="relative">
                                        {/* Outer Shell */}
                                        <div className="w-64 h-[550px] bg-gray-900 border-4 border-black rounded-[2rem] p-0.5 shadow-2xl relative overflow-hidden">

                                            {/* Inner Screen */}
                                            <div className="w-full h-full bg-black rounded-[1.8rem] overflow-hidden relative">

                                                {/* The iPhone 'Notch' */}
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-20 shadow-md">
                                                    {/* Speaker and Camera indicators */}
                                                    <div className="flex items-center justify-center h-full space-x-2">
                                                        <div className="w-1.5 h-1.5 bg-gray-700 rounded-full"></div> {/* Camera */}
                                                        <div className="w-8 h-1 bg-gray-700 rounded-full"></div> {/* Speaker */}
                                                    </div>
                                                </div>

                                                {/* Status Bar */}
                                                <div className="absolute top-0 left-0 right-0 h-8 z-10 flex items-center justify-between px-3 pt-1">
                                                    {/* Time (Top Left) */}
                                                    <div className="text-white text-sm font-semibold">9:41</div>

                                                    {/* Indicators (Top Right) */}
                                                    <div className="flex items-center space-x-1 text-white text-xs">
                                                        {/* WiFi */}
                                                        <Wifi className="w-4 h-4" />
                                                        {/* Battery */}
                                                        <div className="ml-2">
                                                            <Battery className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Video Content */}
                                                <div className="w-full h-full relative pt-8">
                                                    {/* Background - Template or Image */}
                                                    {useTemplate ? (
                                                        <div className="w-full h-full bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center">
                                                            <div className="text-white text-center">
                                                                <div className="text-lg font-bold mb-2">
                                                                    {selectedTemplate.replace('-', ' ').toUpperCase()}
                                                                </div>
                                                                <div className="text-sm opacity-75">Template Preview</div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        scenesWithImages[currentPreviewScene]?.imageUrl && (
                                                            <img
                                                                src={scenesWithImages[currentPreviewScene].imageUrl}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )
                                                    )}

                                                    {/* Conversational Stickers */}
                                                    {isConversational && scenesWithImages[currentPreviewScene]?.speakerId && (
                                                        <div className="absolute bottom-32 left-4 right-4 flex justify-center">
                                                            <div className="bg-white bg-opacity-90 rounded-full p-3 text-2xl shadow-lg">
                                                                {(() => {
                                                                    const speaker = getSpeakerById(scenesWithImages[currentPreviewScene].speakerId!);
                                                                    return getStickerEmoji(speaker?.sticker as any);
                                                                })()}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Instagram Reel Style Icons */}
                                                    <div className="absolute right-3 bottom-20 flex flex-col items-center space-y-5 text-white">
                                                        <button>
                                                            <Heart className="w-7 h-7" />
                                                        </button>
                                                        <button>
                                                            <MessageCircle className="w-7 h-7" />
                                                        </button>
                                                        <button>
                                                            <Send className="w-7 h-7" />
                                                        </button>
                                                        <button>
                                                            <Bookmark className="w-7 h-7" />
                                                        </button>
                                                    </div>

                                                    {/* Caption Overlay */}
                                                    {scenesWithImages[currentPreviewScene]?.caption && (
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3">
                                                            <p className="text-white text-sm text-center font-medium leading-tight">
                                                                {scenesWithImages[currentPreviewScene].caption}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {/* The Home Indicator Bar (at the very bottom) */}
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-white rounded-full z-30"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Final Video Section */}
                {videoUrl && (
                    <Card className="mt-12 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-lg animate-fade-in">
                        <CardHeader>
                            <CardTitle className="text-2xl">Your Masterpiece is Ready!</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <video src={videoUrl} controls className="w-full max-w-md mx-auto rounded-lg shadow-md mb-4" />
                            <Button asChild variant="outline" className="mt-2 h-12 text-base font-semibold border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-400 dark:hover:text-zinc-900 transition-colors">
                                <a href={videoUrl} download="reel.mp4">
                                    <Download className="mr-2 h-5 w-5" /> Download Reel
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}