
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './navbar'
import ConfigureAmplifyClientSide from "@/app/componets/ConfigureAmplifyClientSide";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'St. John Bosco',
  description: 'Bosco school management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full" lang="en">
    <body className={`${inter.className}`}>
      <Navbar/>
        <div className="min-w-full">
          <main className="">
            <ConfigureAmplifyClientSide />
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
