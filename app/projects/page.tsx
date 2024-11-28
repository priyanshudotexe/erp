'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Project {
  id: number
  name: string
  lastUpdated: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Project A', lastUpdated: '2024-11-07' },
    { id: 2, name: 'Project B', lastUpdated: '2024-11-07' },
  ])
  const [newProjectName, setNewProjectName] = useState('')

  const addProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: projects.length + 1,
        name: newProjectName.trim(),
        lastUpdated: new Date().toISOString().split('T')[0],
      }
      setProjects([...projects, newProject])
      setNewProjectName('')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <Button onClick={addProject}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                Last updated: {project.lastUpdated}
              </p>
              <div className="flex justify-end">
                <Link href={`/projects/${project.id}`}>
                  <Button>View Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

