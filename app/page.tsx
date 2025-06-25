"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { ChartDashboard } from "@/components/chart-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChart, TrendingUp, Upload } from "lucide-react"

export default function HomePage() {
  const [uploadedData, setUploadedData] = useState<any[]>([])
  const [fileName, setFileName] = useState<string>("")

  const handleDataUpload = (data: any[], filename: string) => {
    setUploadedData(data)
    setFileName(filename)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📊 Chart Generator Pro</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your CSV, Excel, or text files and instantly generate beautiful, interactive charts and
            visualizations
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Easy Upload</h3>
              <p className="text-sm text-gray-600">CSV, Excel & Text files</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <PieChart className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Pie Charts</h3>
              <p className="text-sm text-gray-600">Distribution analysis</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Bar Charts</h3>
              <p className="text-sm text-gray-600">Comparative data</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-semibold">Trend Analysis</h3>
              <p className="text-sm text-gray-600">Historical patterns</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {uploadedData.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Upload Your Data File</CardTitle>
              <CardDescription>
                Support for CSV, Excel (.xlsx, .xls), and text files. Maximum file size: 10MB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onDataUpload={handleDataUpload} />
            </CardContent>
          </Card>
        ) : (
          <ChartDashboard data={uploadedData} fileName={fileName} />
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload File</h3>
                <p className="text-sm text-gray-600">Drag and drop or click to upload your CSV, Excel, or text file</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Auto Processing</h3>
                <p className="text-sm text-gray-600">Our system automatically processes and analyzes your data</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">View Charts</h3>
                <p className="text-sm text-gray-600">Explore interactive charts and download visualizations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
