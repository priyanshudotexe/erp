'use client'

import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import LaborTable from './labor-table'
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  Timestamp,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
export default function SupervisorView({ projectId }: { projectId: string }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
   const [projectName, setProjectName] = useState<string>("");
   const [projectSupervisor, setProjectSupervisor] = useState<string>("");
useEffect(() => {
  const fetchProjectDetails = async () => {
    try {
      // Reference the specific document within the "projects" collection
      const projectRef = doc(db, "projects", projectId);

      // Fetch the document
      const projectSnapshot = await getDoc(projectRef);

      if (projectSnapshot.exists()) {
        const projectData = projectSnapshot.data();
        setProjectName(projectData.name);
        setProjectSupervisor(projectData.supervisorName);
        console.log(
          `Fetched project ${projectData.name} details for project ${projectId}`
        );
      } else {
        console.error("No such project found!");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  fetchProjectDetails();
}, [projectId]);


  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      console.log(`Fetching data for project ${projectId} on ${date.toISOString().split('T')[0]}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">Project {projectName} Details (Supervisor {projectSupervisor}) </h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Calendar className="w-4 h-4 mr-2" />
              {selectedDate.toLocaleDateString()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <LaborTable selectedDate={selectedDate} userRole="supervisor" projectId={projectId}/>
    </div>
  )
}

