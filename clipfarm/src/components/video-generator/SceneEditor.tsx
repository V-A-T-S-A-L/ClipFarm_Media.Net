
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Eye, Clock, MessageSquare, Search, Edit3 } from "lucide-react";
import { useVideoGenerator } from "@/hooks/useVideoGenerator";
import { getSpeakerById, getStickerEmoji } from "@/lib/videoUtils";

interface SceneEditorProps {
    videoGenerator: ReturnType<typeof useVideoGenerator>;
}

export default function SceneEditor({ videoGenerator }: SceneEditorProps) {
    const {
        scenesWithImages,
        updateScene,
        regenerateImage,
        currentPreviewScene,
        setCurrentPreviewScene,
        isConversational,
        selectedSpeakers,
        useTemplate,
        selectedTemplate
    } = videoGenerator;

    return (
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

                                {useTemplate && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            Using template: <strong>{selectedTemplate.replace('-', ' ')}</strong>
                                        </p>
                                    </div>
                                )}

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
    );
}
