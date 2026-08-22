import type { Metadata, Viewport } from 'next'
import { fontDisplay, fontBody, fontUI } from '@/lib/fonts'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'UniLens — Real Student Experience, Real University Choices',
  description: 'Connect with undergraduates and graduates from Pakistani universities who share honest insights about their universities and fields of study. Make informed decisions based on real experience, not rankings.',
  keywords: ['university', 'college', 'student reviews', 'higher education', 'university choice', 'field of study', 'student experience', 'pakistan', 'pakistani universities'],
  authors: [{ name: 'UniLens' }],
  creator: 'UniLens',
  publisher: 'UniLens',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://unilens.app',
    title: 'UniLens — Real Student Experience, Real University Choices',
    description: 'Connect with undergraduates and graduates from Pakistani universities who share honest insights about their universities and fields of study.',
    siteName: 'UniLens',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UniLens — Real Student Experience',
    description: 'Make informed university decisions based on real student experience, not rankings.',
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const fontVars = `${fontDisplay.variable} ${fontBody.variable} ${fontUI.variable}`

  return (
    <html lang="en" className={fontVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Apply saved/system theme before paint to avoid flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('unilens-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}