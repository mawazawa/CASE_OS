"use client"

import { useEffect, useState } from 'react'
import { FileUpload } from '@/components/ui/file-upload'
import { DocumentList } from '@/components/ui/document-list'

interface Document {
  id: string
  title: string
  description?: string
  fileUrl: string
  fileType: string
  createdAt: Date
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    try {
      const response = await fetch('/api/documents')
      if (!response.ok) throw new Error('Failed to fetch documents')
      const data = await response.json()
      setDocuments(data.map((doc: any) => ({
        ...doc,
        createdAt: new Date(doc.createdAt)
      })))
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpload(files: File[]) {
    for (const file of files) {
      try {
        // Get pre-signed URL
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.name,
            fileType: file.type,
          }),
        })

        if (!response.ok) throw new Error('Failed to get upload URL')
        const { presignedUrl, document } = await response.json()

        // Upload file to S3
        await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })

        // Update documents list
        setDocuments(prev => [{ ...document, createdAt: new Date(document.createdAt) }, ...prev])
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete document')
      setDocuments(prev => prev.filter(doc => doc.id !== id))
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Document Management</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
          <FileUpload onUpload={handleUpload} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">Loading documents...</p>
          ) : (
            <DocumentList 
              documents={documents} 
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  )
}
