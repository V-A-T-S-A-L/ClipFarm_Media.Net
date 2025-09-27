
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Film, Play, Sparkles } from "lucide-react";
import { useVideoGenerator } from "@/hooks/useVideoGenerator";
import SpeakerSelectionModal from "@/components/SpeakerSelectionModal";
import { getSpeakerById } from "@/lib/videoUtils";

interface GeneratorFormProps {
    videoGenerator: ReturnType<typeof useVideoGenerator>;
}

export default function GeneratorForm({ videoGenerator }: GeneratorFormProps) {
    const {
        prompt, setPrompt,
        isGenerating,
        generationStep,
        ffmpegReady,
        isEditing,
        useTemplate, setUseTemplate,
        selectedTemplate, setSelectedTemplate,
        isConversational, setIsConversational,
        showSpeakerSelectionModal, setShowSpeakerSelectionModal,
        selectedSpeakers,
        handleSpeakerSelection,
        generateScript,
        proceedToVideo,
    } = videoGenerator;

    return (
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
                                        videoGenerator.selectedSpeakers.length = 0;
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

                <SpeakerSelectionModal
                    isOpen={showSpeakerSelectionModal}
                    onClose={() => setShowSpeakerSelectionModal(false)}
                    onConfirm={handleSpeakerSelection}
                />
            </CardContent>
        </Card>
    );
}
