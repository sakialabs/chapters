import { AnimatedSection } from "@/components/AnimatedSection"
import { Footer } from "@/components/Footer"

export default function PrivacyPage() {
  const lastUpdated = "December 23, 2025"

  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 pt-32 pb-16 max-w-3xl">
        <AnimatedSection>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>
        </AnimatedSection>

        <div className="prose prose-lg max-w-none space-y-8 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
          <AnimatedSection delay={100}>
            <p className="text-lg leading-relaxed text-foreground">
              At Chapters, your privacy is sacred. We built this platform with privacy-first principles because we believe your creative work and personal data deserve respect.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">What We Collect</h2>
            <ul className="space-y-2">
              <li className="text-foreground"><strong className="text-foreground">Account Information:</strong> Email, username, and password (encrypted)</li>
              <li className="text-foreground"><strong className="text-foreground">Content:</strong> Chapters you publish, drafts, and notes (private by default)</li>
              <li className="text-foreground"><strong className="text-foreground">Usage Data:</strong> How you interact with the app to improve your experience</li>
              <li className="text-foreground"><strong className="text-foreground">Device Information:</strong> Basic device and browser data for security</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">What We Don't Do</h2>
            <ul className="space-y-2">
              <li className="text-foreground">❌ Sell your data to third parties</li>
              <li className="text-foreground">❌ Track you across other websites</li>
              <li className="text-foreground">❌ Use your content to train AI models without permission</li>
              <li className="text-foreground">❌ Share your private drafts or notes with anyone</li>
              <li className="text-foreground">❌ Send you spam or unwanted marketing emails</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">How We Use Your Data</h2>
            <p className="text-foreground">
              We use your information solely to provide and improve Chapters. This includes:
            </p>
            <ul className="space-y-2">
              <li className="text-foreground">Delivering the core features of the platform</li>
              <li className="text-foreground">Personalizing your experience (Quiet Picks, Muse suggestions)</li>
              <li className="text-foreground">Communicating important updates about your account</li>
              <li className="text-foreground">Preventing abuse and maintaining security</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={500}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Your Rights</h2>
            <p className="text-foreground">You have complete control over your data:</p>
            <ul className="space-y-2">
              <li className="text-foreground"><strong className="text-foreground">Access:</strong> Request a copy of all your data</li>
              <li className="text-foreground"><strong className="text-foreground">Delete:</strong> Permanently delete your account and all associated data</li>
              <li className="text-foreground"><strong className="text-foreground">Export:</strong> Download your chapters and notes anytime</li>
              <li className="text-foreground"><strong className="text-foreground">Opt-out:</strong> Disable AI features or personalization</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={600}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Data Security</h2>
            <p className="text-foreground">
              We use industry-standard encryption and security practices. Your password is hashed, your data is encrypted in transit and at rest, and we regularly audit our security measures.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={700}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Children's Privacy</h2>
            <p className="text-foreground">
              Chapters is not intended for users under 13. We do not knowingly collect data from children.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={800}>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-foreground">
              We'll notify you of any significant changes via email. Continued use of Chapters after changes means you accept the updated policy.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={900} className="border-t border-border pt-6 mt-8">
            <p className="text-muted-foreground">
              Questions about privacy? Email us at{" "}
              <a href="mailto:privacy@chapters.app" className="text-primary hover:underline">
                privacy@chapters.app
              </a>
            </p>
          </AnimatedSection>
        </div>
      </article>

      <Footer />
    </div>
  )
}
