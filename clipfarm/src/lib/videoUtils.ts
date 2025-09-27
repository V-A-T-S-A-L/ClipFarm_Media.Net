
import { availableSpeakers } from "@/components/SpeakerSelectionModal";
import { type Speaker } from "@/components/SpeakerSelectionModal";

// Helper function to get speaker by ID
export const getSpeakerById = (speakerId: string) => {
    return availableSpeakers.find(s => s.id === speakerId);
};

export const getTemplateVideo = (template: string): string => {
    const templates = {
        "subway-surfers": "/assets/templates/subway-surfers.mp4",
        "minecraft-parkour": "/assets/templates/minecraft-parkour.mp4",
        "satisfying-clips": "/assets/templates/satisfying-clips.mp4",
        "fidget-spinner": "/assets/templates/fidget-spinner.mp4"
    };
    return templates[template as keyof typeof templates] || templates["subway-surfers"];
};

// Add a function to get the duration from an audio Blob
export const getAudioDuration = async (audioBlob: Blob): Promise<number> => {
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

export const getWrappedLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, font: string): string[] => {
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
export function getStickerEmoji(type: "person1" | "person2" | "robot" | "cat" | "alien" | "wizard"): string {
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

