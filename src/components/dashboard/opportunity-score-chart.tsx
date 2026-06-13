"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ChartPoint } from "@/lib/supabase/types"

const chartConfig = {
  score: {
    label: "Opportunity Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type OpportunityScoreChartProps = {
  data: ChartPoint[]
}

export function OpportunityScoreChart({ data }: OpportunityScoreChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunity Score Trend</CardTitle>
        <CardDescription>
          Average opportunity score across all tracked markets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/3] h-[280px] w-full">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-score)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-score)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[50, 100]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="var(--color-score)"
              strokeWidth={2}
              fill="url(#scoreGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
