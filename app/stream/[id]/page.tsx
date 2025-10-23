'use client'

import { Player } from '@livepeer/react'
import { use } from 'react'

export default function StreamDetailPage({ params }: { params: Promise<{ playbackId: string }> }) {
  const { playbackId } = use(params)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <Player
            title="Live Stream"
            playbackId={playbackId}
            showPipButton
            autoPlay
            muted
          />
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-bold">Live Stream</h1>
          <p className="text-muted-foreground">Currently streaming...</p>
        </div>
      </div>
    </div>
  )
}