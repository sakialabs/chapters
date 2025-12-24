import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/AnimatedSection"
import { Footer } from "@/components/Footer"

export default function AboutPage() {
  const currentYear = new Date().getFullYear()
  
  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <article className="container mx-auto px-4 pt-32 pb-16 max-w-3xl">
        <AnimatedSection>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-8 text-balance">
            About Chapters
          </h1>
        </AnimatedSection>

        <div className="prose prose-lg max-w-none font-serif space-y-8 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
          <AnimatedSection delay={100}>
            <p className="text-xl leading-relaxed text-foreground">
              Chapters is a calm, expressive social platform that reimagines how we share creative work online. 
              We're built for writers, artists, and creative minds who want depth over dopamine.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Why We Built This
            </h2>
            <p className="leading-relaxed text-foreground">
              Social media has become exhausting. The pressure to post constantly, the anxiety of metrics, 
              the endless scroll—it's all designed to keep you engaged, not to help you create or connect meaningfully.
            </p>
            <p className="leading-relaxed text-foreground">
              We wanted something different. A place that feels like a library, not a casino. Where your creative 
              work is treated with respect, not fed to an algorithm. Where connections are earned through mutual 
              appreciation, not viral moments.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              How It Works
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Your Book</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Every user has a Book—your profile and collection of published chapters. It's your creative 
                  home on Chapters.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Open Pages</h3>
                <p className="leading-relaxed text-muted-foreground">
                  You receive one Open Page per day (up to 3 stored). Each chapter you publish consumes one 
                  Open Page. This encourages thoughtful, intentional sharing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Study</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Your private creative workspace. Drafts, notes, and footnotes live here until you're ready 
                  to publish. Everything starts private.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Library</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Your bookshelf of followed Books. See new chapters, get personalized Quiet Picks, and browse 
                  with finite, page-based navigation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Muse</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Your AI creative companion. Get writing prompts, title suggestions, and tone adjustments. 
                  Muse assists but never overrides—your voice stays yours.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Between the Lines</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Intimate conversations with readers who truly resonate with your work. Requires mutual follows 
                  and established presence—not for everyone, by design.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              What Makes Us Different
            </h2>
            <ul className="space-y-3 list-none">
              <li className="flex items-start gap-3">
                <span className="text-secondary text-xl">✓</span>
                <span className="leading-relaxed text-foreground">No infinite scrolling—all feeds are bounded and finite</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary text-xl">✓</span>
                <span className="leading-relaxed text-foreground">No trending lists or leaderboards—calm by design</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary text-xl">✓</span>
                <span className="leading-relaxed text-foreground">No streak pressure—create on your own schedule</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary text-xl">✓</span>
                <span className="leading-relaxed text-foreground">Privacy first—everything starts private</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary text-xl">✓</span>
                <span className="leading-relaxed text-foreground">AI that assists, never replaces your voice</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary text-xl">✓</span>
                <span className="leading-relaxed text-foreground">Rich multimedia expression with thoughtful constraints</span>
              </li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={500}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Our Design Philosophy
            </h2>
            <p className="leading-relaxed text-foreground">
              Every color, every interaction, every feature is designed to reduce anxiety and encourage depth. 
              We use warm, muted tones that feel like paper and ink. Our typography prioritizes readability. 
              Our animations are subtle, never demanding attention.
            </p>
            <p className="leading-relaxed text-foreground">
              We believe social media should feel offline—like reading in a quiet library or writing in a 
              cozy café. Not like being in Times Square at midnight.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={600} className="border-t border-border pt-8 mt-12">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Ready to Begin?
            </h2>
            <p className="leading-relaxed text-foreground mb-6">
              Join a community that values depth, reflection, and authentic expression. Start your Book today.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="font-sans transition-calm hover:scale-105 hover:shadow-lg">
                Create Your Account
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </article>

      <Footer />
    </div>
  )
}
