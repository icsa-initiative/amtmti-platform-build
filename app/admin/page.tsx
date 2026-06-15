'use client'

import { useRouter } from 'next/navigation'
import { adminLogoutAction } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  const router = useRouter()

  async function handleLogout() {
    await adminLogoutAction()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage the AMTMTI platform</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-lg p-6">
            <div className="text-sm font-medium text-muted-foreground">Users</div>
            <div className="text-3xl font-bold mt-2">0</div>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <div className="text-sm font-medium text-muted-foreground">Enrollments</div>
            <div className="text-3xl font-bold mt-2">0</div>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <div className="text-sm font-medium text-muted-foreground">Revenue</div>
            <div className="text-3xl font-bold mt-2">$0</div>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <div className="text-sm font-medium text-muted-foreground">Messages</div>
            <div className="text-3xl font-bold mt-2">0</div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-card border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to Admin Panel</h2>
          <p className="text-muted-foreground">
            Admin features and management tools coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}
