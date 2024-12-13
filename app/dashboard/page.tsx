import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const { userId } = auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Legal Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a href="/chat" className="block p-2 hover:bg-gray-50 rounded">
              💬 Start AI Consultation
            </a>
            <a href="/documents" className="block p-2 hover:bg-gray-50 rounded">
              📄 Upload Documents
            </a>
            <a href="/timeline" className="block p-2 hover:bg-gray-50 rounded">
              📅 View Timeline
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-4">
            <p className="text-gray-600">No upcoming deadlines</p>
          </div>
        </div>
      </div>
    </div>
  )
}
