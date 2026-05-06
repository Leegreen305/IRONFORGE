import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IRONFORGE — AI-Powered MDMP Engine',
  description: 'Unclassified AI simulation of the Military Decision Making Process. Academic training aid grounded in publicly available U.S. Army and Joint doctrine.',
  keywords: ['MDMP', 'Military Decision Making', 'Army doctrine', 'FM 6-0', 'IRONFORGE'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-tac-bg text-tac-text font-mono antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
