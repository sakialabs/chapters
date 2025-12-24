import type { Metadata } from "next"
import { Inter, Lora } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "@/components/ClientLayout"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
})

const lora = Lora({ 
  subsets: ["latin"],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: "Chapters - A Calm Social Platform",
  description: "A calm, expressive, AI-assisted social platform built for depth, not dopamine.",
  icons: {
    icon: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
