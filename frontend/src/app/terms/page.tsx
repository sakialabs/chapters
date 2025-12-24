import { AnimatedSection } from "@/components/AnimatedSection"
import { Footer } from "@/components/Footer"

export default function TermsPage() {
  const lastUpdated = "December 23, 2025"

  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 pt-32 pb-16 max-w-3xl">
        <AnimatedSection>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>
        </AnimatedSection>

        <div className="prose prose-lg max-w-none space-y-8 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
          <AnimatedSection delay={100}>
            <p className="text-lg leading-relaxed text-foreground">
              Welcome to Chapters. By using our platform, you agree to these terms. We've kept them straightforward and human-readable.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Your Account</h2>
            <ul className="space-y-2 text-foreground">
              <li>You must be at least 13 years old to use Chapters</li>
              <li>You're responsible for keeping your account secure</li>
              <li>One account per person—no fake or impersonation accounts</li>
              <li>You can delete your account anytime</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Your Content</h2>
            <p className="text-foreground">
              You own everything you create on Chapters. Period.
            </p>
            <ul className="space-y-2 text-foreground">
              <li><strong>Ownership:</strong> Your chapters, drafts, and notes belong to you</li>
              <li><strong>License:</strong> You grant us permission to display your published content on the platform</li>
              <li><strong>Privacy:</strong> Your drafts and notes remain private unless you publish them</li>
              <li><strong>Responsibility:</strong> You're responsible for what you post</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Community Guidelines</h2>
            <p className="text-foreground">Chapters is built for depth and respect. We don't allow:</p>
            <ul className="space-y-2 text-foreground">
              <li>Harassment, hate speech, or bullying</li>
              <li>Spam, scams, or misleading content</li>
              <li>Illegal content or activity</li>
              <li>Content that violates others' intellectual property</li>
              <li>Sexually explicit content involving minors</li>
            </ul>
            <p className="text-foreground mt-4">
              Violations may result in content removal or account suspension.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={500}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Open Pages & Features</h2>
            <ul className="space-y-2 text-foreground">
              <li>Open Pages are granted daily (1 per day, max 3 stored)</li>
              <li>We may adjust feature limits to maintain platform quality</li>
              <li>AI features (Muse) are provided as-is and may evolve</li>
              <li>We reserve the right to modify or discontinue features with notice</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={600}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Intellectual Property</h2>
            <p className="text-foreground">
              The Chapters platform, design, and branding are owned by fLOKr. You may not copy, modify, or redistribute our code or design without permission.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={700}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Disclaimers</h2>
            <p className="text-foreground">
              Chapters is provided "as is" without warranties. We strive for reliability but can't guarantee uninterrupted service. We're not liable for any damages arising from your use of the platform.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={800}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Changes to Terms</h2>
            <p className="text-foreground">
              We may update these terms as Chapters evolves. We'll notify you of significant changes via email. Continued use means you accept the updated terms.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={900}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Termination</h2>
            <p className="text-foreground">
              You can stop using Chapters anytime. We may suspend or terminate accounts that violate these terms. Upon termination, you can export your data within 30 days.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1000} className="border-t border-border pt-6 mt-8">
            <p className="text-muted-foreground">
              Questions about these terms? Email us at{" "}
              <a href="mailto:legal@chapters.app" className="text-primary hover:underline">
                legal@chapters.app
              </a>
            </p>
          </AnimatedSection>
        </div>
      </article>

      <Footer />
    </div>
  )
}
