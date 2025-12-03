'use client'

import { useState } from 'react'

interface ExportButtonProps {
  rows: string[][]
  filename: string
  type: 'csv' | 'xls'
  headers?: string[]
}

export default function ExportButton({ 
  rows, 
  filename, 
  type, 
  headers
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = () => {
    if (!rows || rows.length === 0) return

    let csvContent = ''

    // Add headers if provided
    if (headers && headers.length > 0) {
      csvContent += headers.map(h => `"${h}"`).join(',') + '\n'
    }

    // Add rows
    rows.forEach((rowData) => {
      const row = rowData.map(cell => {
        const value = cell === null || cell === undefined ? '' : String(cell)
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`
      }).join(',')
      csvContent += row + '\n'
    })

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToXLS = () => {
    if (!rows || rows.length === 0) return

    // For XLS, we'll create an HTML table and use Excel's HTML import feature
    let html = '<html><head><meta charset="utf-8"></head><body><table border="1">'

    // Add headers if provided
    if (headers && headers.length > 0) {
      html += '<tr>'
      headers.forEach(header => {
        html += `<th>${header}</th>`
      })
      html += '</tr>'
    }

    // Add rows
    rows.forEach((rowData) => {
      html += '<tr>'
      rowData.forEach(cell => {
        const value = cell === null || cell === undefined ? '' : String(cell)
        html += `<td>${value}</td>`
      })
      html += '</tr>'
    })

    html += '</table></body></html>'

    // Create blob and download
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.xls`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      if (type === 'csv') {
        exportToCSV()
      } else {
        exportToXLS()
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !rows || rows.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title={`Export to ${type.toUpperCase()}`}
    >
      {isExporting ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Exporting...
        </>
      ) : (
        <>
          {type === 'csv' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          {type.toUpperCase()}
        </>
      )}
    </button>
  )
}

