'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, Loader2, Radio } from 'lucide-react'

export default function StreamDebugTool() {
  const [playbackId, setPlaybackId] = useState('')
  const [streamId, setStreamId] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<any>(null)

  const checkStreamStatus = async () => {
    if (!playbackId && !streamId) return

    setChecking(true)
    setResult(null)

    try {
      const response = await fetch(`/api/stream/debug?id=${playbackId || streamId}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to check stream status' })
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Stream Debug Tool
          </CardTitle>
          <CardDescription>
            Check if your stream is active and diagnose issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Playback ID or Stream ID
              </label>
              <Input
                placeholder="e.g., 25d9ctsgdwtzcftd"
                value={playbackId || streamId}
                onChange={(e) => {
                  setPlaybackId(e.target.value)
                  setStreamId(e.target.value)
                }}
                className="font-mono"
              />
            </div>

            <Button 
              onClick={checkStreamStatus} 
              disabled={checking || (!playbackId && !streamId)}
              className="w-full"
            >
              {checking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Stream Status'
              )}
            </Button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Results</h3>

              {result.error ? (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Error</p>
                    <p className="text-sm text-destructive/80">{result.error}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Stream Active Status */}
                  <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                    result.isActive 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}>
                    {result.isActive ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium ${result.isActive ? 'text-green-500' : 'text-yellow-500'}`}>
                        {result.isActive ? '🔴 Stream is LIVE' : '⚫ Stream is Offline'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.isActive 
                          ? 'Your stream is broadcasting successfully!' 
                          : 'No active stream detected. Make sure OBS is streaming.'}
                      </p>
                    </div>
                  </div>

                  {/* Stream Details */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Stream Details</h4>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stream ID:</span>
                        <span>{result.streamData?.id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Playback ID:</span>
                        <span>{result.streamData?.playbackId || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{result.streamData?.createdAt ? new Date(result.streamData.createdAt).toLocaleString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Seen:</span>
                        <span>{result.streamData?.lastSeen ? new Date(result.streamData.lastSeen).toLocaleString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Troubleshooting Tips */}
                  {!result.isActive && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-400 mb-2">🔧 Troubleshooting Tips</h4>
                      <ul className="text-sm text-blue-300/80 space-y-1 list-disc list-inside">
                        <li>Verify OBS is showing "Streaming" (green indicator)</li>
                        <li>Check OBS logs for connection errors</li>
                        <li>Confirm Server URL: rtmp://rtmp.livepeer.com/live</li>
                        <li>Wait 30-60 seconds after starting OBS</li>
                        <li>Check your internet upload speed (need 3+ Mbps)</li>
                        <li>Try restarting OBS and stream again</li>
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* OBS Quick Reference */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 text-sm">
            <h4 className="font-semibold mb-2">📋 Quick OBS Setup</h4>
            <ol className="space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Settings → Stream → Service: "Custom"</li>
              <li>Server: rtmp://rtmp.livepeer.com/live</li>
              <li>Paste your Stream Key</li>
              <li>Click "Start Streaming"</li>
              <li>Wait 30-60 seconds then check status</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}