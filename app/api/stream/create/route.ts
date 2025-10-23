import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, streamerAddress } = body;

    // Call Livepeer API to create stream
    const response = await fetch('https://livepeer.studio/api/stream', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LIVEPEER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: title,
        profiles: [
          {
            name: '720p',
            bitrate: 2000000,
            fps: 30,
            width: 1280,
            height: 720,
          },
          {
            name: '480p',
            bitrate: 1000000,
            fps: 30,
            width: 854,
            height: 480,
          },
          {
            name: '360p',
            bitrate: 500000,
            fps: 30,
            width: 640,
            height: 360,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create stream');
    }

    const streamData = await response.json();

    // Here you would save to your database
    // For now, just return the stream data
    return NextResponse.json({
      success: true,
      streamKey: streamData.streamKey,
      playbackId: streamData.playbackId,
      streamId: streamData.id,
      rtmpIngestUrl: 'rtmp://rtmp.livepeer.com/live',
    });

  } catch (error) {
    console.error('Stream creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create stream' },
      { status: 500 }
    );
  }
}