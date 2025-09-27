
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ChevronLeft, ChevronRight, Heart, MessageCircle, Send, Bookmark, Battery, Wifi } from "lucide-react";
import { useVideoGenerator } from "@/hooks/useVideoGenerator";
import { getSpeakerById, getStickerEmoji } from "@/lib/videoUtils";

interface MobilePreviewProps {
    videoGenerator: ReturnType<typeof useVideoGenerator>;
}

export default function MobilePreview({ videoGenerator }: MobilePreviewProps) {
    const {
        scenesWithImages,
        currentPreviewScene,
        setCurrentPreviewScene,
        useTemplate,
        selectedTemplate,
        isConversational,
    } = videoGenerator;

    return (
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
                    <div className="relative">
                        <div className="w-64 h-[550px] bg-gray-900 border-4 border-black rounded-[2rem] p-0.5 shadow-2xl relative overflow-hidden">
                            <div className="w-full h-full bg-black rounded-[1.8rem] overflow-hidden relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-20 shadow-md">
                                    <div className="flex items-center justify-center h-full space-x-2">
                                        <div className="w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
                                        <div className="w-8 h-1 bg-gray-700 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="absolute top-0 left-0 right-0 h-8 z-10 flex items-center justify-between px-3 pt-1">
                                    <div className="text-white text-sm font-semibold">9:41</div>
                                    <div className="flex items-center space-x-1 text-white text-xs">
                                        <Wifi className="w-4 h-4" />
                                        <div className="ml-2">
                                            <Battery className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-full relative pt-8">
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

                                    <div className="absolute right-3 bottom-20 flex flex-col items-center space-y-5 text-white">
                                        <button><Heart className="w-7 h-7" /></button>
                                        <button><MessageCircle className="w-7 h-7" /></button>
                                        <button><Send className="w-7 h-7" /></button>
                                        <button><Bookmark className="w-7 h-7" /></button>
                                    </div>

                                    {scenesWithImages[currentPreviewScene]?.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3">
                                            <p className="text-white text-sm text-center font-medium leading-tight">
                                                {scenesWithImages[currentPreviewScene].caption}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-white rounded-full z-30"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
