'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import AdminView from '../../../components/admin-view'
import SupervisorView from '../../../components/supervisor-view'

// Mock function to get user role - replace with actual authentication in a real app
const getUserRole = () => {
  // For demonstration, we'll alternate between admin and supervisor
  return Math.random() < 0.5 ? 'administrator' : 'supervisor'
}

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const [userRole, setUserRole] = useState<'administrator' | 'supervisor'>('administrator')

  useEffect(() => {
    setUserRole(getUserRole())
  }, [])

  return (
    <div className="container mx-auto py-8 px-4 pb-24">
      {userRole === 'administrator' ? (
        <AdminView projectId={projectId} />
      ) : (
        <SupervisorView projectId={projectId} />
      )}
    </div>
  )
}

