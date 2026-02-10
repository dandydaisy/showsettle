import { HeroSection } from '@/components/HeroSection'
import { ProofSection } from '@/components/ProofSection'
import { VoteSection } from '@/components/VoteSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Intro Section */}
      <HeroSection />
      
      {/* Proof Section */}
      <ProofSection />
      
      {/* Vote Section */}
      <VoteSection />
    </main>
  )
}
