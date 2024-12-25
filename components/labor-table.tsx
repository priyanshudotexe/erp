// "use client";

// import { useState, useEffect } from "react";
// import { Plus, Save, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { db } from "@/lib/firebase";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   addDoc,
//   Timestamp,
// } from "firebase/firestore";
// import { startOfDay, endOfDay } from "date-fns";
// interface LaborEntry {
//   id: string;
//   category: string;
//   values: { [key: string]: number };
// }

// const AVAILABLE_CATEGORIES = [
//   "Tile Mason",
//   "Tile Helper",
//   "Plumber",
//   "Waterproofing",
//   "Cleaning Labour",
//   "P.O.P Labour",
//   "Carpenter",
//   "Painter",
//   "Electrician",
//   "Masson",
//   "Helper",
//   "Fabricators",
// ];

// interface LaborTableProps {
//   selectedDate: Date;
//   userRole: "administrator" | "supervisor";
//   projectId: string;
// }

// export default function LaborTable({
//   selectedDate,
//   userRole,
//   projectId,
// }: LaborTableProps) {
//   const [entries, setEntries] = useState<LaborEntry[]>([]);
//   const [contractors, setContractors] = useState([""]);
//   const [isSaving, setIsSaving] = useState(false);

//   const totals = contractors.reduce((acc, contractor) => {
//     acc[contractor] = entries.reduce(
//       (sum, entry) => sum + (entry.values[contractor] || 0),
//       0
//     );
//     return acc;
//   }, {} as { [key: string]: number });

//   const addRow = () => {
//     if (userRole !== "administrator") return;
//     const newEntry: LaborEntry = {
//       id: Math.random().toString(36).substr(2, 9),
//       category: "",
//       values: contractors.reduce((acc, contractor) => {
//         acc[contractor] = 0;
//         return acc;
//       }, {} as { [key: string]: number }),
//     };
//     setEntries([...entries, newEntry]);
//   };

//   const addContractor = () => {
//     if (userRole !== "administrator") return;
//     const name = prompt("Enter contractor name (e.g. C3):");
//     if (name && !contractors.includes(name)) {
//       setContractors([...contractors, name]);
//       setEntries(
//         entries.map((entry) => ({
//           ...entry,
//           values: { ...entry.values, [name]: 0 },
//         }))
//       );
//     }
//   };

//   const removeContractor = (contractorToRemove: string) => {
//     if (userRole !== "administrator") return;
//     setContractors(contractors.filter((c) => c !== contractorToRemove));
//     setEntries(
//       entries.map((entry) => {
//         const { [contractorToRemove]: _, ...rest } = entry.values;
//         return { ...entry, values: rest };
//       })
//     );
//   };

//   const updateValue = (entryId: string, contractor: string, value: string) => {
//     if (userRole !== "supervisor") return;
//     const numValue = Math.max(0, parseInt(value) || 0);
//     setEntries(
//       entries.map((entry) =>
//         entry.id === entryId
//           ? { ...entry, values: { ...entry.values, [contractor]: numValue } }
//           : entry
//       )
//     );
//   };

//   const updateCategory = (entryId: string, category: string) => {
//     if (userRole !== "administrator") return;
//     setEntries(
//       entries.map((entry) =>
//         entry.id === entryId ? { ...entry, category } : entry
//       )
//     );
//   };

  

//   const fetchEntriesForDate = async () => {
//     try {
//       console.log("Fetch entries for date:", selectedDate);

//       // Check if required variables are available
//       if (!projectId || !selectedDate) {
//         console.warn("Project ID or selected date is missing");
//         return;
//       }

//       // Create a formatted Date object without the time portion
//       const formattedDate = new Date(
//         selectedDate.getFullYear(),
//         selectedDate.getMonth(),
//         selectedDate.getDate()
//       );

//       const day = String(formattedDate.getDate()).padStart(2, "0");
//       const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
//       const year = String(formattedDate.getFullYear()).slice(-2);

//       const formattedDateString = `${day}/${month}/${year}`;
//       console.log("Formatted date:", formattedDateString);
      
//       const entriesCollectionRef = collection(
//         db,
//         "projects",
//         projectId,
//         "entries"
//       );

//       // Query to find entries where the date matches the selected date
//       const q = await query(
//         entriesCollectionRef,
//         where("date", "==", formattedDateString)
//       );
//       const querySnapshot = await getDocs(q);
//       if (!querySnapshot.empty) {
//         // Retrieve the first document's data
//         const entryDoc = querySnapshot.docs[0];
//         const data = entryDoc.data();
//         console.log("Entry data:", data);
//         //const x=json.parse(data.entry);
//         try {
//           // Parse the JSON data from the entry field
//           console.log("Entry data:", data.entry);
//           const entriesArray = JSON.parse(data.entry);
//           console.log("Fetched entries for date:", entriesArray);
//           setEntries(entriesArray);
//         } catch (parseError) {
//           console.error("Error parsing entries data:", parseError);
//           setEntries([]);
//         }
//       } else {
//         // No entries found
//         console.log("No entries found for the selected date");
//         setEntries([]);
//       }
//     } catch (error) {
//       // Handle errors during the query process
//       console.error("Error fetching entries:", error);
//       setEntries([]);
//     }
//   };


