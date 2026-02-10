'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatWidget } from '@/components/ChatWidget'
import { ArrowUp, ArrowDown } from 'lucide-react'

const INITIAL_FEATURES = [
  {
    id: 1,
    title: 'Save settlement history',
    description: 'Track all your past settlements in one place',
    votes: 12,
  },
  {
    id: 2,
    title: 'Export to PDF',
    description: 'Download settlement sheets as PDF documents',
    votes: 8,
  },
  {
    id: 3,
    title: 'Multi-show tour tracking',
    description: 'Manage entire tours with calendar view',
    votes: 15,
  },
  {
    id: 4,
    title: 'Expense categories breakdown',
    description: 'Organize expenses by category (sound, lights, catering, etc.)',
    votes: 6,
  },
  {
    id: 5,
    title: 'Multiple deal structures',
    description: 'Support for 90/10, 85/15, vs vs, and custom splits',
    votes: 10,
  },
]

const MAX_VOTES = 8

export default function FeaturesPage() {
  const [features, setFeatures] = useState(INITIAL_FEATURES)
  const [newFeature, setNewFeature] = useState('')
  const [userVotes, setUserVotes] = useState<Map<number, 1 | -1>>(new Map())

  const votesUsed = userVotes.size
  const votesRemaining = MAX_VOTES - votesUsed

  const handleVote = (id: number, direction: 1 | -1) => {
    // If already voted on this feature, can't change
    if (userVotes.has(id)) return

    // If out of votes, can't vote
    if (votesUsed >= MAX_VOTES) return

    setFeatures(prev =>
      prev
        .map(f => (f.id === id ? { ...f, votes: f.votes + direction } : f))
        .sort((a, b) => b.votes - a.votes)
    )
    
    setUserVotes(prev => new Map(prev).set(id, direction))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFeature.trim()) return

    const newId = Math.max(...features.map(f => f.id)) + 1
    const newFeatureObj = {
      id: newId,
      title: newFeature,
      description: 'User-submitted feature request',
      votes: 1,
    }
    
    setFeatures(prev => [
      ...prev,
      newFeatureObj,
    ].sort((a, b) => b.votes - a.votes))
    
    setUserVotes(prev => new Map(prev).set(newId, 1))
    setNewFeature('')
  }

  const handleChatFeature = (title: string, description: string) => {
    const newId = Math.max(...features.map(f => f.id)) + 1
    const newFeatureObj = {
      id: newId,
      title,
      description: description || 'Feature requested via AI chat',
      votes: 1,
    }
    
    setFeatures(prev => [
      ...prev,
      newFeatureObj,
    ].sort((a, b) => b.votes - a.votes))
    
    setUserVotes(prev => new Map(prev).set(newId, 1))
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Voting */}
          <div>
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                What should we build next?
              </h1>
              <p className="text-slate-600">
                Vote for features or chat with AI to describe what you need
              </p>
            </div>

            {/* Vote Budget */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-900">Your Vote Budget</p>
                  <p className="text-sm text-blue-700">
                    Use upvotes or downvotes to shape priorities
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {votesRemaining}
                  </div>
                  <div className="text-xs text-blue-600">
                    votes left
                  </div>
                </div>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quick Submit</CardTitle>
                <CardDescription>
                  Have a simple idea? Add it here or use the AI chat →
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    placeholder="I need a way to..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                  />
                  <Button type="submit" disabled={votesRemaining === 0}>
                    Submit
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {features.map((feature) => {
                const userVote = userVotes.get(feature.id)
                const hasUpvoted = userVote === 1
                const hasDownvoted = userVote === -1
                const canVote = votesRemaining > 0 && !userVote

                return (
                  <Card key={feature.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center gap-4 p-6">
                      {/* Vote buttons */}
                      <div className="flex flex-col items-center gap-2 min-w-[70px]">
                        <button
                          onClick={() => handleVote(feature.id, 1)}
                          disabled={!canVote && !hasUpvoted}
                          className={`transition-colors disabled:cursor-not-allowed ${
                            hasUpvoted
                              ? 'text-green-600'
                              : canVote
                              ? 'text-slate-400 hover:text-green-600'
                              : 'text-slate-300'
                          }`}
                          title={canVote ? 'Upvote' : hasUpvoted ? 'You upvoted this' : 'Out of votes'}
                        >
                          <ArrowUp className="w-6 h-6" />
                        </button>

                        <span className="text-2xl font-bold text-slate-700">
                          {feature.votes}
                        </span>

                        <button
                          onClick={() => handleVote(feature.id, -1)}
                          disabled={!canVote && !hasDownvoted}
                          className={`transition-colors disabled:cursor-not-allowed ${
                            hasDownvoted
                              ? 'text-red-600'
                              : canVote
                              ? 'text-slate-400 hover:text-red-600'
                              : 'text-slate-300'
                          }`}
                          title={canVote ? 'Downvote' : hasDownvoted ? 'You downvoted this' : 'Out of votes'}
                        >
                          <ArrowDown className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Feature details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                        <p className="text-slate-600 text-sm">{feature.description}</p>
                        {userVote && (
                          <p className="text-xs text-slate-500 mt-2">
                            {userVote === 1 ? '✓ You upvoted this' : '✓ You downvoted this'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="mt-8">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">How voting works</h3>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>• You get <strong>8 votes</strong> to spend (up or down)</li>
                  <li>• Upvote features you want → AI builds them faster</li>
                  <li>• Downvote features you don't need → saves dev time</li>
                  <li>• When a feature hits <strong>10+ votes</strong>, AI builds it within days</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <a href="/">← Back to Calculator</a>
              </Button>
            </div>
          </div>

          {/* Right Column - AI Chat */}
          <div className="lg:sticky lg:top-8 h-[600px]">
            <ChatWidget onFeatureExtracted={handleChatFeature} />
          </div>
        </div>
      </div>
    </main>
  )
}
