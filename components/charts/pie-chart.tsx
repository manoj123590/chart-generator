"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

interface PieChartComponentProps {
  data: any[]
}

export function PieChartComponent({ data }: PieChartComponentProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Find the first text column for categories and first numeric column for values
    const columns = Object.keys(data[0])
    const textColumn = columns.find((col) => data.some((row) => typeof row[col] === "string"))
    const numericColumn = columns.find((col) => data.some((row) => typeof row[col] === "number" && !isNaN(row[col])))

    if (!textColumn || !numericColumn) {
      // If no suitable columns, create a simple count by first column
      const firstColumn = columns[0]
      const counts: { [key: string]: number } = {}

      data.forEach((row) => {
        const key = String(row[firstColumn])
        counts[key] = (counts[key] || 0) + 1
      })

      return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }

    // Group by text column and sum numeric values
    const grouped: { [key: string]: number } = {}
    data.forEach((row) => {
      const key = String(row[textColumn])
      const value = Number(row[numericColumn]) || 0
      grouped[key] = (grouped[key] || 0) + value
    })

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 8) // Limit to 8 slices for readability
  }, [data])

  const chartConfig = {
    value: {
      label: "Value",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution Analysis</CardTitle>
        <CardDescription>Pie chart showing the distribution of your data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
