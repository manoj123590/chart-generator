"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface LineChartComponentProps {
  data: any[]
}

export function LineChartComponent({ data }: LineChartComponentProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    const columns = Object.keys(data[0])
    const numericColumns = columns.filter((col) => data.some((row) => typeof row[col] === "number" && !isNaN(row[col])))

    if (numericColumns.length === 0) return []

    // Use row index as x-axis if no suitable date/text column
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
        <CardTitle>Trend Analysis</CardTitle>
        <CardDescription>Line chart showing trends over time or sequence</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {numericColumns.map((col, index) => (
                <Line
                  key={col}
                  type="monotone"
                  dataKey={col}
                  stroke={`hsl(${index * 60}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
