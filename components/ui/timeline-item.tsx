"use client"

import { formatDistanceToNow } from 'date-fns'
import { Button } from './button'

interface TimelineItemProps {
  id: string
  date: Date
  description: string
  completed: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TimelineItem({
  id,
  date,
  description,
  completed,
  onToggle,
  onDelete,
}: TimelineItemProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <div
        className={`w-4 h-4 rounded-full flex-shrink-0 cursor-pointer transition-colors ${
          completed ? 'bg-green-500' : 'bg-gray-300'
        }`}
        onClick={() => onToggle(id)}
      />
      <div className="flex-1">
        <p className={`font-medium ${completed ? 'line-through text-gray-500' : ''}`}>
          {description}
        </p>
        <p className="text-sm text-gray-500">
          Due {formatDistanceToNow(date, { addSuffix: true })}
        </p>
      </div>
      <Button
        variant="ghost"
        className="text-red-600 hover:text-red-800"
        onClick={() => onDelete(id)}
      >
        Delete
      </Button>
    </div>
  )
}
