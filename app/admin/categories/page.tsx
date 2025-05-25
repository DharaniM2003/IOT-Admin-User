"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProtectedRoute from "@/components/ProtectedRoute"
import { categories as initialCategories } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/lib/types"

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { toast } = useToast()

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: "",
  })

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const category: Category = {
      id: "cat-" + Date.now(),
      name: newCategory.name,
      description: newCategory.description,
      image: newCategory.image || "/placeholder.svg?height=200&width=300",
      productCount: 0,
    }

    setCategories([...categories, category])
    setNewCategory({ name: "", description: "", image: "" })
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "Category added successfully",
    })
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setNewCategory({
      name: category.name,
      description: category.description,
      image: category.image,
    })
  }

  const handleUpdateCategory = () => {
    if (!editingCategory) return

    const updatedCategory: Category = {
      ...editingCategory,
      name: newCategory.name,
      description: newCategory.description,
      image: newCategory.image,
    }

    setCategories(categories.map((c) => (c.id === editingCategory.id ? updatedCategory : c)))
    setEditingCategory(null)
    setNewCategory({ name: "", description: "", image: "" })

    toast({
      title: "Success",
      description: "Category updated successfully",
    })
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((c) => c.id !== categoryId))
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    }
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
              <Link href="/admin/users" className="text-gray-600 hover:text-blue-600 pb-2">
                Users
              </Link>
              <Link href="/admin/categories" className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">
                Categories
              </Link>
            </nav>
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600">Manage product categories and organization</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Enter category description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={newCategory.image}
                      onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <Badge variant="outline">{category.productCount} products</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Dialog
                          open={editingCategory?.id === category.id}
                          onOpenChange={(open) => !open && setEditingCategory(null)}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-name">Category Name</Label>
                                <Input
                                  id="edit-name"
                                  value={newCategory.name}
                                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  value={newCategory.description}
                                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                  rows={3}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-image">Image URL</Label>
                                <Input
                                  id="edit-image"
                                  value={newCategory.image}
                                  onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateCategory}>Update Category</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Link href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
                        <Button size="sm" variant="ghost">
                          View Products
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
