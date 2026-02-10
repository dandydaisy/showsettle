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

export function ChatWidget() {
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

      if (data.featureRequest) {
        console.log('Feature request detected:', data.featureRequest)
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
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <div>
            <CardTitle className="text-white">Build with AI</CardTitle>
            <CardDescription className="text-blue-100">
              Describe what you need - I'll help you refine it
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
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
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-xl">
          <div className="flex gap-2">
            <Input
              placeholder="I wish it could..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
