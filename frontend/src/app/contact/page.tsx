import { AnimatedSection } from "@/components/AnimatedSection"
import { Footer } from "@/components/Footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 pt-32 pb-16 max-w-2xl">
        <AnimatedSection>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">
            Contact Us
          </h1>
        </AnimatedSection>

        <div className="space-y-6 text-foreground">
          <AnimatedSection delay={100}>
            <p className="text-lg leading-relaxed">
              We'd love to hear from you. Whether you have questions, feedback, or just want to say hello.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">General Inquiries</h2>
                <a 
                  href="mailto:hello@chapters.app" 
                  className="text-primary hover:underline"
                >
                  hello@chapters.app
                </a>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Support</h2>
                <a 
                  href="mailto:support@chapters.app" 
                  className="text-primary hover:underline"
                >
                  support@chapters.app
                </a>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Press & Media</h2>
                <a 
                  href="mailto:press@chapters.app" 
                  className="text-primary hover:underline"
                >
                  press@chapters.app
                </a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <p className="text-muted-foreground text-sm">
              We typically respond within 24-48 hours. For urgent matters, please mark your email as "Urgent" in the subject line.
            </p>
          </AnimatedSection>
        </div>
      </article>

      <Footer />
    </div>
  )
}
