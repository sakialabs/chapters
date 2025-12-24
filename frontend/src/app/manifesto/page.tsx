import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/AnimatedSection"
import { Footer } from "@/components/Footer"

export default function ManifestoPage() {
  const currentYear = new Date().getFullYear()
  
  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <article className="container mx-auto px-4 pt-32 pb-16 max-w-3xl">
        <AnimatedSection>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-8 text-balance">
            The Chapters Manifesto
          </h1>
        </AnimatedSection>

        <div className="prose prose-lg max-w-none font-serif space-y-8 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
          <AnimatedSection delay={100}>
            <p className="text-xl leading-relaxed italic text-muted-foreground">
              A calm, intentional space for people with inner lives, creative curiosity, and impressive taste.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Product Philosophy
            </h2>
            <ul className="space-y-2 list-none text-foreground">
              <li className="flex items-start gap-3 text-foreground">
                <span className="text-primary">•</span>
                <span className="text-foreground">No endless scrolling</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <span className="text-primary">•</span>
                <span className="text-foreground">No dopamine traps</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <span className="text-primary">•</span>
                <span className="text-foreground">No unhinged posting</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <span className="text-primary">•</span>
                <span className="text-foreground">No pressure to perform</span>
              </li>
            </ul>
            <p className="text-xl font-semibold text-foreground mt-4">
              Chapters is slow by design.
            </p>
            <p className="leading-relaxed text-foreground">
              It rewards reflection, depth, and presence.
            </p>
            <p className="leading-relaxed italic text-foreground">
              People don't "post". They add chapters.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Core Metaphor
            </h2>
            <ul className="space-y-2 text-foreground">
              <li className="text-foreground"><strong>Everyone is a Book</strong></li>
              <li className="text-foreground"><strong>Posts are Chapters</strong></li>
              <li className="text-foreground"><strong>Home is a Library</strong> (Bookshelf UI)</li>
            </ul>
            <p className="leading-relaxed mt-4 text-foreground">
              No feed tab. No infinite scroll.
            </p>
            <p className="leading-relaxed text-foreground">
              On mobile, users pick a book from a shelf, turn pages to read chapters, and close the book when they're done.
            </p>
            <p className="text-lg font-semibold text-foreground mt-4">
              Reading replaces scrolling.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Open Pages
            </h2>
            <p className="leading-relaxed text-foreground">
              Instead of posting anytime:
            </p>
            <ul className="space-y-2 list-none ml-4 text-foreground">
              <li className="flex items-start gap-3 text-foreground">
                <span className="text-accent">•</span>
                <span className="text-foreground">Users get <strong>1 Open Page per day</strong></span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <span className="text-accent">•</span>
                <span className="text-foreground">Up to <strong>3 Open Pages can roll over</strong></span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <span className="text-accent">•</span>
                <span className="text-foreground">Publishing a chapter <strong>consumes 1 Open Page</strong></span>
              </li>
            </ul>
            <p className="leading-relaxed mt-4 text-foreground">
              No streaks. No punishment for silence.
            </p>
            <p className="text-lg font-semibold text-foreground">
              Posting becomes intentional.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={500}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Draft-First by Default
            </h2>
            <ul className="space-y-2 list-none text-foreground">
              <li className="flex items-start gap-3 text-foreground">
                <span className="text-secondary">✓</span>
                <span className="text-foreground">All ideas go into drafts first</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <span className="text-secondary">✓</span>
                <span className="text-foreground">Nothing is public by accident</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <span className="text-secondary">✓</span>
                <span className="text-foreground">Users choose when something becomes a chapter</span>
              </li>
            </ul>
            <p className="leading-relaxed mt-4 text-foreground">
              This prevents regret-posting and emotional dumping.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={600}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Study + Note Nook
            </h2>
            <p className="text-lg italic text-muted-foreground mb-4">
              Private. Sacred. Messy.
            </p>
            <p className="leading-relaxed text-foreground">
              This is where creativity actually happens. Draft poems, fragments, lyrics, scripts. 
              Voice notes and scribbles. Highlight any line and attach a private footnote. 
              Promote to Chapter when ready.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={700} className="border-t border-border pt-8 mt-12">
            <p className="text-xl leading-relaxed italic text-muted-foreground text-center">
              Chapters is slow by design. It rewards reflection, depth, and presence.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={800} className="text-center mt-12">
            <Link href="/auth/register">
              <Button size="lg" className="font-sans transition-calm hover:scale-105 hover:shadow-lg">
                Start Your Book
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </article>

      <Footer />
    </div>
  )
}
