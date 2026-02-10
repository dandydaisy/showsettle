'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, TrendingUp } from 'lucide-react'

interface Show {
  id: string
  venue: string
  date: string
  profit: number
}

export function MultiShowTracker() {
  const [shows, setShows] = useState<Show[]>([])
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState('')
  const [profit, setProfit] = useState('')

  const addShow = () => {
    if (!venue.trim() || !date || !profit) return

    const newShow: Show = {
      id: Date.now().toString(),
      venue: venue.trim(),
      date,
      profit: parseFloat(profit.replace(/,/g, '')),
    }

    setShows([...shows, newShow])
    setVenue('')
    setDate('')
    setProfit('')
  }

  const removeShow = (id: string) => {
    setShows(shows.filter(s => s.id !== id))
  }

  const totalProfit = shows.reduce((sum, show) => sum + show.profit, 0)
  const avgProfit = shows.length > 0 ? totalProfit / shows.length : 0

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  const formatNumberInput = (value: string) => {
    const num = value.replace(/,/g, '')
    if (!num || isNaN(Number(num))) return ''
    return Number(num).toLocaleString()
  }

  return (
    <Card className="bg-gray-900 border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <CardTitle className="text-white">Multi-Show Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Show Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Venue name"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="bg-black border-gray-700 text-white"
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-black border-gray-700 text-white"
          />
          <Input
            placeholder="Profit"
            value={profit}
            onChange={(e) => setProfit(formatNumberInput(e.target.value))}
            className="bg-black border-gray-700 text-white"
          />
          <Button
            onClick={addShow}
            className="bg-cyan-500 hover:bg-cyan-600 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Show
          </Button>
        </div>

        {/* Shows List */}
        {shows.length > 0 && (
          <div className="space-y-3">
            {shows.map((show) => (
              <div
                key={show.id}
                className="flex items-center justify-between bg-black border border-gray-800 rounded-lg p-4"
              >
                <div className="flex-1">
                  <div className="font-semibold text-white">{show.venue}</div>
                  <div className="text-sm text-gray-500 font-mono">
                    {new Date(show.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-lg font-bold font-mono ${
                    show.profit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(show.profit)}
                  </div>
                  <button
                    onClick={() => removeShow(show.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {shows.length > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="text-xs text-gray-500 font-mono mb-1">TOTAL PROFIT</div>
              <div className="text-2xl font-bold text-green-400 font-mono">
                {formatCurrency(totalProfit)}
              </div>
            </div>
            <div className="text-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <div className="text-xs text-gray-500 font-mono mb-1">AVG PER SHOW</div>
              <div className="text-2xl font-bold text-cyan-400 font-mono">
                {formatCurrency(avgProfit)}
              </div>
            </div>
          </div>
        )}

        {shows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-mono text-sm">No shows tracked yet. Add your first show above!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
