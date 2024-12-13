"use client"

import { useEffect, useState } from 'react'

interface LegalRequirement {
  id: string
  state: string
  category: string
  title: string
  description: string
  details: string
}

interface LegalRequirementsProps {
  state: string
}

export function LegalRequirements({ state }: LegalRequirementsProps) {
  const [requirements, setRequirements] = useState<LegalRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!state) return

    async function fetchRequirements() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/legal-requirements?state=${encodeURIComponent(state)}`)
        if (!response.ok) throw new Error('Failed to fetch requirements')
        const data = await response.json()
        setRequirements(data)
      } catch (error) {
        console.error('Error fetching requirements:', error)
        setError('Failed to load legal requirements')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequirements()
  }, [state])

  if (isLoading) {
    return <div className="text-center py-4">Loading requirements...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  if (!requirements.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No legal requirements found for {state}
      </div>
    )
  }

  // Group requirements by category
  const groupedRequirements = requirements.reduce((acc, req) => {
    if (!acc[req.category]) {
      acc[req.category] = []
    }
    acc[req.category].push(req)
    return acc
  }, {} as Record<string, LegalRequirement[]>)

  return (
    <div className="space-y-8">
      {Object.entries(groupedRequirements).map(([category, reqs]) => (
        <div key={category} className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {category} Requirements
          </h3>
          <div className="space-y-6">
            {reqs.map((req) => (
              <div key={req.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                <h4 className="font-medium text-gray-900">{req.title}</h4>
                <p className="text-gray-600 mt-1">{req.description}</p>
                <div className="mt-2 text-sm text-gray-500 whitespace-pre-line">
                  {req.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
