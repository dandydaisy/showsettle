'use client'

import { Calculator } from '@/components/Calculator'
import { MultiShowTracker } from '@/components/MultiShowTracker'
import { ArrowDown } from 'lucide-react'

export function ProofSection() {
  const scrollToVote = () => {
    document.getElementById('vote')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section 
      id="proof" 
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative"
    >
      {/* Gradient glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/10 to-black" />
      
      <div className="relative z-10 max-w-4xl mx-auto w-full space-y-12">
        {/* Section header */}
        <div className="text-center space-y-4">
          <div className="inline-block">
            <div className="font-mono text-sm text-green-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>PROOF OF CONCEPT</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            We Know What We're Talking About
          </h2>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Here's the <span className="text-cyan-400 font-semibold">first feature</span> your votes built:
            <br />
            A lightning-fast settlement calculator.
          </p>
        </div>

        {/* Calculator showcase */}
        <div className="space-y-8">
          <div className="relative">
            {/* Neon glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl blur opacity-20"></div>
            
            {/* Calculator component */}
            <div className="relative">
              <Calculator />
            </div>
          </div>

          {/* Multi-Show Tracker */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-green-500 rounded-xl blur opacity-20"></div>
            <div className="relative">
              <MultiShowTracker />
            </div>
          </div>
        </div>

        {/* Stats / Social proof */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto pt-8">
          <div className="text-center p-6 bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg border border-green-500/20">
            <div className="text-3xl font-bold text-green-400">15</div>
            <div className="text-sm text-gray-500 mt-1">Votes to Build</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg border border-cyan-500/20">
            <div className="text-3xl font-bold text-cyan-400">48h</div>
            <div className="text-sm text-gray-500 mt-1">Build Time</div>
          </div>
        </div>

        {/* CTA to voting */}
        <div className="text-center pt-8">
          <button
            onClick={scrollToVote}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105"
          >
            Vote on What's Next
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
