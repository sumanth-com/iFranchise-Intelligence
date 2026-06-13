"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ContentPerformancePoint } from "@/lib/supabase/types"

const chartConfig = {
  views: {
    label: "Gap Count",
    color: "var(--chart-1)",
  },
  engagement: {
    label: "Avg Importance",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type ContentPerformanceChartProps = {
  data: ContentPerformancePoint[]
}

export function ContentPerformanceChart({ data }: ContentPerformanceChartProps) {
  const hasData = data.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Gaps by Status</CardTitle>
        <CardDescription>
          Gap volume and average importance score by workflow status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig} className="aspect-[4/3] h-[280px] w-full">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="channel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="views"
                fill="var(--color-views)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="engagement"
                fill="var(--color-engagement)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">
              No content gaps recorded yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
