// app/api/tts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const { text, voice = '21m00Tcm4TlvDq8ikWAM' } = await req.json();

		if (!text) {
			return NextResponse.json({ error: 'Text is required' }, { status: 400 });
		}

		const response = await fetch(
			`https://api.elevenlabs.io/v1/text-to-speech/${voice}?optimize_streaming_latency=0`,
			{
				method: 'POST',
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
