import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BlogPost() {
  return (
    <main className="min-h-screen bg-black">
      <article className="max-w-3xl mx-auto px-6 py-20">
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-gray-500 font-mono mb-4">
            <time>February 10, 2026</time>
            <span>·</span>
            <span>5 min read</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            How ShowSettle is Changing the Game for Tour Managers
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed">
            Tour managers don't need MasterTour's complexity. They need fast, accurate settlements. Here's how we're building exactly that—with your votes.
          </p>
        </header>

        <div className="prose prose-invert prose-cyan max-w-none">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-xl p-6 mb-8">
            <p className="text-gray-300 font-mono text-sm mb-0">
              <strong className="text-cyan-400">TL;DR:</strong> ShowSettle is built by tour managers, for tour managers. 
              You vote on features, we build them. No bloat, no complexity—just settlements done right.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Problem with Tour Software</h2>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            If you've ever opened MasterTour, you know the feeling. Hundreds of features, dozens of menus, 
            a learning curve steeper than a venue staircase. It's powerful, sure—but most tour managers 
            only use about 10% of it.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            Why? Because <strong className="text-white">most of us just need to settle shows</strong>. 
            Calculate the split, track expenses, get paid. That's it. We don't need route optimization, 
            merch inventory, or 47 different reporting formats.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Enter ShowSettle</h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            ShowSettle started with a simple question: <em className="text-cyan-400">What if we built exactly 
            what tour managers actually need—and nothing else?</em>
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            But here's the twist: we're not guessing what you need. <strong className="text-white">You're 
            literally voting on it</strong>.
          </p>

          <div className="bg-black border border-green-500/30 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold text-green-400 mb-3">How It Works</h3>
            <ol className="space-y-2 text-gray-300 list-decimal list-inside">
              <li>You suggest a feature (or vote on existing ones)</li>
              <li>When a feature hits 10 votes, our AI builds it</li>
              <li>We ship it, usually within 48 hours</li>
              <li>You get what you actually asked for</li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Why This Matters</h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            Traditional software companies spend months building features nobody asked for. Then they 
            charge you a subscription whether you use them or not.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            We're flipping that. <strong className="text-white">ShowSettle only builds what gets votes</strong>. 
            If a feature isn't useful enough to get 10 votes from actual tour managers, it doesn't get built. 
            Simple as that.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">The First Feature: Settlement Calculator</h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            Our first feature was voted in by the community: a fast, accurate settlement calculator. 
            No login required, no setup—just plug in your numbers and go.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            GBOR, guarantee, expenses, split percentage. Four inputs, instant results. That's what you 
            asked for, so that's what we built.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">What's Next?</h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            That's up to you. The leaderboard has features ranging from PDF export to multi-show tracking 
            to expense categorization. Whatever gets the votes, gets built.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            Some tour managers want email receipts. Others want to track per diems. Some just want dark mode. 
            All of these are valid—and all of them are on the board.
          </p>

          <div className="bg-gray-900 border border-cyan-500/30 rounded-xl p-6 my-8">
            <p className="text-gray-300 mb-4">
              <strong className="text-white">The best part?</strong> If you suggest a feature that gets 
              added to the board, you get +5 bonus votes to spend on other features. So your voice gets 
              even louder.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">No Bloat, Ever</h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            Here's our promise: <strong className="text-white">ShowSettle will never become MasterTour</strong>.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            We're not trying to manage your entire tour. We're not tracking truck fuel or booking hotels. 
            We're focused on one thing: <em className="text-cyan-400">settling shows accurately and fast</em>.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            If you need a full tour management suite, MasterTour exists. If you just need to settle shows 
            without learning a PhD-level software package, ShowSettle is for you.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Join the Movement</h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            ShowSettle isn't just software—it's a community-built tool. Tour managers building for tour managers.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            Head to the <Link href="/" className="text-cyan-400 hover:text-cyan-300 underline">leaderboard</Link>, 
            cast your votes, suggest features. If enough people agree with you, we'll build it. Usually in a couple days.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            No feature requests disappearing into a black hole. No "we'll consider it for the roadmap." 
            Just: vote, build, ship.
          </p>

          <div className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 border border-cyan-500/30 rounded-xl p-8 my-12 text-center">
            <p className="text-2xl font-bold text-white mb-4">
              The future of tour settlements is being built right now.
            </p>
            <p className="text-gray-300 mb-6">
              And you get to decide what it looks like.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all duration-300"
            >
              Vote on Features
            </Link>
          </div>

          <hr className="border-gray-800 my-12" />

          <p className="text-gray-500 text-sm italic">
            Questions? Ideas? Complaints? Hit us up in the chat widget on the homepage. Or just vote for 
            "Add a contact page" if enough people want it. 😉
          </p>
        </div>
      </article>
    </main>
  )
}
