import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/AnimatedSection"
import { Footer } from "@/components/Footer"

export default function HomePage() {
  const currentYear = new Date().getFullYear()
  
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 text-balance animate-fade-in">
            A Social Platform Built for Depth, Not Dopamine
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-delay-1">
            Chapters is a calm, expressive space for writers, artists, and creative minds. 
            Share rich multimedia stories. Connect meaningfully. Create without pressure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto transition-calm hover:scale-105 hover:shadow-lg">
                Start Your Book
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto transition-calm hover:scale-105">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <AnimatedSection className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-12 text-center">
            What Makes Chapters Different
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📖"
              title="Intentional Publishing"
              description="One Open Page per day. No pressure to post constantly. Quality over quantity."
            />
            <FeatureCard
              icon="✨"
              title="AI Companion"
              description="Muse assists your creative process without overriding your voice. Prompts, titles, and tone adjustments."
            />
            <FeatureCard
              icon="🤝"
              title="Meaningful Connection"
              description="Between the Lines: intimate conversations with readers who truly resonate with your work."
            />
            <FeatureCard
              icon="📚"
              title="Bookshelf Library"
              description="No infinite scroll. Browse followed Books on a visual bookshelf with finite, intentional navigation."
            />
            <FeatureCard
              icon="🎨"
              title="Rich Expression"
              description="Combine text, images, audio, and video in elegant chapters. Up to 12 blocks per chapter."
            />
            <FeatureCard
              icon="🌙"
              title="Calm by Design"
              description="No trending lists. No streaks. No leaderboards. Just thoughtful reading and writing."
            />
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Ready to Begin?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join a community that values depth, reflection, and authentic expression.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="transition-calm hover:scale-105 hover:shadow-lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="group bg-card rounded-lg p-6 border border-border hover:border-primary hover:shadow-lg transition-all duration-500 hover-lift">
      <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">
        {title}
      </h3>
      <p className="text-muted-foreground transition-colors duration-300">
        {description}
      </p>
    </div>
  )
}
