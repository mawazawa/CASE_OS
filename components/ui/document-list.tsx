"use client"

import { IconDocument } from './icons'
import { formatDistanceToNow } from 'date-fns'

interface Document {
  id: string
  title: string
  description?: string
  fileUrl: string
  fileType: string
  createdAt: Date
}

interface DocumentListProps {
  documents: Document[]
  onDelete?: (id: string) => Promise<void>
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No documents uploaded yet</p>
      ) : (
        documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 rounded-full">
                <IconDocument />
              </div>
              <div>
                <h3 className="font-medium">{doc.title}</h3>
                {doc.description && (
                  <p className="text-sm text-gray-500">{doc.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  Uploaded {formatDistanceToNow(doc.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View
              </a>
              {onDelete && (
                <button
                  onClick={() => onDelete(doc.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
