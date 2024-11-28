'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import LaborTable from '../../../components/labor-table'

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    // Here you would typically fetch the data for the selected date
    console.log(`Fetching data for project ${projectId} on ${date?.toISOString().split('T')[0]}`)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">Project {projectId} Details</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Calendar className="w-4 h-4 mr-2" />
              {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
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
      <LaborTable selectedDate={selectedDate} />
    </div>
  )
}

