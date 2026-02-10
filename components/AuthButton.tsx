'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogIn, LogOut, User as UserIcon, X } from 'lucide-react'

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setShowAuth(false)
      setEmail('')
      setPassword('')
    } catch (error: any) {
      alert(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      })

      if (error) throw error

      alert('Check your email to confirm your account!')
      setShowAuth(false)
      setEmail('')
      setPassword('')
    } catch (error: any) {
      alert(error.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (user) {
    return (
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
          <UserIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-gray-300 font-mono">{user.email}</span>
        </div>
        <Button
          onClick={handleSignOut}
          size="sm"
          variant="outline"
          className="border-gray-700 text-gray-400 hover:text-white"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  if (showAuth) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-cyan-500/30 rounded-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            <button onClick={() => setShowAuth(false)} className="text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 font-mono mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black border-gray-700 text-white"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 font-mono mb-2 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black border-gray-700 text-white"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-600 text-center mt-4 font-mono">
            {isSignUp 
              ? 'Sign up to unlock unlimited votes and save your settlements'
              : 'Sign in to access your saved data'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowAuth(true)}
      className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 hover:border-cyan-500/50 transition-colors"
    >
      <LogIn className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-400 font-mono">Sign In</span>
    </button>
  )
}
