// app/api/stream/status/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playbackId = searchParams.get('playbackId');

    if (!playbackId) {
      return NextResponse.json({ error: 'Missing playbackId' }, { status: 400 });
    }

    // Check stream status from Livepeer
    const response = await fetch(`https://livepeer.studio/api/stream/${playbackId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.LIVEPEER_API_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ isActive: false });
    }

    const streamData = await response.json();
    
    return NextResponse.json({
      isActive: streamData.isActive || false,
      streamData,
    });

  } catch (error) {
    console.error('Stream status check error:', error);
    return NextResponse.json({ isActive: false });
  }
}