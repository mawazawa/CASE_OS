"use client"

import { useEffect, useState } from 'react'
import { ProfileForm } from '@/components/ui/profile-form'
import { LegalRequirements } from '@/components/ui/legal-requirements'
import { useUser } from '@clerk/nextjs'

export default function ProfilePage() {
  const { user } = useUser()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(data: any) {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update profile')
      const updated = await response.json()
      setProfile(updated)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={user?.imageUrl}
                  alt={user?.fullName || 'Profile'}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h2 className="font-semibold">{user?.fullName}</h2>
                  <p className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Case Information</h3>
                <ProfileForm
                  initialData={{
                    state: profile?.state,
                    caseNumber: profile?.caseNumber,
                    courtName: profile?.courtName,
                    filingDate: profile?.filingDate ? new Date(profile.filingDate).toISOString().split('T')[0] : undefined,
                  }}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {profile?.state && (
              <>
                <h3 className="text-lg font-semibold">Legal Requirements for {profile.state}</h3>
                <LegalRequirements state={profile.state} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
