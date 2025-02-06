import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import './globals.css'

import 'react-responsive-modal/styles.css'
import '@/app/globals.css'
import { ThemeProvider } from './context/theme'
import { ModalProvider } from './context/modal'
import { UserProiver } from './context/user'

export const metadata: Metadata = {
  title: 'dhub',
  description: 'dhub - the hub for modules. built with commune-ai/commune',
  robots: 'all',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const space_mono = Space_Mono({ subsets : ['latin'], weight : "400" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <ThemeProvider>
        <UserProiver>
          <body className={`${space_mono.className} relative h-full`}>
            <ModalProvider>{children}</ModalProvider>
          </body>
        </UserProiver>
      </ThemeProvider>
    </html>
  )
}
