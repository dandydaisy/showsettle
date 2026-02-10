import Link from 'next/link'
import { ArrowLeft, CheckCircle, Loader, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface FeaturePageProps {
  params: {
    id: string
  }
}

async function getFeature(id: string) {
  const { data: feature } = await supabase
    .from('feature_requests')
    .select('*')
    .eq('id', id)
    .single()

  const { data: buildStatus } = await supabase
    .from('features_in_progress')
    .select('*')
    .eq('feature_id', id)
    .single()

  return { feature, buildStatus }
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { feature, buildStatus } = await getFeature(params.id)

  if (!feature) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Feature not found</h1>
          <Link href="/" className="text-cyan-400 hover:text-cyan-300">
            Back to homepage
          </Link>
        </div>
      </main>
    )
  }

  const getStatusIcon = () => {
    if (!buildStatus) return <Clock className="w-8 h-8 text-gray-500" />
    
    switch (buildStatus.status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-400" />
      case 'building':
        return <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
      case 'queued':
        return <Clock className="w-8 h-8 text-yellow-400" />
      default:
        return <Clock className="w-8 h-8 text-gray-500" />
    }
  }

  const getStatusText = () => {
    if (!buildStatus) {
      if (feature.votes >= 10) {
        return { text: 'Ready to Build', color: 'text-green-400' }
      }
      return { text: `${10 - feature.votes} more votes needed`, color: 'text-gray-400' }
    }
    
    switch (buildStatus.status) {
      case 'completed':
        return { text: 'Built & Shipped! 🎉', color: 'text-green-400' }
      case 'building':
        return { text: 'Currently Building...', color: 'text-cyan-400' }
      case 'queued':
        return { text: 'Queued for Build', color: 'text-yellow-400' }
      default:
        return { text: 'Status Unknown', color: 'text-gray-400' }
    }
  }

  const status = getStatusText()

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leaderboard
        </Link>

        <div className="bg-gray-900 border border-cyan-500/30 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-800">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{feature.title}</h1>
                </div>
                <p className="text-gray-400 text-lg mb-4">{feature.description}</p>
                <div className="flex items-center gap-4">
                  <div className="bg-black border border-cyan-500/30 rounded-lg px-4 py-2">
                    <div className="text-xs text-gray-500 font-mono mb-1">VOTES</div>
                    <div className="text-2xl font-bold text-cyan-400 font-mono">
                      {feature.votes.toLocaleString()}
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${status.color}`}>
                    {status.text}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Build Timeline */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Build Status</h2>
            
            <div className="space-y-4">
              {/* Voted */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-semibold text-white">Reached 10+ Votes</div>
                  <div className="text-sm text-gray-500 font-mono">
                    Community approved this feature
                  </div>
                </div>
              </div>

              {/* Queued */}
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  buildStatus?.status ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-gray-800 border border-gray-700'
                }`}>
                  {buildStatus?.status ? (
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className={`font-semibold ${buildStatus?.status ? 'text-white' : 'text-gray-600'}`}>
                    Added to Build Queue
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {buildStatus ? 'Queued for development' : 'Waiting to be queued'}
                  </div>
                </div>
              </div>

              {/* Building */}
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  buildStatus?.status === 'building' || buildStatus?.status === 'completed'
                    ? 'bg-cyan-500/20 border border-cyan-500/50'
                    : 'bg-gray-800 border border-gray-700'
                }`}>
                  {buildStatus?.status === 'building' ? (
                    <Loader className="w-5 h-5 text-cyan-400 animate-spin" />
                  ) : buildStatus?.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className={`font-semibold ${
                    buildStatus?.status === 'building' || buildStatus?.status === 'completed'
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}>
                    In Development
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {buildStatus?.status === 'building'
                      ? 'AI is building this feature now'
                      : buildStatus?.status === 'completed'
                      ? 'Development completed'
                      : 'Not started yet'}
                  </div>
                  {buildStatus?.started_at && (
                    <div className="text-xs text-gray-600 font-mono mt-1">
                      Started: {new Date(buildStatus.started_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Completed */}
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  buildStatus?.status === 'completed'
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-gray-800 border border-gray-700'
                }`}>
                  {buildStatus?.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className={`font-semibold ${
                    buildStatus?.status === 'completed' ? 'text-white' : 'text-gray-600'
                  }`}>
                    Shipped to Production
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {buildStatus?.status === 'completed'
                      ? 'Feature is live on ShowSettle!'
                      : 'Not shipped yet'}
                  </div>
                  {buildStatus?.completed_at && (
                    <div className="text-xs text-gray-600 font-mono mt-1">
                      Completed: {new Date(buildStatus.completed_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {buildStatus?.build_notes && (
              <div className="mt-8 bg-black border border-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-mono text-gray-400 mb-2">BUILD NOTES</h3>
                <p className="text-gray-300">{buildStatus.build_notes}</p>
              </div>
            )}
          </div>
        </div>

        {feature.votes < 10 && (
          <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
            <p className="text-gray-300 mb-4">
              This feature needs <span className="text-cyan-400 font-bold">{10 - feature.votes} more votes</span> to get built!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-colors"
            >
              Vote on the Leaderboard
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
