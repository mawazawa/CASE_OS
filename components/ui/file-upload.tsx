"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { IconDocument } from './icons'
import { Button } from './button'

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>
  accept?: Record<string, string[]>
  maxSize?: number
}

export function FileUpload({ 
  onUpload, 
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  maxSize = 10 * 1024 * 1024 // 10MB
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true)
      await onUpload(acceptedFiles)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <IconDocument />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop files here, or click to select files"}
        </p>
        <p className="text-xs text-gray-500">
          Supports PDF, DOC, DOCX up to 10MB
        </p>
        {isUploading && (
          <div className="mt-2">
            <Button disabled>
              <span className="animate-pulse">Uploading...</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
