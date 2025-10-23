'use client'

import { Player } from '@livepeer/react'
import { use, useEffect, useState } from 'react'
import { AlertCircle, Radio } from 'lucide-react'

interface StreamDetailPageProps {
  params: Promise<{ id: string }>
}

export default function StreamDetailPage({ params }: StreamDetailPageProps) {
  const resolvedParams = use(params)
  const playbackId = resolvedParams.id
  const [isLive, setIsLive] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkStreamStatus = async () => {
      try {
        // Check if stream is active via Livepeer API
        const response = await fetch(`/api/stream/status?playbackId=${playbackId}`)
        const data = await response.json()
        setIsLive(data.isActive)
      } catch (error) {
        console.error('Failed to check stream status:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkStreamStatus()
    
    // Poll every 10 seconds to check if stream went live
    const interval = setInterval(checkStreamStatus, 10000)
    return () => clearInterval(interval)
  }, [playbackId])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Stream Status Badge */}
        <div className="mb-4 flex items-center gap-2">
          {isLive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-500">LIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-full">
              <div className="h-2 w-2 bg-muted-foreground rounded-full" />
              <span className="text-sm text-muted-foreground">Offline</span>
            </div>
          )}
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
          {!isLive && !isChecking && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
              <div className="text-center space-y-4 p-8">
                <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Stream is Offline
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    The streamer hasn't started broadcasting yet. Check back soon or wait for the stream to go live.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <Player
            title="Live Stream"
            playbackId={playbackId}
            showPipButton
            autoPlay
            muted
          />
        </div>

        {/* Stream Info */}
        <div className="mt-6 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Live Stream</h1>
            <p className="text-muted-foreground">
              {isLive ? 'Currently streaming...' : 'Waiting for stream to start...'}
            </p>
          </div>

          {/* Stream Details Card */}
          <div className="p-4 bg-card border border-border rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Playback ID:</span>
              <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                {playbackId}
              </code>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className={isLive ? 'text-green-500 font-semibold' : 'text-muted-foreground'}>
                {isChecking ? 'Checking...' : isLive ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}