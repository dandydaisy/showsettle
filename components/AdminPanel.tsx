'use client'

import { useState } from 'react'
import { Lock, X, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase, type Feature } from '@/lib/supabase'

interface AdminPanelProps {
  features: Feature[]
  onUpdate: () => void
}

export function AdminPanel({ features, onUpdate }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editVotes, setEditVotes] = useState('')

  const handleLogin = () => {
    if (password === 'password') {
      setIsAuthenticated(true)
      setPassword('')
    } else {
      alert('Wrong password!')
      setPassword('')
    }
  }

  const handleDelete = async (featureId: number) => {
    if (!confirm('Delete this feature? This cannot be undone.')) return

    try {
      // Delete votes first
      await supabase.from('feature_votes').delete().eq('feature_id', featureId)
      
      // Delete feature
      const { error } = await supabase.from('feature_requests').delete().eq('id', featureId)
      
      if (error) throw error
      
      onUpdate()
    } catch (error) {
      console.error('Error deleting feature:', error)
      alert('Failed to delete feature')
    }
  }

  const handleUpdateVotes = async (featureId: number) => {
    const newVotes = parseInt(editVotes)
    if (isNaN(newVotes)) return

    try {
      const { error } = await supabase
        .from('feature_requests')
        .update({ votes: newVotes })
        .eq('id', featureId)
      
      if (error) throw error
      
      setEditingId(null)
      setEditVotes('')
      onUpdate()
    } catch (error) {
      console.error('Error updating votes:', error)
      alert('Failed to update votes')
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-2 bg-gray-900 border border-gray-700 rounded-lg hover:border-cyan-500/50 transition-colors"
        title="Admin"
      >
        <Lock className="w-4 h-4 text-gray-500" />
      </button>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Login
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleLogin() }} className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border-gray-700 text-white"
              autoFocus
            />
            <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-black">
              Login
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-cyan-500/30 rounded-xl max-w-4xl w-full p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lock className="w-6 h-6 text-cyan-400" />
            Admin Panel
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3 max-h-[70vh] overflow-y-auto">
          {features.map((feature) => (
            <div key={feature.id} className="bg-black border border-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{feature.description}</p>
                  
                  {editingId === feature.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editVotes}
                        onChange={(e) => setEditVotes(e.target.value)}
                        placeholder={feature.votes.toString()}
                        className="bg-gray-900 border-gray-700 text-white w-24"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateVotes(feature.id)}
                        className="bg-green-500 hover:bg-green-600 text-black"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setEditingId(null); setEditVotes('') }}
                        className="border-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-cyan-400 font-mono">
                        {feature.votes.toLocaleString()} votes
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(feature.id)
                          setEditVotes(feature.votes.toString())
                        }}
                        className="text-gray-500 hover:text-cyan-400"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(feature.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title="Delete feature"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <Button
            onClick={() => {
              setIsAuthenticated(false)
              setIsOpen(false)
            }}
            variant="outline"
            className="border-gray-700 text-gray-400"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
