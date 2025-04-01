import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/redux/provider"

import { NotificationCenter } from "@/components/notifications/notification-center"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CryptoWeather Nexus",
  description: "A dashboard combining weather data, cryptocurrency information, and real-time notifications",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ReduxProvider>
            <div className="fixed top-4 right-4 z-50">
              <NotificationCenter />
            </div>
            {children}
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

