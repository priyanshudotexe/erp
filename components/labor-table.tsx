'use client'

import { useState, useEffect } from 'react'
import { Plus, Save, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface LaborEntry {
  id: string
  category: string
  values: { [key: string]: number }
}

const AVAILABLE_CATEGORIES = [
  'Tile Mason',
  'Tile Helper',
  'Plumber',
  'Waterproofing',
  'Cleaning Labour',
  'P.O.P Labour',
  'Carpenter',
  'Painter',
  'Electrician',
  'Masson',
  'Helper',
  'Fabricators',
]

interface LaborTableProps {
  selectedDate: Date | undefined
}

export default function LaborTable({ selectedDate }: LaborTableProps) {
  const [entries, setEntries] = useState<LaborEntry[]>([])
  const [contractors, setContractors] = useState(['C1', 'C2'])
  const [isSaving, setIsSaving] = useState(false)

  // Calculate totals for each contractor
  const totals = contractors.reduce((acc, contractor) => {
    acc[contractor] = entries.reduce((sum, entry) => sum + (entry.values[contractor] || 0), 0)
    return acc
  }, {} as { [key: string]: number })

  const addRow = () => {
    const newEntry: LaborEntry = {
      id: Math.random().toString(36).substr(2, 9),
      category: '',
      values: contractors.reduce((acc, contractor) => {
        acc[contractor] = 0
        return acc
      }, {} as { [key: string]: number })
    }
    setEntries([...entries, newEntry])
  }

  const addContractor = () => {
    const name = prompt('Enter contractor name (e.g. C3):')
    if (name && !contractors.includes(name)) {
      setContractors([...contractors, name])
      setEntries(entries.map(entry => ({
        ...entry,
        values: { ...entry.values, [name]: 0 }
      })))
    }
  }

  const removeContractor = (contractorToRemove: string) => {
    setContractors(contractors.filter(c => c !== contractorToRemove))
    setEntries(entries.map(entry => {
      const { [contractorToRemove]: _, ...rest } = entry.values
      return { ...entry, values: rest }
    }))
  }

  const updateValue = (entryId: string, contractor: string, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0)
    setEntries(entries.map(entry =>
      entry.id === entryId
        ? { ...entry, values: { ...entry.values, [contractor]: numValue } }
        : entry
    ))
  }

  const updateCategory = (entryId: string, category: string) => {
    setEntries(entries.map(entry =>
      entry.id === entryId
        ? { ...entry, category }
        : entry
    ))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  useEffect(() => {
    // Fetch data for the selected date
    console.log(`Fetching data for ${selectedDate?.toISOString().split('T')[0]}`)
    // Here you would typically fetch the data from an API
  }, [selectedDate])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={addRow} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
          <Button variant="outline" onClick={addContractor} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Contractor
          </Button>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] border-r">Category</TableHead>
              {contractors.map(contractor => (
                <TableHead key={contractor} className="border-r relative min-w-[100px]">
                  <div className="flex items-center justify-between pr-6">
                    {contractor}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 absolute top-1 right-1"
                      onClick={() => removeContractor(contractor)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove {contractor}</span>
                    </Button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={entry.id} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                <TableCell className="border-r">
                  <Select
                    value={entry.category}
                    onValueChange={(value) => updateCategory(entry.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                {contractors.map(contractor => (
                  <TableCell key={contractor} className="border-r">
                    <Input
                      type="number"
                      min="0"
                      value={entry.values[contractor]}
                      onChange={(e) => updateValue(entry.id, contractor, e.target.value)}
                      className="w-full"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell className="border-r">Total Labour</TableCell>
              {contractors.map(contractor => (
                <TableCell key={contractor} className="border-r">{totals[contractor]}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

