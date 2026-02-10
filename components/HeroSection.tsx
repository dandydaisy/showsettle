'use client'

import { ArrowDown } from 'lucide-react'

export function HeroSection() {
  const scrollToProof = () => {
    document.getElementById('proof')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section 
      id="intro" 
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
    >
      {/* Terminal grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Terminal-style prefix */}
        <div className="font-mono text-sm text-green-400 mb-2">
          <span className="opacity-50">~/showsettle</span> <span className="animate-pulse">▊</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
            The First Show Settlement
          </span>
          <br />
          <span className="text-white">
            Built by Your Votes
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Suggest Features
          <br />
          Vote on Them
          <br />
          <span className="text-cyan-400 font-semibold">We Build It</span>
        </p>

        {/* Terminal command block */}
        <div className="bg-[#0d1117] border border-green-500/30 rounded-lg p-6 max-w-2xl mx-auto text-left shadow-[0_0_50px_-12px] shadow-green-500/50">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-xs text-gray-500 font-mono">showsettle.sh</span>
          </div>
          <div className="font-mono text-sm space-y-2">
            <div className="text-gray-500">
              <span className="text-purple-400">$</span> initialize showsettle
            </div>
            <div className="text-green-400 pl-4">
              ✓ Suggested features collected
            </div>
            <div className="text-green-400 pl-4">
              ✓ Votes tallied from tour managers
            </div>
            <div className="text-green-400 pl-4">
              ✓ AI built settlement calculator
            </div>
            <div className="text-cyan-400 pl-4 mt-4">
              → Ready to build the next feature
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-8">
          <button
            onClick={scrollToProof}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold rounded-lg hover:shadow-[0_0_30px_-5px] hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
          >
            See What We Built
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
