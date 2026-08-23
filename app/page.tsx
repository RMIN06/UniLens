import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { AboutSection } from '@/components/landing/about-section'
import { UniversitiesSection } from '@/components/landing/universities-section'
import { WhyExperienceSection } from '@/components/landing/why-experience-section'
import { RankingTable } from '@/components/landing/ranking-table'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <>
      {/* Navigation Bar */}
      <Navbar />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <HeroSection />

        {/* About Section - Three Entry Points */}
        <AboutSection />

        {/* Universities Directory */}
        <UniversitiesSection />

        {/* Why Real Experience Wins Section */}
        <WhyExperienceSection />

        {/* Ranking Table Section */}
        <RankingTable />

        {/* Footer */}
        <Footer />
      </main>
    </>
  )
}