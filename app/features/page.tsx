'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatWidget } from '@/components/ChatWidget'
import { ArrowUp } from 'lucide-react'

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

export default function FeaturesPage() {
  const [features, setFeatures] = useState(INITIAL_FEATURES)
  const [newFeature, setNewFeature] = useState('')
  const [voted, setVoted] = useState<Set<number>>(new Set())

  const handleVote = (id: number) => {
    if (voted.has(id)) return
    
    setFeatures(prev =>
      prev
        .map(f => (f.id === id ? { ...f, votes: f.votes + 1 } : f))
        .sort((a, b) => b.votes - a.votes)
    )
    setVoted(prev => new Set(prev).add(id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFeature.trim()) return

    const newId = Math.max(...features.map(f => f.id)) + 1
    setFeatures(prev => [
      ...prev,
      {
        id: newId,
        title: newFeature,
        description: 'User-submitted feature request',
        votes: 1,
      },
    ].sort((a, b) => b.votes - a.votes))
    
    setVoted(prev => new Set(prev).add(newId))
    setNewFeature('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            What should we build next?
          </h1>
          <p className="text-slate-600">
            Vote for features or suggest your own
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Suggest a Feature</CardTitle>
            <CardDescription>
              Can't find what you're looking for? Tell us what you need.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="I need a way to..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
              />
              <Button type="submit">Submit</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {features.map((feature) => (
            <Card key={feature.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-start gap-4 p-6">
                <button
                  onClick={() => handleVote(feature.id)}
                  disabled={voted.has(feature.id)}
                  className={`flex flex-col items-center gap-1 min-w-[60px] ${
                    voted.has(feature.id)
                      ? 'text-green-600'
                      : 'text-slate-400 hover:text-slate-600'
                  } transition-colors`}
                >
                  <ArrowUp className="w-6 h-6" />
                  <span className="text-lg font-bold">{feature.votes}</span>
                  <span className="text-xs">
                    {voted.has(feature.id) ? 'Voted' : 'Vote'}
                  </span>
                </button>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <a href="/">← Back to Calculator</a>
          </Button>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
          <p className="text-blue-800 text-sm">
            When a feature reaches 10 votes, our AI will reach out to voters for details, 
            build it, and ship it within days. You shape the product.
          </p>
        </div>
      </div>

      <ChatWidget />
    </main>
  )
}
