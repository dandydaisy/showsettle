'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatWidgetProps {
  onFeatureExtracted?: (title: string, description: string) => void
}

export function ChatWidget({ onFeatureExtracted }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey! 👋 I'm the AI that builds features for ShowSettle. What would make this tool more useful for you?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message || "I'm here to help! Tell me more.",
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      // If feature was logged, notify parent and add to board
      if (data.featureLogged && data.featureTitle) {
        onFeatureExtracted?.(
          data.featureTitle,
          data.featureDescription || 'Feature requested via AI chat'
        )
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: "Hmm, something went wrong. Can you try again?",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="h-full flex flex-col bg-gray-900 border-purple-500/30">
      <CardHeader className="bg-gradient-to-r from-purple-900 to-pink-900 text-white rounded-t-xl border-b border-purple-500/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-300" />
          <div>
            <CardTitle className="text-white font-mono">AI Agent</CardTitle>
            <CardDescription className="text-purple-200 font-mono text-xs">
              Describe what you need → Get +5 votes if approved
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                    : 'bg-gray-900 border border-purple-500/30 shadow-sm text-gray-300'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-2 font-mono ${msg.role === 'user' ? 'text-cyan-200' : 'text-gray-600'}`}>
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-900 border border-purple-500/30 rounded-lg px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-purple-500/30 bg-gray-900 rounded-b-xl">
          <div className="flex gap-2">
            <Input
              placeholder="I wish it could..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 bg-black border-gray-700 text-white placeholder:text-gray-600 focus:border-purple-500"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-[0_0_20px_-5px] hover:shadow-purple-500/50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2 font-mono">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
