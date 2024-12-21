'use client'

import { useState,useEffect } from 'react'
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
import { db } from "@/lib/firebase"
import { collection, getDocs, Timestamp, addDoc } from "firebase/firestore";

type Project = {
  id: string; // Firestore document ID
  name: string; // Name of the project
  lastUpdated: Timestamp; // Firestore Timestamp
};

export default function ProjectsPage() {

const [projects, setProjects] = useState<Project[]>([]);
const [newProjectName, setNewProjectName] = useState("");

useEffect(() => {
  const fetchProjects = async () => {
    const projectsCollection = collection(db, "projects");
    const projectSnapshot = await getDocs(projectsCollection);

    // Map Firestore data to match the `Project` type
    const projectList = projectSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // Firestore's document ID
        name: data.name, // Ensure this field exists in Firestore
        lastUpdated: data.lastUpdated, // Ensure this field exists in Firestore
      };
    }) as Project[]; // Explicitly cast to `Project[]`

    setProjects(projectList); // Update state with the properly typed data
  };

  fetchProjects();
}, []);



const addProject = async () => {
  if (newProjectName.trim()) {
    // Define the new project without the ID initially
    const newProject = {
      name: newProjectName.trim(),
      lastUpdated: Timestamp.now(), // Use Firestore Timestamp
    };

    try {
      // Add the new project to Firestore
      const docRef = await addDoc(collection(db, "projects"), newProject);

      // Add the newly created project to the state, including its Firestore ID
      setProjects([
        ...projects,
        {
          id: docRef.id, // Firestore document ID
          ...newProject,
        },
      ]);

      // Clear the input field after adding
      setNewProjectName("");
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  }
};


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          All Projects (Administrator View)
        </h1>
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
                Last updated:{" "}
                {project.lastUpdated instanceof Timestamp
                  ? project.lastUpdated.toDate().toLocaleDateString()
                  : project.lastUpdated}
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
  );
}

