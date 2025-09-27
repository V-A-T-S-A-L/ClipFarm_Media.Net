// app/api/tts/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Define the voice mapping on the backend
// Use environment variables for the actual ElevenLabs Voice IDs
const VOICE_MAP: { [key: string]: string } = {
	'default': process.env.ELEVENLABS_DEFAULT_VOICE_ID || '21m00Tcm4TlvDq8ikWAM', // Fallback ID from your original code
	'voice1': 'pqHfZKP75CvOlQylNhV4',
	'voice2': 'ThT5KcBeYPX3keUQqHPh',
	// Add other voices as needed
};

export async function POST(req: NextRequest) {
	try {
		// 1. Extract the requested voice *type* from the request body
		const { text, voice: requestedVoiceType } = await req.json();

		if (!text) {
			return NextResponse.json({ error: 'Text is required' }, { status: 400 });
		}

		// 2. Map the voice type to the actual ElevenLabs Voice ID
		const elevenLabsVoiceId = VOICE_MAP[requestedVoiceType] || VOICE_MAP['default'];

		// 3. Use the mapped ID in the API call URL
		const response = await fetch(
			`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}?optimize_streaming_latency=0`,
			{
				method: 'POST',
				// ... (rest of the code)
				headers: {
					'xi-api-key': process.env.ELEVENLABS_API_KEY!,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text,
					voice_settings: { stability: 0.7, similarity_boost: 0.7 },
				}),
			}
		);

		if (!response.ok) {
			const errMsg = await response.text();
			console.error('ElevenLabs error:', errMsg);
			return NextResponse.json({ error: errMsg }, { status: 500 });
		}


		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		return new NextResponse(buffer, {
			headers: {
				'Content-Type': 'audio/mpeg',
				'Content-Disposition': 'attachment; filename="voiceover.mp3"',
			},
			status: 200,
		});
	} catch (error: any) {
		console.error('Error generating audio:', error);
		return NextResponse.json(
			{ error: error.message || 'Failed to generate audio' },
			{ status: 500 }
		);
	}
}