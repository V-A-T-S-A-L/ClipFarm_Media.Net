"use client";

import { useState, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { getAudioDuration, getSpeakerById, getTemplateVideo, getWrappedLines, getStickerEmoji } from "@/lib/videoUtils";
import { availableSpeakers } from "@/components/SpeakerSelectionModal";

// Interfaces
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

export interface SceneWithImage extends Scene {
    imageUrl?: string;
    imageLoading?: boolean;
    audioStartTime?: number;
    audioEndTime?: number;
    speakerId?: string;
    templateVideo?: string;
}

export const useVideoGenerator = () => {
    const [prompt, setPrompt] = useState("");
    const [style] = useState("brainrot");
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
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
    const [useTemplate, setUseTemplate] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("subway-surfers");
    const [isConversational, setIsConversational] = useState(false);
    const [showSpeakerSelectionModal, setShowSpeakerSelectionModal] = useState(false);
    const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);
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

    const handleSpeakerSelection = (speakers: string[]) => {
        console.log('Selected speakers:', speakers);
        setSelectedSpeakers(speakers);
        setShowSpeakerSelectionModal(false);
        
        if (scenesWithImages.length > 0) {
            const updatedScenes = scenesWithImages.map((scene, index) => ({
                ...scene,
                speakerId: speakers[index % 2]
            }));
            setScenesWithImages(updatedScenes);
        }
    };

    const generateScript = async () => {
        if (!prompt.trim()) return;

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

            let currentTime = 0;
            const initialScenes = script.scenes.map((scene, index) => {
                const sceneWithTiming = {
                    ...scene,
                    imageLoading: !useTemplate,
                    templateVideo: useTemplate ? getTemplateVideo(selectedTemplate) : undefined,
                    speakerId: isConversational && selectedSpeakers.length >= 2 ? 
                        selectedSpeakers[index % 2] :
                        undefined,
                    audioStartTime: currentTime,
                    audioEndTime: currentTime + scene.duration
                };
                currentTime += scene.duration;
                return sceneWithTiming;
            });
            setScenesWithImages(initialScenes);

            if (!useTemplate) {
                setGenerationStep("Fetching stock images...");
                const imageQueries = script.scenes.map((s) => s.imageQuery);
                const imagesResponse = await fetch("/api/fetch-images", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageQueries }),
                });

                if (!imagesResponse.ok) throw new Error("Failed to fetch images");
                const { images } = await imagesResponse.json();

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
                const actualDuration = await getAudioDuration(audioBlob);

                audioFiles.push(audioBlob);
                audioDurations.push(actualDuration);

                newScenesWithImages[i] = {
                    ...scene,
                    duration: actualDuration,
                    audioStartTime: i === 0 ? 0 : audioDurations.slice(0, i).reduce((a, b) => a + b, 0),
                    audioEndTime: audioDurations.slice(0, i + 1).reduce((a, b) => a + b, 0),
                };
            }

            setScenesWithImages(newScenesWithImages);

            const newTotalDuration = audioDurations.reduce((sum, duration) => sum + duration, 0);
            if (scriptData) {
                setScriptData(prev => prev ? { ...prev, totalDuration: newTotalDuration, scenes: newScenesWithImages } : null);
            }

            setGenerationStep("Creating synchronized video...");
            const images = newScenesWithImages.map(scene => ({ url: scene.imageUrl }));

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

        if (scriptData) {
            const updatedScript = { ...scriptData };
            updatedScript.scenes[index] = { ...updatedScript.scenes[index], [field]: value };

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

    const createSynchronizedVideo = async (script: ScriptData, images: any[], audioFiles: Blob[], audioDurations: number[]) => {
        if (!ffmpeg || !ffmpeg.loaded) {
            throw new Error("FFmpeg is not loaded.");
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = 1080;
        canvas.height = 1920;
        const fps = 30;
        let frameCount = 0;

        for (let i = 0; i < audioFiles.length; i++) {
            await ffmpeg.writeFile(`audio_${i}.mp3`, await fetchFile(audioFiles[i]));
        }

        for (let i = 0; i < script.scenes.length; i++) {
            const scene = script.scenes[i];
            const sceneWithImage = scenesWithImages[i];
            const actualSceneDuration = audioDurations[i] || scene.duration;
            let backgroundElement: HTMLImageElement | null = null;

            if (!useTemplate) {
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
            const voiceoverText = scene.voiceover;
            const allWords = voiceoverText.split(/\s+/).filter(w => w.length > 0);
            const totalWords = allWords.length;
            const wordDuration = totalWords > 0 ? actualSceneDuration / totalWords : 0;

            for (let f = 0; f < framesForScene; f++) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (useTemplate) {
                    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                    gradient.addColorStop(0, '#3B82F6');
                    gradient.addColorStop(1, '#8B5CF6');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "white";
                    ctx.font = "bold 48px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText(selectedTemplate.replace('-', ' ').toUpperCase(), canvas.width / 2, canvas.height / 2 - 100);
                    ctx.font = "24px Arial";
                    ctx.fillText("Template Background", canvas.width / 2, canvas.height / 2 - 50);
                } else if (backgroundElement && backgroundElement.complete && backgroundElement.naturalHeight !== 0) {
                    const scale = Math.max(canvas.width / backgroundElement.width, canvas.height / backgroundElement.height);
                    ctx.drawImage(backgroundElement, (canvas.width - backgroundElement.width * scale) / 2, (canvas.height - backgroundElement.height * scale) / 2, backgroundElement.width * scale, backgroundElement.height * scale);
                } else {
                    ctx.fillStyle = "#1f1f1f";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "white";
                    ctx.font = "bold 48px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("Loading...", canvas.width / 2, canvas.height / 2);
                }

                if (isConversational && sceneWithImage?.speakerId) {
                    const speaker = getSpeakerById(sceneWithImage.speakerId);
                    if (speaker) {
                        const stickerEmoji = getStickerEmoji(speaker.sticker as any);
                        const stickerSize = 120;
                        const stickerX = canvas.width / 2;
                        const stickerY = canvas.height - 300;
                        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                        ctx.beginPath();
                        ctx.arc(stickerX, stickerY, stickerSize / 2, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.font = `${stickerSize - 20}px Arial`;
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(stickerEmoji, stickerX, stickerY);
                    }
                }

                const captionY = canvas.height - (isConversational ? 180 : 250);
                const lineSpacing = 60;
                const textFont = "bold 48px Arial";
                const textFill = "white";
                const textStroke = "black";
                const strokeWidth = 8;
                
                ctx.font = textFont;
                ctx.textAlign = "center";
                ctx.textBaseline = "alphabetic";
                const canvasCenterY = canvas.height / 2;

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

                if (subtitlesEnabled && voiceoverText && totalWords > 0) {
                    const currentTimeInScene = f / fps;
                    const wordsToShow = Math.min(totalWords, Math.ceil(currentTimeInScene / wordDuration));
                    const currentSubtitleText = allWords.slice(0, wordsToShow).join(' ');
                    const subtitleLines = getWrappedLines(ctx, currentSubtitleText, canvas.width - 40, textFont);
                    const subtitleBlockHeight = subtitleLines.length * lineSpacing;
                    const startY = canvasCenterY - (subtitleBlockHeight / 2) + (lineSpacing / 2);
                    subtitleLines.forEach((line, index) => {
                        const textY = startY + (index * lineSpacing); 
                        ctx.strokeStyle = textStroke;
                        ctx.lineWidth = strokeWidth;
                        ctx.lineJoin = 'round';
                        ctx.strokeText(line, canvas.width / 2, textY);
                        ctx.fillStyle = textFill;
                        ctx.fillText(line, canvas.width / 2, textY);
                    });
                }

                const frameBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.9));
                const frameBuffer = new Uint8Array(await frameBlob.arrayBuffer());
                await ffmpeg.writeFile(`frame_${String(frameCount).padStart(5, "0")}.jpg`, frameBuffer);
                frameCount++;
            }
        }

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
        const uint8Data = typeof data === "string" ? new Uint8Array([...data].map((c) => c.charCodeAt(0))) : data;
        const regularBuffer = new ArrayBuffer(uint8Data.length);
        const regularView = new Uint8Array(regularBuffer);
        regularView.set(uint8Data);
        const videoBlob = new Blob([regularBuffer], { type: "video/mp4" });
        const videoObjectUrl = URL.createObjectURL(videoBlob);
        setVideoUrl(videoObjectUrl);

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

    return {
        prompt, setPrompt,
        isGenerating,
        generationStep,
        scriptData,
        scenesWithImages,
        videoUrl,
        ffmpegReady,
        isEditing,
        currentPreviewScene, setCurrentPreviewScene,
        editingSceneIndex, setEditingSceneIndex,
        darkMode, toggleDarkMode,
        subtitlesEnabled, setSubtitlesEnabled,
        useTemplate, setUseTemplate,
        selectedTemplate, setSelectedTemplate,
        isConversational, setIsConversational,
        showSpeakerSelectionModal, setShowSpeakerSelectionModal,
        selectedSpeakers,
        randomSlang,
        handleSpeakerSelection,
        generateScript,
        proceedToVideo,
        updateScene,
        regenerateImage,
    };
};
