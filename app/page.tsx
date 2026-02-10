import { HeroSection } from '@/components/HeroSection'
import { ProofSection } from '@/components/ProofSection'
import { VoteSection } from '@/components/VoteSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Vote Section - First! */}
      <VoteSection />
      
      {/* Proof Section */}
      <ProofSection />
      
      {/* Intro Section - moved to bottom */}
      <HeroSection />
    </main>
  )
}
