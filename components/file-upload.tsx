"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import * as XLSX from "xlsx"

interface FileUploadProps {
  onDataUpload: (data: any[], filename: string) => void
}

export function FileUpload({ onDataUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const processFile = async (file: File) => {
    setUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      const fileExtension = file.name.split(".").pop()?.toLowerCase()
      let data: any[] = []

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      if (fileExtension === "csv" || fileExtension === "txt") {
        const text = await file.text()
        data = parseCSV(text)
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: "buffer" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        data = XLSX.utils.sheet_to_json(worksheet)
      } else {
        throw new Error("Unsupported file format. Please upload CSV, Excel, or text files.")
      }

      clearInterval(progressInterval)
      setProgress(100)

      if (data.length === 0) {
        throw new Error("No data found in the file.")
      }

      setTimeout(() => {
        setSuccess(true)
        onDataUpload(data, file.name)
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while processing the file.")
    } finally {
      setUploading(false)
    }
  }

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    const data = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      const row: any = {}

      headers.forEach((header, index) => {
        const value = values[index] || ""
        // Try to convert to number if possible
        const numValue = Number.parseFloat(value)
        row[header] = isNaN(numValue) ? value : numValue
      })

      data.push(row)
    }

    return data
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-gray-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
            </p>
            <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              CSV
            </span>
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Excel
            </span>
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Text
            </span>
          </div>
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Processing file...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            File processed successfully! Generating charts...
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
