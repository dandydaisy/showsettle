'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUp, ArrowDown, Sparkles } from 'lucide-react'
import { supabase, type Feature } from '@/lib/supabase'
import { getUserId } from '@/lib/getUserId'
import { ChatWidget } from '@/components/ChatWidget'
import { EmailCaptureDialog } from '@/components/EmailCaptureDialog'
import confetti from 'canvas-confetti'

const MAX_VOTES = 8
const BONUS_VOTES = 5

export function VoteSection() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [userVotes, setUserVotes] = useState<Map<number, number>>(new Map()) // Now stores vote count per feature
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [bonusVotesEarned, setBonusVotesEarned] = useState(0)
  const [highlightedFeatureId, setHighlightedFeatureId] = useState<number | null>(null)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [hasProvidedEmail, setHasProvidedEmail] = useState(false)
  const [totalVotesCast, setTotalVotesCast] = useState(0)
  const featureRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  // Calculate total votes used (sum of all vote values)
  const votesUsed = Array.from(userVotes.values()).reduce((sum, count) => sum + Math.abs(count), 0)
  const totalVotes = MAX_VOTES + bonusVotesEarned
  const votesRemaining = totalVotes - votesUsed

  useEffect(() => {
    const uid = getUserId()
    setUserId(uid)
    loadFeatures(uid)
  }, [])

  const loadFeatures = async (uid: string) => {
    try {
      const { data: featuresData, error: featuresError } = await supabase
        .from('feature_requests')
        .select('*')
        .order('votes', { ascending: false })

      if (featuresError) throw featuresError

      const { data: votesData, error: votesError } = await supabase
        .from('feature_votes')
        .select('feature_id, vote_direction')
        .eq('user_id', uid)

      if (votesError) throw votesError

      setFeatures(featuresData || [])
      
      // Aggregate votes per feature (count total upvotes/downvotes)
      const votesMap = new Map<number, number>()
      votesData?.forEach(v => {
        const current = votesMap.get(v.feature_id) || 0
        votesMap.set(v.feature_id, current + v.vote_direction)
      })
      setUserVotes(votesMap)
    } catch (error) {
      console.error('Error loading features:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (featureId: number, direction: 1 | -1) => {
    if (votesRemaining <= 0) return

    try {
      // Insert the vote record
      const { error: voteError } = await supabase
        .from('feature_votes')
        .insert({
          feature_id: featureId,
          user_id: userId,
          vote_direction: direction,
        })

      if (voteError) throw voteError

      // Update feature vote count
      const feature = features.find(f => f.id === featureId)
      if (feature) {
        const newVotes = feature.votes + direction
        
        const { error: updateError } = await supabase
          .from('feature_requests')
          .update({ votes: newVotes })
          .eq('id', featureId)

        if (updateError) throw updateError

        setFeatures(prev =>
          prev
            .map(f => (f.id === featureId ? { ...f, votes: newVotes } : f))
            .sort((a, b) => b.votes - a.votes)
        )
        
        // Update user's vote count for this feature
        setUserVotes(prev => {
          const current = prev.get(featureId) || 0
          return new Map(prev).set(featureId, current + direction)
        })

        // Track total votes cast
        const newTotalVotes = totalVotesCast + 1
        setTotalVotesCast(newTotalVotes)

        // Show email capture after 2nd vote (if not already provided)
        if (newTotalVotes === 2 && !hasProvidedEmail) {
          setShowEmailCapture(true)
        }
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const handleChatFeature = async (title: string, description: string) => {
    if (votesRemaining <= 0) return

    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .insert({
          title,
          description: description || 'Feature requested via AI chat',
          votes: 1,
        })
        .select()
        .single()

      if (error) throw error

      await supabase
        .from('feature_votes')
        .insert({
          feature_id: data.id,
          user_id: userId,
          vote_direction: 1,
        })

      setFeatures(prev => [data, ...prev].sort((a, b) => b.votes - a.votes))
      setUserVotes(prev => new Map(prev).set(data.id, 1))
      
      // Award bonus votes
      setBonusVotesEarned(prev => prev + BONUS_VOTES)

      // 🎉 CONFETTI + HIGHLIGHT!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#34d399']
      })

      // Highlight the new feature
      setHighlightedFeatureId(data.id)
      
      // Scroll to the new feature
      setTimeout(() => {
        const element = featureRefs.current.get(data.id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)

      // Remove highlight after 5 seconds
      setTimeout(() => {
        setHighlightedFeatureId(null)
      }, 5000)
    } catch (error) {
      console.error('Error adding chat feature:', error)
    }
  }

  if (loading) {
    return (
      <section id="vote" className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 font-mono animate-pulse">Loading features...</div>
      </section>
    )
  }

  return (
    <section 
      id="vote" 
      className="min-h-screen flex flex-col px-6 py-20 relative"
    >
      {/* Email Capture Dialog */}
      {showEmailCapture && (
        <EmailCaptureDialog
          userId={userId}
          onClose={() => setShowEmailCapture(false)}
          onSubmit={() => setHasProvidedEmail(true)}
        />
      )}

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-12">
        {/* Section header */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-block">
            <div className="font-mono text-sm text-cyan-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span>YOUR TURN</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Vote on What We Build Next
          </h2>
        </div>

        {/* How It Works - Step instructions */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-xl p-8">
            <h3 className="font-mono text-sm text-cyan-400 mb-6">HOW IT WORKS</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-bold text-lg">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Like what you see? Upvote it.</h4>
                  <p className="text-gray-400 text-sm">Features with 10+ votes get built by AI.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-red-400 font-bold text-lg">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Don't like the idea? Downvote.</h4>
                  <p className="text-gray-400 text-sm">Help prioritize what actually matters.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 border border-cyan-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-400 font-bold text-lg">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Want to see a new feature added? Chat below.</h4>
                  <p className="text-gray-400 text-sm">
                    If we like the idea, we'll credit you <span className="text-green-400 font-semibold">+{BONUS_VOTES.toLocaleString()} more votes</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vote budget display */}
        <div className="bg-gray-900 border border-cyan-500/30 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-sm text-gray-500 mb-1">YOUR VOTE BUDGET</div>
              <div className="text-white font-semibold">
                Shape the roadmap with upvotes & downvotes
              </div>
              {bonusVotesEarned > 0 && (
                <div className="text-sm text-green-400 mt-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  +{bonusVotesEarned.toLocaleString()} bonus votes earned!
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-cyan-400">
                {votesRemaining.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 font-mono">
                / {totalVotes.toLocaleString()} votes
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Side-by-side layout | Mobile: Stacked */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Features leaderboard */}
          <div>
            <h3 className="font-mono text-sm text-cyan-400 mb-4 text-center lg:text-left">FEATURE LEADERBOARD</h3>
            <div className="space-y-3">
              {features.map((feature) => {
                const userVoteCount = userVotes.get(feature.id) || 0
                const hasUpvoted = userVoteCount > 0
                const hasDownvoted = userVoteCount < 0
                const canVote = votesRemaining > 0
                const isHighlighted = highlightedFeatureId === feature.id

                return (
                  <Card 
                    key={feature.id}
                    ref={(el) => {
                      if (el) featureRefs.current.set(feature.id, el)
                    }}
                    className={`bg-gray-900 transition-all duration-300 ${
                      isHighlighted 
                        ? 'border-green-400 shadow-[0_0_30px_-5px] shadow-green-400/50 animate-pulse' 
                        : 'border-gray-800 hover:border-cyan-500/50'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Vote buttons */}
                        <div className="flex flex-col items-center gap-1 min-w-[50px]">
                          <button
                            onClick={() => handleVote(feature.id, 1)}
                            disabled={votesRemaining <= 0}
                            className={`transition-all ${
                              canVote
                                ? 'text-gray-600 hover:text-green-400 hover:scale-110'
                                : 'text-gray-800 cursor-not-allowed'
                            }`}
                          >
                            <ArrowUp className="w-5 h-5" />
                          </button>

                          <div className={`text-xl font-bold font-mono ${
                            feature.votes >= 10 
                              ? 'text-green-400' 
                              : 'text-white'
                          }`}>
                            {feature.votes.toLocaleString()}
                          </div>

                          <button
                            onClick={() => handleVote(feature.id, -1)}
                            disabled={votesRemaining <= 0}
                            className={`transition-all ${
                              canVote
                                ? 'text-gray-600 hover:text-red-400 hover:scale-110'
                                : 'text-gray-800 cursor-not-allowed'
                            }`}
                          >
                            <ArrowDown className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Feature info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">
                            {feature.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2">
                            {feature.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {feature.votes >= 10 && (
                              <div className="inline-flex items-center gap-2 text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/30">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                BUILDING SOON
                              </div>
                            )}
                            {userVoteCount !== 0 && (
                              <div className={`text-xs font-mono ${
                                userVoteCount > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {userVoteCount > 0 
                                  ? `+${userVoteCount} ${Math.abs(userVoteCount) === 1 ? 'vote' : 'votes'}`
                                  : `${userVoteCount} ${Math.abs(userVoteCount) === 1 ? 'vote' : 'votes'}`
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Right: AI Chat section */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="text-center lg:text-left mb-4">
              <h3 className="font-mono text-sm text-cyan-400 mb-2">SUGGEST A NEW FEATURE</h3>
              <p className="text-gray-400 text-sm">
                Chat with our AI agent. If we add your idea to the leaderboard, you'll get{' '}
                <span className="text-green-400 font-semibold">+{BONUS_VOTES.toLocaleString()} bonus votes</span>.
              </p>
            </div>
            
            <div className="bg-gray-900 border border-cyan-500/30 rounded-xl overflow-hidden">
              <div className="h-[600px]">
                <ChatWidget onFeatureExtracted={handleChatFeature} />
              </div>
            </div>
          </div>
        </div>

        {/* Terminal footer */}
        <div className="text-center pt-12 pb-8">
          <div className="font-mono text-sm text-gray-600">
            <span className="text-gray-500">Powered by your votes</span>
          </div>
        </div>
      </div>
    </section>
  )
}
