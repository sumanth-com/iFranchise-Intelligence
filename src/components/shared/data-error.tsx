import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type DataErrorProps = {
  title?: string
  message?: string
  reset?: () => void
}

export function DataError({
  title = "Something went wrong",
  message = "We couldn't load the data. Please try again in a moment.",
  reset,
}: DataErrorProps) {
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
            <AlertCircle className="size-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="font-heading">{title}</CardTitle>
            <CardDescription className="mt-1">{message}</CardDescription>
          </div>
        </div>
      </CardHeader>
      {reset && (
        <CardContent>
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
