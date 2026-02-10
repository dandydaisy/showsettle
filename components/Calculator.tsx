'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calculator as CalcIcon, DollarSign } from 'lucide-react'

export function Calculator() {
  const [gbor, setGbor] = useState('')
  const [guarantee, setGuarantee] = useState('')
  const [expenses, setExpenses] = useState('')
  const [splitPercent, setSplitPercent] = useState('80')
  const [result, setResult] = useState<{
    profit: number
    bandTake: number
    promoterTake: number
  } | null>(null)

  // Format number with commas as user types
  const formatNumberInput = (value: string) => {
    const num = value.replace(/,/g, '')
    if (!num || isNaN(Number(num))) return ''
    return Number(num).toLocaleString()
  }

  // Parse formatted number back to plain number
  const parseNumberInput = (value: string) => {
    return value.replace(/,/g, '')
  }

  const calculate = () => {
    const gborNum = parseFloat(parseNumberInput(gbor)) || 0
    const guaranteeNum = parseFloat(parseNumberInput(guarantee)) || 0
    const expensesNum = parseFloat(parseNumberInput(expenses)) || 0
    const splitNum = parseFloat(splitPercent) || 0

    const profit = gborNum - guaranteeNum - expensesNum
    const bandTake = profit * (splitNum / 100)
    const promoterTake = profit - bandTake

    setResult({ profit, bandTake, promoterTake })
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-cyan-500/30 shadow-[0_0_50px_-12px] shadow-cyan-500/30">
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <CalcIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-white">Settlement Calculator</CardTitle>
              <CardDescription className="text-gray-500 font-mono text-xs">
                Feature #1 · Built by votes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="gbor" className="text-gray-400 font-mono text-sm">
              GBOR (Gross Box Office Receipts)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <Input
                id="gbor"
                type="text"
                placeholder="10,000"
                value={gbor}
                onChange={(e) => setGbor(formatNumberInput(e.target.value))}
                className="bg-black border-gray-700 text-white pl-10 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guarantee" className="text-gray-400 font-mono text-sm">
              Guarantee
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <Input
                id="guarantee"
                type="text"
                placeholder="2,500"
                value={guarantee}
                onChange={(e) => setGuarantee(formatNumberInput(e.target.value))}
                className="bg-black border-gray-700 text-white pl-10 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenses" className="text-gray-400 font-mono text-sm">
              Expenses
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <Input
                id="expenses"
                type="text"
                placeholder="3,000"
                value={expenses}
                onChange={(e) => setExpenses(formatNumberInput(e.target.value))}
                className="bg-black border-gray-700 text-white pl-10 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="split" className="text-gray-400 font-mono text-sm">
              Split % (Band)
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="split"
                type="number"
                placeholder="80"
                value={splitPercent}
                onChange={(e) => setSplitPercent(e.target.value)}
                min="0"
                max="100"
                className="bg-black border-gray-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20"
              />
              <span className="text-2xl font-bold text-gray-700">%</span>
            </div>
          </div>

          <Button 
            onClick={calculate} 
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold transition-all duration-300" 
            size="lg"
          >
            Calculate Settlement
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-green-500/50 shadow-[0_0_50px_-12px] shadow-green-500/40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none"></div>
          <CardHeader className="border-b border-gray-800 relative">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <CardTitle className="text-white font-mono">Results</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Profit */}
              <div className="text-center p-6 bg-black/50 rounded-lg border border-gray-800">
                <div className="text-xs text-gray-500 font-mono mb-2">TOTAL PROFIT</div>
                <div className="text-3xl font-bold text-white font-mono">
                  {formatCurrency(result.profit)}
                </div>
              </div>

              {/* Band Take */}
              <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-lg border border-green-500/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 blur-xl"></div>
                <div className="relative">
                  <div className="text-xs text-green-400 font-mono mb-2">
                    YOUR TAKE ({splitPercent}%)
                  </div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 font-mono">
                    {formatCurrency(result.bandTake)}
                  </div>
                </div>
              </div>

              {/* Promoter Take */}
              <div className="text-center p-6 bg-black/50 rounded-lg border border-gray-800">
                <div className="text-xs text-gray-500 font-mono mb-2">
                  PROMOTER ({100 - parseFloat(splitPercent)}%)
                </div>
                <div className="text-3xl font-bold text-gray-400 font-mono">
                  {formatCurrency(result.promoterTake)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
