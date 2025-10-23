"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video, Upload, Loader2, Copy, Check, ExternalLink } from "lucide-react"
import { useAccount } from 'wagmi'

interface GoLiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface StreamInfo {
  streamKey: string
  playbackId: string
  streamId: string
  rtmpIngestUrl: string
}

export function GoLiveDialog({ open, onOpenChange }: GoLiveDialogProps) {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [streamCreated, setStreamCreated] = useState(false)
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail: null as File | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/stream/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          streamerAddress: address,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStreamInfo(data)
        setStreamCreated(true)
      } else {
        alert('Failed to create stream. Please try again.')
      }
    } catch (error) {
      console.error('Error creating stream:', error)
      alert('Error creating stream. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'key' | 'url') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'key') {
        setCopiedKey(true)
        setTimeout(() => setCopiedKey(false), 2000)
      } else {
        setCopiedUrl(true)
        setTimeout(() => setCopiedUrl(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStreamCreated(false)
      setStreamInfo(null)
      setFormData({ title: "", description: "", category: "", thumbnail: null })
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-primary/30">
        {!streamCreated ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-primary neon-glow flex items-center justify-center">
                  <Video className="h-5 w-5 text-white" />
                </div>
                Go Live
              </DialogTitle>
              <DialogDescription>Set up your stream and start broadcasting to your audience.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Stream Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., BTC Price Prediction - Will it hit $70k?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell your audience what this stream is about..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="bg-background/50 resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger id="category" className="bg-background/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="defi">DeFi</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <div className="relative">
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
                      className="bg-background/50"
                    />
                    <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-border/50"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-primary neon-glow hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Stream...
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-4 w-4" />
                      Create Stream
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-primary neon-glow flex items-center justify-center">
                  <Video className="h-5 w-5 text-white" />
                </div>
                Stream Created Successfully!
              </DialogTitle>
              <DialogDescription>
                Copy these credentials to your streaming software (OBS, Streamlabs, etc.)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              {/* Stream Key Section */}
              <div className="p-4 bg-background/50 rounded-lg border border-primary/20 space-y-3">
                <div>
                  <Label className="text-sm font-semibold text-primary">Server URL (RTMP)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 p-3 bg-background/80 rounded text-xs font-mono border border-border">
                      {streamInfo?.rtmpIngestUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(streamInfo?.rtmpIngestUrl || '', 'url')}
                      className="shrink-0"
                    >
                      {copiedUrl ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-primary">Stream Key (Keep Secret!)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 p-3 bg-background/80 rounded text-xs font-mono overflow-hidden text-ellipsis border border-border">
                      {streamInfo?.streamKey}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(streamInfo?.streamKey || '', 'key')}
                      className="shrink-0"
                    >
                      {copiedKey ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* OBS Setup Instructions */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-2">
                <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  OBS Studio Setup
                </h4>
                <ol className="text-xs text-blue-300/80 space-y-1 list-decimal list-inside">
                  <li>Open OBS Studio</li>
                  <li>Go to Settings → Stream</li>
                  <li>Service: Select "Custom"</li>
                  <li>Paste Server URL and Stream Key above</li>
                  <li>Click "Start Streaming" in OBS</li>
                </ol>
              </div>

              {/* Stream Link */}
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Label className="text-sm font-semibold text-green-400 block mb-2">Your Stream Link</Label>
                <a 
                  href={`/stream/${streamInfo?.playbackId}`}
                  target="_blank"
                  className="text-xs text-green-300 hover:text-green-200 flex items-center gap-1 underline"
                >
                  {`${window.location.origin}/stream/${streamInfo?.playbackId}`}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => window.open(`/stream/${streamInfo?.playbackId}`, '_blank')}
                  className="flex-1 bg-gradient-primary neon-glow"
                >
                  View Stream Page
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}