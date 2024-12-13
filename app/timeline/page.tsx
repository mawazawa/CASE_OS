"use client"

import { useState, useEffect } from 'react'
import { TimelineItem } from '@/components/ui/timeline-item'
import { Button } from '@/components/ui/button'

interface TimelineEvent {
  id: string
  date: Date
  description: string
  completed: boolean
}

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newEvent, setNewEvent] = useState({
    date: '',
    description: '',
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const response = await fetch('/api/timeline')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(data.map((event: any) => ({
        ...event,
        date: new Date(event.date)
      })))
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      })

      if (!response.ok) throw new Error('Failed to create event')
      const event = await response.json()
      setEvents(prev => [...prev, { ...event, date: new Date(event.date) }])
      setNewEvent({ date: '', description: '' })
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  async function handleToggle(id: string) {
    try {
      const response = await fetch('/api/timeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) throw new Error('Failed to update event')
      const updated = await response.json()
      setEvents(prev =>
        prev.map(event =>
          event.id === id
            ? { ...event, completed: !event.completed }
            : event
        )
      )
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/timeline?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete event')
      setEvents(prev => prev.filter(event => event.id !== id))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Timeline</h1>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="datetime-local"
                value={newEvent.date}
                onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={newEvent.description}
                onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <Button type="submit">Add Event</Button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Timeline Events</h2>
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No events yet</p>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
                <TimelineItem
                  key={event.id}
                  {...event}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
