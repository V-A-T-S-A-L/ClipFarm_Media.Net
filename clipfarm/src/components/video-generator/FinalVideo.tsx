
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

interface FinalVideoProps {
    videoUrl: string | null;
}

export default function FinalVideo({ videoUrl }: FinalVideoProps) {
    if (!videoUrl) {
        return null;
    }

    return (
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
    );
}
