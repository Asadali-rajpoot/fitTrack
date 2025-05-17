import { Toaster } from "sonner"
import { Inter } from "next/font/google"
import "@/app/globals.css";
import AuthGuard from "@/components/dashboard/layout/auth-guard"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Flex Gym Management System",
  description: "A modern gym management system",
}

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning className={inter.className}>
          <AuthGuard>{children}</AuthGuard>
          <Toaster position="top-right" />
      </body>
    </html>
  )
}
