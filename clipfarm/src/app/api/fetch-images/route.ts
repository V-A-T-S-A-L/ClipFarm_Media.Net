// app/api/fetch-images/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { imageQueries } = await req.json();
        const images: any[] = [];
        
        // Add a check for the API key
        const pexelsApiKey = process.env.PEXELS_API_KEY;
        if (!pexelsApiKey) {
            console.error('Pexels API key is not set.');
            return NextResponse.json(
                { error: 'Server configuration error: Pexels API key is missing.' },
                { status: 500 }
            );
        }

        for (const query of imageQueries) {
            const response = await fetch(
                `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`,
                {
                    headers: {
                        Authorization: pexelsApiKey,
                    },
                }
            );

            // Check for specific API errors
            if (response.status === 401) {
                console.error('Pexels API key is invalid or unauthorized.');
                throw new Error('Pexels API authentication failed. Check your API key.');
            }
            if (!response.ok) {
                console.error(`Pexels API error: ${response.status} ${response.statusText}`);
                throw new Error(`Failed to fetch image for query: ${query}`);
            }

            const data = await response.json();

            if (data.photos && data.photos.length > 0) {
                const photo = data.photos[0];
                images.push({
                    query,
                    url: photo.src.large,
                    downloadUrl: photo.src.original,
                    photographer: photo.photographer,
                    photographerUrl: photo.photographer_url,
                });
            } else {
                // Fallback placeholder if no image found
                images.push({
                    query,
                    url: 'https://via.placeholder.com/1080x1920/000000/FFFFFF?text=No+Image',
                    downloadUrl: 'https://via.placeholder.com/1080x1920/000000/FFFFFF?text=No+Image',
                    photographer: 'Placeholder',
                    photographerUrl: '#',
                });
            }
        }

        return NextResponse.json({ images });
    } catch (error: any) {
        console.error('Error fetching images:', error.message);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch images' },
            { status: 500 }
        );
    }
}