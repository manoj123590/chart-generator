"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BarChartComponentProps {
  data: any[]
}

export function BarChartComponent({ data }: BarChartComponentProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    const columns = Object.keys(data[0])
    const numericColumns = columns.filter((col) => data.some((row) => typeof row[col] === "number" && !isNaN(row[col])))
    const textColumn = columns.find((col) => data.some((row) => typeof row[col] === "string"))

    if (numericColumns.length === 0) return []

    // If we have a text column, group by it
    if (textColumn) {
      const grouped: { [key: string]: any } = {}

      data.forEach((row) => {
        const key = String(row[textColumn])
        if (!grouped[key]) {
          grouped[key] = { name: key }
          numericColumns.forEach((col) => {
            grouped[key][col] = 0
          })
        }

        numericColumns.forEach((col) => {
          grouped[key][col] += Number(row[col]) || 0
        })
      })

      return Object.values(grouped).slice(0, 10) // Limit to 10 bars
    }

    // Otherwise, use the data as is (limit to first 10 rows)
    return data.slice(0, 10).map((row, index) => ({
      name: `Row ${index + 1}`,
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
        <CardTitle>Comparative Analysis</CardTitle>
        <CardDescription>Bar chart comparing values across categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {numericColumns.map((col, index) => (
                <Bar key={col} dataKey={col} fill={`hsl(${index * 60}, 70%, 50%)`} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
