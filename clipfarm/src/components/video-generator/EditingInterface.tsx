
"use client";

import { useVideoGenerator } from "@/hooks/useVideoGenerator";
import MobilePreview from "./MobilePreview";
import SceneEditor from "./SceneEditor";

interface EditingInterfaceProps {
    videoGenerator: ReturnType<typeof useVideoGenerator>;
}

export default function EditingInterface({ videoGenerator }: EditingInterfaceProps) {
    const { scriptData, scenesWithImages } = videoGenerator;

    if (!scriptData || scenesWithImages.length === 0) {
        return null;
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8 mt-20">
            <SceneEditor videoGenerator={videoGenerator} />
            <MobilePreview videoGenerator={videoGenerator} />
        </div>
    );
}
