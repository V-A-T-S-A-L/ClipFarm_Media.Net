"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpeakerStickerProps {
  speaker: {
    id: string;
    name: string;
    image: string;
  };
  onSelect: (speakerId: string) => void;
  isSelected: boolean;
  selectionOrder: number | null;
}

const SpeakerSticker = ({ speaker, onSelect, isSelected, selectionOrder }: SpeakerStickerProps) => {
  return (
    <motion.div
      className={cn(
        "relative rounded-full w-32 h-32 bg-gray-200 dark:bg-gray-700 cursor-pointer overflow-hidden border-4 border-transparent",
        { "border-purple-500": isSelected }
      )}
      onClick={() => onSelect(speaker.id)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" />
      {isSelected && selectionOrder && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-white text-4xl font-bold">{selectionOrder}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SpeakerSticker;
