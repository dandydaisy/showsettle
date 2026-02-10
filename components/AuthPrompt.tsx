'use client'

import { LogIn, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AuthPromptProps {
  onClose: () => void
  onSignIn: () => void
}

export function AuthPrompt({ onClose, onSignIn }: AuthPromptProps) {
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
            <LogIn className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Out of Votes!</h2>
            <p className="text-sm text-gray-400 font-mono">Sign in for unlimited voting</p>
          </div>
        </div>

        <p className="text-gray-300 mb-6">
          You've used your 3 guest votes. Create a free account to get unlimited votes and help shape ShowSettle's future!
        </p>

        <div className="space-y-3">
          <Button
            onClick={onSignIn}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign Up for Free
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            Maybe Later
          </Button>
        </div>

        <p className="text-xs text-gray-600 text-center mt-4 font-mono">
          Free forever. No credit card required.
        </p>
      </div>
    </div>
  )
}
