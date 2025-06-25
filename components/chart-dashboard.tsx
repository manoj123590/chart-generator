"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChartComponent } from "@/components/charts/pie-chart"
import { BarChartComponent } from "@/components/charts/bar-chart"
import { LineChartComponent } from "@/components/charts/line-chart"
import { AreaChartComponent } from "@/components/charts/area-chart"
import { DataTable } from "@/components/data-table"
import { Download, FileText, BarChart3, PieChart, TrendingUp, Activity } from "lucide-react"

interface ChartDashboardProps {
  data: any[]
  fileName: string
}

export function ChartDashboard({ data, fileName }: ChartDashboardProps) {
  const [selectedChart, setSelectedChart] = useState("overview")

  const dataAnalysis = useMemo(() => {
    if (!data || data.length === 0) return null

    const columns = Object.keys(data[0])
    const numericColumns = columns.filter((col) => data.some((row) => typeof row[col] === "number" && !isNaN(row[col])))
    const textColumns = columns.filter((col) => data.some((row) => typeof row[col] === "string"))

    return {
      totalRows: data.length,
      totalColumns: columns.length,
      numericColumns,
      textColumns,
      columns,
    }
  }, [data])

  const downloadData = (format: "csv" | "json") => {
    let content = ""
    let mimeType = ""
    let extension = ""

    if (format === "csv") {
      const headers = Object.keys(data[0]).join(",")
      const rows = data.map((row) => Object.values(row).join(",")).join("\n")
      content = headers + "\n" + rows
      mimeType = "text/csv"
      extension = "csv"
    } else {
      content = JSON.stringify(data, null, 2)
      mimeType = "application/json"
      extension = "json"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName.split(".")[0]}_processed.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!dataAnalysis) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {fileName}
              </CardTitle>
              <CardDescription>Data analysis and visualization dashboard</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => downloadData("csv")}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadData("json")}>
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dataAnalysis.totalRows}</div>
              <div className="text-sm text-gray-600">Total Rows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{dataAnalysis.totalColumns}</div>
              <div className="text-sm text-gray-600">Total Columns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{dataAnalysis.numericColumns.length}</div>
              <div className="text-sm text-gray-600">Numeric Columns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{dataAnalysis.textColumns.length}</div>
              <div className="text-sm text-gray-600">Text Columns</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {dataAnalysis.columns.map((col, index) => (
                <Badge key={index} variant="secondary">
                  {col}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs value={selectedChart} onValueChange={setSelectedChart}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="pie" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Pie Chart
          </TabsTrigger>
          <TabsTrigger value="bar" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Bar Chart
          </TabsTrigger>
          <TabsTrigger value="line" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Line Chart
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Raw Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChartComponent data={data} />
            <BarChartComponent data={data} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChartComponent data={data} />
            <AreaChartComponent data={data} />
          </div>
        </TabsContent>

        <TabsContent value="pie">
          <PieChartComponent data={data} />
        </TabsContent>

        <TabsContent value="bar">
          <BarChartComponent data={data} />
        </TabsContent>

        <TabsContent value="line">
          <div className="space-y-6">
            <LineChartComponent data={data} />
            <AreaChartComponent data={data} />
          </div>
        </TabsContent>

        <TabsContent value="data">
          <DataTable data={data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
