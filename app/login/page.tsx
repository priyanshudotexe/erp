// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// interface User {
//   username: string;
//   role: 'administrator' | 'supervisor';
//   assignedProject?: string;
// }

// const MOCK_USERS: User[] = [
//   { username: "admin", role: "administrator" },
//   {
//     username: "supervisor1",
//     role: "supervisor",
//     assignedProject: "dy9nWi6S6NiTVJwR8cif",
//   },
//   {
//     username: "supervisor2",
//     role: "supervisor",
//     assignedProject: "fr04IrYvjOYs9gCQQeJA",
//   },
// ];

// export default function LoginPage() {
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setError('')

//     const user = MOCK_USERS.find(u => u.username === username)
//     if (user && password === 'password') { // In a real app, use proper authentication
//       if (user.role === 'administrator') {
//         router.push('/projects')
//       } else {
//         router.push(`/projects/${user.assignedProject}`)
//       }
//     } else {
//       setError('Invalid username or password')
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl text-center">Login to ERP System</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <label htmlFor="username" className="text-sm font-medium">
//                 Username
//               </label>
//               <Input
//                 id="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="password" className="text-sm font-medium">
//                 Password
//               </label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             <Button type="submit" className="w-full">
//               Login
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const MOCK_USERS=[
    { username: "admin", role: "administrator" },
    {
      username: "supervisor1",
      role: "supervisor",
      assignedProject: "dy9nWi6S6NiTVJwR8cif",
    },
    {
      username: "supervisor2",
      role: "supervisor",
      assignedProject: "fr04IrYvjOYs9gCQQeJA",
    },
  ];


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const success = login(username, password);
    if (success) {const user = MOCK_USERS.find((u) => u.username === username);
    if (user?.role === "administrator") {
      router.push("/projects");
    } else if (user?.role === "supervisor" && user.assignedProject) {
      router.push(`/projects/${user.assignedProject}`);
    }
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Login to ERP System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

