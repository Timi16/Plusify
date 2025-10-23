// app/api/stream/debug/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing stream ID' }, { status: 400 });
    }

    // Try to get stream info from Livepeer
    const response = await fetch(`https://livepeer.studio/api/stream/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.LIVEPEER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Stream not found (${response.status})`,
        isActive: false 
      });
    }

    const streamData = await response.json();
    
    return NextResponse.json({
      isActive: streamData.isActive || false,
      streamData: {
        id: streamData.id,
        playbackId: streamData.playbackId,
        streamKey: streamData.streamKey ? '***hidden***' : null,
        isActive: streamData.isActive,
        lastSeen: streamData.lastSeen,
        createdAt: streamData.createdAt,
      },
    });

  } catch (error) {
    console.error('Stream debug error:', error);
    return NextResponse.json({ 
      error: 'Failed to check stream status',
      isActive: false 
    }, { status: 500 });
  }
}