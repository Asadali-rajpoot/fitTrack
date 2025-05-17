import React from "react"
import { Inter, Rubik } from "next/font/google"
import "./globals.css"


const inter = Inter({ subsets: ["latin"] })

const Rubikfont = Rubik({
  variable: "--rubik-font",
  subsets: ["latin"]
})

export const metadata = {
  title: "Fit Track",
  description: "Elevate your workout with our professional trainers",
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} ${Rubikfont.variable} alipesed`}>
        {children}
      </body>
    </html>
  )
}

