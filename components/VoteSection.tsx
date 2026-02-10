'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUp, ArrowDown, MessageSquare, Sparkles } from 'lucide-react'
import { supabase, type Feature } from '@/lib/supabase'
import { getUserId } from '@/lib/getUserId'
import { ChatWidget } from '@/components/ChatWidget'

const MAX_VOTES = 8
const BONUS_VOTES = 5

export function VoteSection() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [userVotes, setUserVotes] = useState<Map<number, 1 | -1>>(new Map())
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [bonusVotesEarned, setBonusVotesEarned] = useState(0)

  const votesUsed = userVotes.size
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
      
      const votesMap = new Map<number, 1 | -1>()
      votesData?.forEach(v => votesMap.set(v.feature_id, v.vote_direction as 1 | -1))
      setUserVotes(votesMap)
    } catch (error) {
      console.error('Error loading features:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (featureId: number, direction: 1 | -1) => {
    if (userVotes.has(featureId)) return
    if (votesRemaining <= 0) return

    try {
      const { error: voteError } = await supabase
        .from('feature_votes')
        .insert({
          feature_id: featureId,
          user_id: userId,
          vote_direction: direction,
        })

      if (voteError) throw voteError

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
        
        setUserVotes(prev => new Map(prev).set(featureId, direction))
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFeature.trim() || votesRemaining <= 0) return

    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .insert({
          title: newFeature,
          description: 'User-submitted feature request',
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
      setNewFeature('')
      
      // Award bonus votes
      setBonusVotesEarned(prev => prev + BONUS_VOTES)
    } catch (error) {
      console.error('Error submitting feature:', error)
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
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-8">
        {/* Section header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-block">
            <div className="font-mono text-sm text-purple-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              <span>YOUR TURN</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Vote on What We Build Next
          </h2>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Don't like what you see? <span className="text-red-400">Downvote</span> your colleagues.
            <br />
            Chat with our agent to add <span className="text-green-400">your idea</span> to the leaderboard.
          </p>
        </div>

        {/* Vote budget display */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-950 border border-cyan-500/30 rounded-xl p-6 max-w-2xl mx-auto shadow-[0_0_50px_-12px] shadow-cyan-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-sm text-gray-500 mb-1">VOTE BUDGET</div>
              <div className="text-white font-semibold">
                Shape the roadmap with upvotes & downvotes
              </div>
              {bonusVotesEarned > 0 && (
                <div className="text-sm text-green-400 mt-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  +{bonusVotesEarned} bonus votes earned!
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                {votesRemaining}
              </div>
              <div className="text-sm text-gray-500 font-mono">
                / {totalVotes} votes
              </div>
            </div>
          </div>
        </div>

        {/* Quick submit */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900 border-green-500/30 shadow-[0_0_30px_-12px] shadow-green-500/20">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="font-mono text-sm text-green-400">QUICK SUBMIT</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="I wish it could..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-green-500"
                    disabled={votesRemaining <= 0}
                  />
                  <Button 
                    type="submit" 
                    disabled={votesRemaining <= 0 || !newFeature.trim()}
                    className="bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold hover:shadow-[0_0_20px_-5px] hover:shadow-green-500/50"
                  >
                    Submit
                  </Button>
                </div>
                <p className="text-xs text-gray-500 font-mono">
                  Submit & earn <span className="text-green-400">+{BONUS_VOTES} bonus votes</span> if we add it to the board
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {features.map((feature) => {
            const userVote = userVotes.get(feature.id)
            const hasUpvoted = userVote === 1
            const hasDownvoted = userVote === -1
            const canVote = votesRemaining > 0 && !userVote

            return (
              <Card 
                key={feature.id} 
                className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-12px] hover:shadow-cyan-500/30"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Vote buttons */}
                    <div className="flex flex-col items-center gap-2 min-w-[60px]">
                      <button
                        onClick={() => handleVote(feature.id, 1)}
                        disabled={!canVote && !hasUpvoted}
                        className={`transition-all ${
                          hasUpvoted
                            ? 'text-green-400 scale-110'
                            : canVote
                            ? 'text-gray-600 hover:text-green-400 hover:scale-110'
                            : 'text-gray-800 cursor-not-allowed'
                        }`}
                      >
                        <ArrowUp className="w-6 h-6" />
                      </button>

                      <div className={`text-2xl font-bold font-mono ${
                        feature.votes >= 10 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400' 
                          : 'text-white'
                      }`}>
                        {feature.votes}
                      </div>

                      <button
                        onClick={() => handleVote(feature.id, -1)}
                        disabled={!canVote && !hasDownvoted}
                        className={`transition-all ${
                          hasDownvoted
                            ? 'text-red-400 scale-110'
                            : canVote
                            ? 'text-gray-600 hover:text-red-400 hover:scale-110'
                            : 'text-gray-800 cursor-not-allowed'
                        }`}
                      >
                        <ArrowDown className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Feature info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {feature.description}
                      </p>
                      {feature.votes >= 10 && (
                        <div className="inline-flex items-center gap-2 text-xs font-mono text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/30">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          BUILDING SOON
                        </div>
                      )}
                      {userVote && (
                        <div className={`text-xs font-mono mt-2 ${
                          userVote === 1 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {userVote === 1 ? '✓ Upvoted' : '✓ Downvoted'}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* AI Chat toggle */}
        <div className="text-center pt-8">
          <button
            onClick={() => setShowChat(!showChat)}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            {showChat ? 'Close AI Chat' : 'Chat with AI Agent'}
            <Sparkles className="w-5 h-5" />
          </button>
          <p className="text-sm text-gray-500 mt-3 font-mono">
            Describe your idea → AI refines it → Get <span className="text-green-400">+{BONUS_VOTES} bonus votes</span>
          </p>
        </div>

        {/* AI Chat widget */}
        {showChat && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-purple-500/30 rounded-xl overflow-hidden shadow-[0_0_50px_-12px] shadow-purple-500/30">
              <div className="h-[500px]">
                <ChatWidget onFeatureExtracted={handleChatFeature} />
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="max-w-3xl mx-auto pt-12">
          <div className="bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-8">
            <h3 className="font-mono text-sm text-cyan-400 mb-4">HOW IT WORKS</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-mono">01</span>
                <span>Vote for features you want → AI builds when it hits <strong className="text-white">10+ votes</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-mono">02</span>
                <span>Downvote features you don't need → Saves dev time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 font-mono">03</span>
                <span>Submit your own idea → Get <strong className="text-green-400">+{BONUS_VOTES} bonus votes</strong> if we add it</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-400 font-mono">04</span>
                <span>Chat with AI to refine complex features</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Terminal footer */}
        <div className="text-center pt-12 pb-8">
          <div className="font-mono text-sm text-gray-600">
            <span className="text-gray-500">Built by AI</span>
            <span className="text-gray-700 mx-3">·</span>
            <span className="text-gray-500">Powered by your votes</span>
          </div>
        </div>
      </div>
    </section>
  )
}
