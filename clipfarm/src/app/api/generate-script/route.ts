import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { prompt, style } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }
        
        console.log("Prompt:", prompt, "Style:", style);
        console.log("Using key prefix:", process.env.GEMINI_API_KEY?.slice(0, 6));

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = `You are a Gen-Z content creator expert. Generate a short-form video script for ${style} style content based on the user prompt. 
        
        Requirements:
        - Create a 15-30 second video script
        - Include scene descriptions for visual elements
        - Add Gen-Z slang and trending language
        - Include caption text for each scene
        - Make it engaging and shareable
        - Format as JSON with scenes array. Do not include any other text, explanations, or markdown fences besides the JSON object itself.
        
        Style Guidelines:
        - Brainrot: Chaotic, fast-paced, meme-heavy, attention-grabbing
        - Aesthetic: Visually pleasing, dreamy, soft colors, trendy
        - Anime: Energetic, dramatic, manga-inspired
        
        Return ONLY the JSON format:
        {
          "title": "Video title",
          "scenes": [
            {
              "duration": 3,
              "voiceover": "What the narrator says",
              "caption": "Text overlay for viewers",
              "visualDescription": "Description for image search",
              "imageQuery": "Keywords for stock image search"
            }
          ],
          "totalDuration": 15
        }`;

        const result = await model.generateContent(`${systemPrompt}\n\nUser Prompt: ${prompt}`);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini raw response:", text);

        // Attempt to parse JSON and handle errors
        let scriptData;
        try {
            // Remove markdown code fences and trim whitespace
            const cleanedText = text.replace(/```json|```/g, '').trim();
            scriptData = JSON.parse(cleanedText);
        } catch (jsonError) {
            console.error('Failed to parse JSON:', jsonError);
            console.error('Raw text that failed to parse:', text);
            // This suggests the model did not return a valid JSON string
            return NextResponse.json(
                { error: 'Invalid response from AI model' },
                { status: 500 }
            );
        }

        // Validate the structure of the parsed data
        if (!scriptData || !Array.isArray(scriptData.scenes)) {
            return NextResponse.json(
                { error: 'AI response is missing key data' },
                { status: 500 }
            );
        }

        return NextResponse.json(scriptData);
    } catch (error: any) {
        // This catch block handles general errors, like API key issues or network failures
        console.error('Error generating script:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate script' },
            { status: 500 }
        );
    }
}