'use client'

import { useState } from 'react'
import { X, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

interface EmailCaptureDialogProps {
  userId: string
  onClose: () => void
  onSubmit: () => void
}

export function EmailCaptureDialog({ userId, onClose, onSubmit }: EmailCaptureDialogProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return

    setLoading(true)
    try {
      // Store email in Supabase
      const { error } = await supabase
        .from('emails')
        .insert({
          user_id: userId,
          email: email.trim().toLowerCase(),
        })

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        console.error('Error storing email:', error)
      }

      onSubmit()
      onClose()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-cyan-500/30 rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Mail className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Keep Voting!</h2>
            <p className="text-sm text-gray-400 font-mono">Get notified when we build your features</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-3">
              You're on a roll! Drop your email to continue voting and we'll let you know when features go live.
            </p>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-gray-700 text-white focus:border-cyan-500"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            >
              {loading ? 'Saving...' : 'Continue Voting'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              Skip
            </Button>
          </div>

          <p className="text-xs text-gray-600 text-center font-mono">
            We'll only email you about features you voted for. No spam.
          </p>
        </form>
      </div>
    </div>
  )
}
