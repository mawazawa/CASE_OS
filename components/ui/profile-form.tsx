"use client"

import { useState } from 'react'
import { Button } from './button'

interface ProfileFormProps {
  initialData?: {
    state?: string
    caseNumber?: string
    courtName?: string
    filingDate?: string
  }
  onSubmit: (data: any) => Promise<void>
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
]

export function ProfileForm({ initialData = {}, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    state: initialData.state || '',
    caseNumber: initialData.caseNumber || '',
    courtName: initialData.courtName || '',
    filingDate: initialData.filingDate || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          State
        </label>
        <select
          value={formData.state}
          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a state</option>
          {US_STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Case Number (if available)
        </label>
        <input
          type="text"
          value={formData.caseNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, caseNumber: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Court Name
        </label>
        <input
          type="text"
          value={formData.courtName}
          onChange={(e) => setFormData(prev => ({ ...prev, courtName: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Filing Date (if available)
        </label>
        <input
          type="date"
          value={formData.filingDate}
          onChange={(e) => setFormData(prev => ({ ...prev, filingDate: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  )
}
