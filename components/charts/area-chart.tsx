"use client"

import { useMemo } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AreaChartComponentProps {
  data: any[]
}

export function AreaChartComponent({ data }: AreaChartComponentProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    const columns = Object.keys(data[0])
    const numericColumns = columns.filter((col) => data.some((row) => typeof row[col] === "number" && !isNaN(row[col])))

    if (numericColumns.length === 0) return []

    return data.slice(0, 20).map((row, index) => ({
      index: index + 1,
      ...numericColumns.reduce((acc, col) => {
        acc[col] = Number(row[col]) || 0
        return acc
      }, {} as any),
    }))
  }, [data])

  const numericColumns = useMemo(() => {
    if (!data || data.length === 0) return []
    return Object.keys(data[0]).filter((col) => data.some((row) => typeof row[col] === "number" && !isNaN(row[col])))
  }, [data])

  const chartConfig = numericColumns.reduce((config, col, index) => {
    config[col] = {
      label: col,
      color: `hsl(${index * 60}, 70%, 50%)`,
    }
    return config
  }, {} as any)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Analysis</CardTitle>
        <CardDescription>Area chart showing cumulative trends and patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {numericColumns.map((col, index) => (
                <Area
                  key={col}
                  type="monotone"
                  dataKey={col}
                  stackId="1"
                  stroke={`hsl(${index * 60}, 70%, 50%)`}
                  fill={`hsl(${index * 60}, 70%, 50%)`}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
