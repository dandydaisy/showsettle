import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const blogPosts = [
  {
    slug: 'changing-the-game-for-tour-managers',
    title: 'How ShowSettle is Changing the Game for Tour Managers',
    date: '2026-02-10',
    excerpt: 'Tour managers don\'t need MasterTour\'s complexity. They need fast, accurate settlements. Here\'s how we\'re building exactly that—with your votes.',
    readTime: '5 min read',
  }
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to ShowSettle
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Blog</h1>
          <p className="text-xl text-gray-400">
            Building the future of tour settlements, one feature at a time.
          </p>
        </div>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_-12px] hover:shadow-cyan-500/30"
            >
              <div className="flex items-center gap-3 text-sm text-gray-500 font-mono mb-3">
                <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-400 leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
