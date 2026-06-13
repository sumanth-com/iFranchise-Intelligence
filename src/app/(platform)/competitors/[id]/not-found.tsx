import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CompetitorNotFound() {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Competitor not found</CardTitle>
        <CardDescription>
          This competitor may have been removed or the link is incorrect.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/competitors">Back to competitors</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
