import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Back of envelope calculator',
  description: 'just a practice app to get to know how things work',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