//   const handleSave = async () => {
//     try {
//       setIsSaving(true);
//       const formattedDate = selectedDate.toISOString().split("T")[0];
//       const entriesCollectionRef = collection(
//         db,
//         "projects",
//         projectId,
//         "entries"
//       );

//       await addDoc(entriesCollectionRef, {
//         date: formattedDate,
//         entry: JSON.stringify(entries),
//       });

//       setIsSaving(false);
//     } catch (error) {
//       console.error("Error saving entries:", error);
//       setIsSaving(false);
//     }
//   };

//   useEffect(() => {
//     console.log("useEffect called");
//     fetchEntriesForDate();
//   }, [selectedDate]); //projectId, selectedDate

//   return (
//     <div className="space-y-4 pb-20">
//       <div className="overflow-x-auto border rounded-lg">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[200px] border-r">Category</TableHead>
//               {contractors.map((contractor) => (
//                 <TableHead
//                   key={contractor}
//                   className="border-r relative min-w-[100px]"
//                 >
//                   <div className="flex items-center justify-between pr-6">
//                     {contractor}
//                     {userRole === "administrator" && (
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-6 w-6 absolute top-1 right-1"
//                         onClick={() => removeContractor(contractor)}
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {entries.map((entry) => (
//               <TableRow key={entry.id}>
//                 <TableCell className="border-r">
//                   {userRole === "administrator" ? (
//                     <Select
//                       value={entry.category}
//                       onValueChange={(value) => updateCategory(entry.id, value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select category" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {AVAILABLE_CATEGORIES.map((category) => (
//                           <SelectItem key={category} value={category}>
//                             {category}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   ) : (
//                     entry.category
//                   )}
//                 </TableCell>
//                 {contractors.map((contractor) => (
//                   <TableCell key={contractor} className="border-r">
//                     <Input
//                       type="number"
//                       min="0"
//                       value={entry.values[contractor]}
//                       onChange={(e) =>
//                         updateValue(entry.id, contractor, e.target.value)
//                       }
//                       className="w-full"
//                       readOnly={userRole === "administrator"}
//                     />
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//             <TableRow className="font-bold">
//               <TableCell className="border-r">Total Labour</TableCell>
//               {contractors.map((contractor) => (
//                 <TableCell key={contractor} className="border-r">
//                   {totals[contractor]}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableBody>
//         </Table>
//       </div>
//       {userRole === "supervisor" && (
//         <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
//           <Button onClick={handleSave} disabled={isSaving} className="w-full">
//             <Save className="w-4 h-4 mr-2" />
//             {isSaving ? "Saving..." : "Save Changes"}
//           </Button>
//         </div>
//       )}
//       {userRole === "administrator" && (
//         <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
//           <div className="flex space-x-2">
//             <Button onClick={addRow} className="flex-1">
//               <Plus className="w-4 h-4 mr-2" />
//               Add Row
//             </Button>
//             <Button
//               variant="outline"
//               onClick={addContractor}
//               className="flex-1"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Add Contractor
//             </Button>
//             <Button onClick={handleSave} disabled={isSaving} className="flex-1">
//               <Save className="w-4 h-4 mr-2" />
//               {isSaving ? "Saving..." : "Save Changes"}
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { startOfDay, endOfDay } from "date-fns";
interface LaborEntry {
  contractor: string;
  values: { [category: string]: number };
}

const AVAILABLE_CATEGORIES = [
  "Tile Mason",
  "Tile Helper",
  "Plumber",
  "Waterproofing",
  "Cleaning Labour",
  "P.O.P Labour",
  "Carpenter",
  "Painter",
  "Electrician",
  "Masson",
  "Helper",
  "Fabricators",
];

interface LaborTableProps {
  selectedDate: Date;
  userRole: "administrator" | "supervisor";
  projectId: string;
}

export default function LaborTable({
  selectedDate,
  userRole,
  projectId,
}: LaborTableProps) {
  const [entries, setEntries] = useState<LaborEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newContractorName, setNewContractorName] = useState("");

  const addRow = () => {
    if (userRole !== "administrator" || !newContractorName.trim()) return;
    const newEntry: LaborEntry = {
      contractor: newContractorName.trim(),
      values: AVAILABLE_CATEGORIES.reduce((acc, category) => {
        acc[category] = 0;
        return acc;
      }, {} as { [key: string]: number }),
    };
    setEntries([...entries, newEntry]);
    setNewContractorName("");
  };
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isEditable = userRole === "supervisor" ? isToday(selectedDate) : true;

  const updateValue = (contractor: string, category: string, value: string) => {
    if (userRole !== "supervisor") return;
    if (!isEditable) return;
    const numValue = value === "" ? 0 : Math.max(0, parseInt(value) || 0);
    setEntries(
      entries.map((entry) =>
        entry.contractor === contractor
          ? { ...entry, values: { ...entry.values, [category]: numValue } }
          : entry
      )
    );
  };

  const deleteRow = (contractorToDelete: string) => {
    if (userRole !== "administrator") return;
    setEntries(
      entries.filter((entry) => entry.contractor !== contractorToDelete)
    );
  };
  const fetchEntriesForDate = async () => {
    try {
      console.log("Fetch entries for date:", selectedDate);

      // Check if required variables are available
      if (!projectId || !selectedDate) {
        console.warn("Project ID or selected date is missing");
        return;
      }

      // Create a formatted Date object without the time portion
      const formattedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );

      const day = String(formattedDate.getDate()).padStart(2, "0");
      const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
      const year = String(formattedDate.getFullYear()).slice(-2);

      const formattedDateString = `${day}/${month}/${year}`;
      console.log("Formatted date:", formattedDateString);

      const entriesCollectionRef = collection(
        db,
        "projects",
        projectId,
        "entries"
      );

      // Query to find entries where the date matches the selected date
      const q = await query(
        entriesCollectionRef,
        where("date", "==", formattedDateString)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Retrieve the first document's data
        const entryDoc = querySnapshot.docs[0];
        const data = entryDoc.data();
        console.log("Entry data:", data);
        //const x=json.parse(data.entry);
        try {
          // Parse the JSON data from the entry field
          console.log("Entry data:", data.entry);
          const entriesArray = JSON.parse(data.entry);
          console.log("Fetched entries for date:", entriesArray);
          setEntries(entriesArray);
        } catch (parseError) {
          console.error("Error parsing entries data:", parseError);
          setEntries([]);
        }
      } else {
        // No entries found
        console.log("No entries found for the selected date");
        setEntries([]);
      }
    } catch (error) {
      // Handle errors during the query process
      console.error("Error fetching entries:", error);
      setEntries([]);
    }
  };

  // Removed updateCategory function as it references a non-existent 'id' property on 'LaborEntry'
  useEffect(() => {
    console.log("useEffect called");
    fetchEntriesForDate();
  }, [selectedDate]);

  //projectId, selectedDate
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Format the date
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = String(selectedDate.getFullYear()).slice(-2);
      const formattedDate = `${day}/${month}/${year}`;

      // Reference to the collection
      const entriesCollectionRef = collection(
        db,
        "projects",
        projectId,
        "entries"
      );

      // Query to find entries where the date matches the selected date
      const q = query(entriesCollectionRef, where("date", "==", formattedDate));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update the existing document
        const docRef = querySnapshot.docs[0].ref; // Get the first matching document's reference
        await updateDoc(docRef, {
          entry: JSON.stringify(entries),
        });
      } else {
        // Create a new document
        await addDoc(entriesCollectionRef, {
          date: formattedDate,
          entry: JSON.stringify(entries),
        });
      }

      setIsSaving(false);
    } catch (error) {
      console.error("Error saving entries:", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="overflow-x-auto border rounded-lg">
        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-20 w-[200px] bg-background">
                  Contractor
                </TableHead>
                {AVAILABLE_CATEGORIES.map((category) => (
                  <TableHead key={category} className="min-w-[100px]">
                    {category}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow
                  key={entry.contractor}
                  className={index % 2 === 0 ? "bg-muted/50" : ""}
                >
                  <TableCell className="sticky left-0 z-10 w-[200px] bg-background">
                    <div className="flex items-center justify-between">
                      {entry.contractor}
                      {userRole === "administrator" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRow(entry.contractor)}
                          aria-label={`Delete ${entry.contractor}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  {AVAILABLE_CATEGORIES.map((category) => (
                    <TableCell key={category}>
                      <Input
                        type="number"
                        min="0"
                        value={
                          entry.values[category] === 0
                            ? ""
                            : entry.values[category]
                        }
                        onChange={(e) =>
                          updateValue(
                            entry.contractor,
                            category,
                            e.target.value
                          )
                        }
                        className="w-full"
                        readOnly={!isEditable}
                        inputMode={isEditable ? "numeric" : undefined}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell className="sticky left-0 z-10 w-[200px] bg-background">
                  Total
                </TableCell>
                {AVAILABLE_CATEGORIES.map((category) => (
                  <TableCell key={category}>
                    {entries.reduce(
                      (sum, entry) => sum + (entry.values[category] || 0),
                      0
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      {userRole === "supervisor" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <Button
            onClick={handleSave}
            disabled={isSaving || !isEditable}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
      {userRole === "administrator" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Row
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Contractor</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Enter contractor name"
                    value={newContractorName}
                    onChange={(e) => setNewContractorName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={addRow}
                      disabled={!newContractorName.trim()}
                    >
                      Add
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}