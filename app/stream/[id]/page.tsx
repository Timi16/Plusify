"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, Circle, Send, MessageSquare, Lock, ArrowLeft, Trophy, Radio, AlertCircle } from "lucide-react"
import { PredictionCard } from "@/components/prediction-card"
import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Player } from '@livepeer/react'

interface StreamPageProps {
  params: Promise<{ id: string }>
}

export default function StreamDetailPage({ params }: StreamPageProps) {
  const resolvedParams = use(params)
  const playbackId = resolvedParams.id
  
  const [chatMessage, setChatMessage] = useState("")
  const [activeTab, setActiveTab] = useState("predictions")
  const [isLive, setIsLive] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [streamData, setStreamData] = useState<any>(null)

  useEffect(() => {
    const checkStreamStatus = async () => {
      try {
        const response = await fetch(`/api/stream/status?playbackId=${playbackId}`)
        const data = await response.json()
        setIsLive(data.isActive)
        setStreamData(data.streamData)
      } catch (error) {
        console.error('Failed to check stream status:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkStreamStatus()
    
    // Poll every 10 seconds
    const interval = setInterval(checkStreamStatus, 10000)
    return () => clearInterval(interval)
  }, [playbackId])

  const chatMessages = [
    { user: "CryptoFan", message: "LFG! Going all in on YES", time: "2m ago" },
    { user: "BetMaster", message: "Odds looking good for NO", time: "3m ago" },
    { user: "Whale123", message: "Just dropped 5K on this", time: "5m ago" },
    { user: "NewbiePred", message: "How do I place a bet?", time: "7m ago" },
    { user: "CryptoKing", message: "Welcome everyone! Big prediction coming up", time: "10m ago" },
  ]

  const leaderboardData = [
    { rank: 1, user: "WhaleKing", winRate: "78%", earnings: "$12,450", streak: 12 },
    { rank: 2, user: "PredictorPro", winRate: "72%", earnings: "$9,320", streak: 8 },
    { rank: 3, user: "LuckyBet", winRate: "68%", earnings: "$7,890", streak: 6 },
    { rank: 4, user: "CryptoGuru", winRate: "65%", earnings: "$6,540", streak: 5 },
    { rank: 5, user: "BetMaster", winRate: "62%", earnings: "$5,210", streak: 4 },
  ]

  const isSubscribed = true

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Back Button */}
          <Link href="/stream" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Streams
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Livepeer Video Player */}
              <Card className="overflow-hidden border-border/50">
                <div className="relative aspect-video bg-black">
                  {/* Stream Status Overlay */}
                  {!isLive && !isChecking && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-10">
                      <div className="text-center space-y-4 p-8">
                        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            Stream is Offline
                          </h3>
                          <p className="text-muted-foreground max-w-md">
                            The streamer hasn't started broadcasting yet. Check back soon!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Livepeer Player */}
                  <Player
                    title="Live Stream"
                    playbackId={playbackId}
                    showPipButton
                    autoPlay
                    muted
                    controls={{
                      autohide: 3000,
                    }}
                    theme={{
                      borderStyles: {
                        containerBorderStyle: 'hidden',
                      },
                      colors: {
                        accent: '#8b5cf6',
                      },
                    }}
                  />
                  
                  {/* Live Badge Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                      {isLive ? (
                        <Badge className="bg-red-500/90 text-white border-0 pointer-events-auto">
                          <Radio className="h-2 w-2 mr-1 fill-white animate-pulse" />
                          LIVE
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm pointer-events-auto">
                          <Circle className="h-2 w-2 mr-1" />
                          Offline
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm pointer-events-auto">
                        <Users className="h-3 w-3 mr-1" />
                        {isLive ? '2,453' : '0'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stream Info */}
              <Card className="p-6 border-border/50 space-y-6">
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold">
                    {streamData?.name || 'Live Stream'}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      $15,420 pool
                    </div>
                    <Badge variant="secondary">Crypto</Badge>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                      {isLive ? 'Live' : 'Offline'}
                    </div>
                  </div>
                </div>

                <PredictionCard
                  title="Make Your Prediction"
                  yesOdds={1.8}
                  noOdds={2.1}
                  pool={15420}
                />

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-sm font-bold text-white">
                      CK
                    </div>
                    <div>
                      <div className="font-medium text-gradient">CryptoKing</div>
                      <div className="text-sm text-muted-foreground">Creator</div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-primary/30 bg-transparent">
                    Follow
                  </Button>
                </div>
              </Card>

              {/* Tabs */}
              <Card className="border-border/50">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start border-b border-border/50 bg-transparent p-0 rounded-none">
                    <TabsTrigger
                      value="predictions"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Predictions
                    </TabsTrigger>
                    <TabsTrigger
                      value="leaderboard"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary flex items-center gap-2"
                    >
                      <Trophy className="h-4 w-4" />
                      Leaderboard
                      {!isSubscribed && <Lock className="h-3 w-3 text-destructive" />}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="predictions" className="p-6 space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-bold">Recent Predictions</h3>
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/30"
                          >
                            <div>
                              <div className="font-medium">User{i}</div>
                              <div className="text-sm text-muted-foreground">Predicted YES • 2 hours ago</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-primary">+$250</div>
                              <div className="text-sm text-muted-foreground">$500 bet</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="leaderboard" className="p-6">
                    {!isSubscribed ? (
                      <div className="text-center py-12 space-y-4">
                        <Lock className="h-12 w-12 text-destructive mx-auto opacity-50" />
                        <div>
                          <h3 className="font-bold text-lg mb-2">Premium Feature</h3>
                          <p className="text-muted-foreground mb-4">
                            Subscribe to view the stream leaderboard and top predictors
                          </p>
                          <Button className="bg-gradient-primary">Subscribe Now</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="font-bold">Top Predictors This Stream</h3>
                        <div className="space-y-2">
                          {leaderboardData.map((entry) => (
                            <div
                              key={entry.rank}
                              className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/30 hover:border-primary/30 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-white text-sm">
                                  {entry.rank}
                                </div>
                                <div>
                                  <div className="font-medium">{entry.user}</div>
                                  <div className="text-sm text-muted-foreground">{entry.winRate} win rate</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary">{entry.earnings}</div>
                                <div className="text-sm text-muted-foreground">{entry.streak} streak</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Chat Sidebar */}
            <div className="border border-border/50 rounded-lg flex flex-col bg-card/50 h-fit lg:sticky lg:top-24">
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">Live Chat</h3>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4 h-[400px]">
                <div className="space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-sm text-gradient">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Send a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="bg-background/50"
                  />
                  <Button size="icon" className="bg-gradient-primary hover:opacity-90">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}