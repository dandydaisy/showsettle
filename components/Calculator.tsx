'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

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

  const calculate = () => {
    const gborNum = parseFloat(gbor) || 0
    const guaranteeNum = parseFloat(guarantee) || 0
    const expensesNum = parseFloat(expenses) || 0
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
      <Card>
        <CardHeader>
          <CardTitle>Settlement Calculator</CardTitle>
          <CardDescription>
            Enter your show details to calculate the split
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gbor">GBOR (Gross Box Office Receipts)</Label>
            <Input
              id="gbor"
              type="number"
              placeholder="10000"
              value={gbor}
              onChange={(e) => setGbor(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guarantee">Guarantee</Label>
            <Input
              id="guarantee"
              type="number"
              placeholder="2500"
              value={guarantee}
              onChange={(e) => setGuarantee(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenses">Expenses</Label>
            <Input
              id="expenses"
              type="number"
              placeholder="3000"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="split">Split % (Band)</Label>
            <Input
              id="split"
              type="number"
              placeholder="80"
              value={splitPercent}
              onChange={(e) => setSplitPercent(e.target.value)}
              min="0"
              max="100"
            />
          </div>

          <Button onClick={calculate} className="w-full" size="lg">
            Calculate Settlement
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle>Settlement Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Profit</div>
                <div className="text-2xl font-bold">{formatCurrency(result.profit)}</div>
              </div>

              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  Your Take ({splitPercent}%)
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(result.bandTake)}
                </div>
              </div>

              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  Promoter Take ({100 - parseFloat(splitPercent)}%)
                </div>
                <div className="text-2xl font-bold text-gray-700">
                  {formatCurrency(result.promoterTake)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle>What should we build next?</CardTitle>
            <CardDescription>
              Help us prioritize new features by voting or suggesting your own
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline" size="lg">
              <a href="/features">Vote on Features →</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
