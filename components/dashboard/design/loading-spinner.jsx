import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"


export function LoadingSpinner({ size = "md", className }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return <Loader2 className={cn("animate-spin text-primary", sizeClasses[size], className)} />
}

export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex h-40 w-full flex-col items-center justify-center gap-2">
      <LoadingSpinner />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
