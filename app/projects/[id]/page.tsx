'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminView from '../../../components/admin-view'
import SupervisorView from '../../../components/supervisor-view'
import { useAuth } from '@/lib/auth-context'
// Mock function to get user role - replace with actual authentication in a real app
const getUserRole = () => {
  // For demonstration, we'll alternate between admin and supervisor
  return Math.random() < 0.5 ? 'administrator' : 'supervisor'
}

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  //const [userRole, setUserRole] = useState<'administrator' | 'supervisor'>('administrator')
  const {user } = useAuth();
  const router=useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } 
  }, [user, router, projectId]);
  if (!user || !projectId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 pb-24">
      {user.role === 'administrator' ? (
        <AdminView projectId={projectId} />
      ) : (
        <SupervisorView projectId={projectId} />
      )}
    </div>
  )
}

