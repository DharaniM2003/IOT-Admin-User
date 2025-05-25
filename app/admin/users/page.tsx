"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, UserPlus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const { toast } = useToast()

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user" as "user" | "admin",
    phone: "",
  })

  useEffect(() => {
    // Load actual users from localStorage who have registered/logged in
    const registeredUsers: User[] = []

    // Get current user from localStorage
    const currentUser = localStorage.getItem("user")
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        registeredUsers.push(user)
      } catch (error) {
        console.error("Error parsing current user:", error)
      }
    }

    // Get any other users from a users storage (if implemented)
    const allUsers = localStorage.getItem("allUsers")
    if (allUsers) {
      try {
        const users = JSON.parse(allUsers)
        users.forEach((user: User) => {
          if (!registeredUsers.find((u) => u.id === user.id)) {
            registeredUsers.push(user)
          }
        })
      } catch (error) {
        console.error("Error parsing all users:", error)
      }
    }

    // Add admin user if not present
    if (!registeredUsers.find((u) => u.email === "admin@iot-store.com")) {
      registeredUsers.push({
        id: "admin-1",
        email: "admin@iot-store.com",
        name: "Admin User",
        role: "admin",
        createdAt: new Date("2024-01-01"),
        phone: "+1-555-0101",
        address: {
          street: "123 Admin St",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "USA",
        },
      })
    }

    setUsers(registeredUsers)
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Check if user already exists
    if (users.find((u) => u.email === newUser.email)) {
      toast({
        title: "Error",
        description: "User with this email already exists",
        variant: "destructive",
      })
      return
    }

    const user: User = {
      id: "user-" + Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      createdAt: new Date(),
    }

    const updatedUsers = [...users, user]
    setUsers(updatedUsers)

    // Save to localStorage
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

    setNewUser({ name: "", email: "", role: "user", phone: "" })
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "User added successfully",
    })
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
    })
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    const updatedUser: User = {
      ...editingUser,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
    }

    const updatedUsers = users.map((u) => (u.id === editingUser.id ? updatedUser : u))
    setUsers(updatedUsers)

    // Save to localStorage
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

    // Update current user if editing current user
    const currentUser = localStorage.getItem("user")
    if (currentUser) {
      const current = JSON.parse(currentUser)
      if (current.id === editingUser.id) {
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    }

    setEditingUser(null)
    setNewUser({ name: "", email: "", role: "user", phone: "" })

    toast({
      title: "Success",
      description: "User updated successfully",
    })
  }

  const deleteUser = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId)

    if (userToDelete?.role === "admin") {
      toast({
        title: "Error",
        description: "Cannot delete admin users",
        variant: "destructive",
      })
      return
    }

    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((user) => user.id !== userId)
      setUsers(updatedUsers)
      localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    }
  }

  const toggleUserRole = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, role: user.role === "admin" ? "user" : "admin" } : user,
    )
    setUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

    toast({
      title: "Success",
      description: "User role updated successfully",
    })
  }

  return (
    <ProtectedRoute requireAuth requireAdmin>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">IoT</span>
                  </div>
                  <span className="font-bold text-xl text-gray-900">Admin Panel</span>
                </Link>
              </div>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Back to Store
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 pb-2">
                Dashboard
              </Link>
              <Link href="/admin/products" className="text-gray-600 hover:text-blue-600 pb-2">
                Products
              </Link>
              <Link href="/admin/orders" className="text-gray-600 hover:text-blue-600 pb-2">
                Orders
              </Link>
              <Link href="/admin/users" className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">
                Users
              </Link>
              <Link href="/admin/categories" className="text-gray-600 hover:text-blue-600 pb-2">
                Categories
              </Link>
            </nav>
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users</h1>
              <p className="text-gray-600">Manage user accounts and permissions</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "user" | "admin" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>Add User</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">User</th>
                      <th className="text-left p-4 font-medium text-gray-900">Email</th>
                      <th className="text-left p-4 font-medium text-gray-900">Role</th>
                      <th className="text-left p-4 font-medium text-gray-900">Joined</th>
                      <th className="text-left p-4 font-medium text-gray-900">Contact</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-900">{user.email}</p>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={user.role === "admin" ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => toggleUserRole(user.id)}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="p-4">
                          <div>
                            {user.phone && <p className="text-sm">{user.phone}</p>}
                            {user.address && (
                              <p className="text-xs text-gray-500">
                                {user.address.city}, {user.address.state}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Dialog
                              open={editingUser?.id === user.id}
                              onOpenChange={(open) => !open && setEditingUser(null)}
                            >
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit User</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={newUser.name}
                                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      value={newUser.email}
                                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input
                                      id="edit-phone"
                                      value={newUser.phone}
                                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-role">Role</Label>
                                    <select
                                      id="edit-role"
                                      value={newUser.role}
                                      onChange={(e) =>
                                        setNewUser({ ...newUser, role: e.target.value as "user" | "admin" })
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                      <option value="user">User</option>
                                      <option value="admin">Admin</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2 mt-4">
                                  <Button variant="outline" onClick={() => setEditingUser(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleUpdateUser}>Update User</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => deleteUser(user.id)}
                              disabled={user.role === "admin"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
