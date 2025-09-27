"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Speaker {
  id: string;
  name: string;
  image: string;
  voice: string;
  sticker: string;
}

export const availableSpeakers: Speaker[] = [
  { id: "speaker1", name: "Cyber Nigga", image: "/assets/images/brand-logos/youtube.svg", voice: "pqHfZKP75CvOlQylNhV4", sticker: "robot" },
  { id: "speaker2", name: "Street Brawler", image: "/assets/images/brand-logos/tiktok.svg", voice: "ThT5KcBeYPX3keUQqHPh", sticker: "person2" },
  { id: "speaker3", name: "Rogue Ass", image: "/assets/images/brand-logos/instagram.svg", voice: "echo", sticker: "wizard" },
  { id: "speaker4", name: "Heavy Hitler", image: "/assets/images/brand-logos/reddit.svg", voice: "shimmer", sticker: "alien" },
];

interface SpeakerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedSpeakers: string[]) => void;
}

const SpeakerSelectionModal = ({ isOpen, onClose, onConfirm }: SpeakerSelectionModalProps) => {
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);

  const handleSelectSpeaker = (speakerId: string) => {
    setSelectedSpeakers((prev) => {
      if (prev.includes(speakerId)) {
        return prev.filter((id) => id !== speakerId);
      }
      if (prev.length < 2) {
        return [...prev, speakerId];
      }
      // If 2 are already selected, replace the last one
      return [...prev.slice(0, 1), speakerId];
    });
  };

  const handleConfirm = () => {
    if (selectedSpeakers.length === 2) {
      onConfirm(selectedSpeakers);
      onClose();
    }
  };

  const getSpeakerById = (id: string) => availableSpeakers.find(s => s.id === id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-zinc-900 border border-zinc-700 shadow-lg text-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-white">Select Two Speakers</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center gap-8 my-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-zinc-600 bg-zinc-800/50 flex items-center justify-center overflow-hidden">
              {selectedSpeakers[0] ? (
                <img src={getSpeakerById(selectedSpeakers[0])?.image} alt={getSpeakerById(selectedSpeakers[0])?.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-400 text-lg">Speaker 1</span>
              )}
            </div>
            <span className="text-sm text-zinc-300">First Speaker</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-zinc-600 bg-zinc-800/50 flex items-center justify-center overflow-hidden">
              {selectedSpeakers[1] ? (
                <img src={getSpeakerById(selectedSpeakers[1])?.image} alt={getSpeakerById(selectedSpeakers[1])?.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-400 text-lg">Speaker 2</span>
              )}
            </div>
            <span className="text-sm text-zinc-300">Second Speaker</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 py-4">
          {availableSpeakers.map((speaker) => {
            const selectionIndex = selectedSpeakers.indexOf(speaker.id);
            const isSelected = selectionIndex !== -1;

            return (
              <div key={speaker.id} onClick={() => handleSelectSpeaker(speaker.id)} className="flex flex-col items-center cursor-pointer group">
                <div className="relative">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className={cn(
                      "w-24 h-24 object-cover rounded-full border-2 transition-all duration-200",
                      {
                        "border-purple-500": isSelected,
                        "border-zinc-700 group-hover:border-zinc-500": !isSelected,
                      }
                    )}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                      <span className="text-white text-4xl font-semibold">{selectionIndex + 1}</span>
                    </div>
                  )}
                </div>
                <p className="text-center text-white/90 p-2 text-base mt-2">{speaker.name}</p>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button onClick={handleConfirm} disabled={selectedSpeakers.length !== 2} className="w-full bg-purple-600 text-white text-lg font-semibold hover:bg-purple-700 disabled:bg-zinc-700 disabled:text-zinc-400">
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpeakerSelectionModal;
