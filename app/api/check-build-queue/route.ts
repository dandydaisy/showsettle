import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Get all features with 10+ votes that aren't already in progress
    const { data: features, error: featuresError } = await supabase
      .from('feature_requests')
      .select('id, title, votes')
      .gte('votes', 10)

    if (featuresError) throw featuresError

    if (!features || features.length === 0) {
      return NextResponse.json({ message: 'No features ready to build', queued: 0 })
    }

    // Check which ones are already in the build queue
    const { data: existing, error: existingError } = await supabase
      .from('features_in_progress')
      .select('feature_id')

    if (existingError) throw existingError

    const existingIds = new Set(existing?.map(e => e.feature_id) || [])
    const newFeatures = features.filter(f => !existingIds.has(f.id))

    if (newFeatures.length === 0) {
      return NextResponse.json({ message: 'All features already queued', queued: 0 })
    }

    // Add new features to the queue
    const inserts = newFeatures.map(f => ({
      feature_id: f.id,
      status: 'queued',
      build_notes: `Auto-queued: reached ${f.votes} votes`
    }))

    const { error: insertError } = await supabase
      .from('features_in_progress')
      .insert(inserts)

    if (insertError) throw insertError

    return NextResponse.json({
      message: `Queued ${newFeatures.length} new features for building`,
      queued: newFeatures.length,
      features: newFeatures.map(f => ({ id: f.id, title: f.title, votes: f.votes }))
    })
  } catch (error) {
    console.error('Error checking build queue:', error)
    return NextResponse.json(
      { error: 'Failed to check build queue' },
      { status: 500 }
    )
  }
}
