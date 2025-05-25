"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { products as initialProducts, categories } from "@/lib/mock-data"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stockCount: "",
    brand: "",
  })

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const product: Product = {
      id: "prod-" + Date.now(),
      name: newProduct.name,
      description: newProduct.description,
      price: Number.parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop",
      images: [newProduct.image || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop"],
      inStock: true,
      stockCount: Number.parseInt(newProduct.stockCount) || 0,
      rating: 4.0,
      reviews: 0,
      specifications: {},
      features: [],
      brand: newProduct.brand,
      tags: [],
    }

    setProducts([...products, product])
    setNewProduct({ name: "", description: "", price: "", category: "", image: "", stockCount: "", brand: "" })
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "Product added successfully",
    })
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stockCount: product.stockCount.toString(),
      brand: product.brand,
    })
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return

    const updatedProduct: Product = {
      ...editingProduct,
      name: newProduct.name,
      description: newProduct.description,
      price: Number.parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image,
      stockCount: Number.parseInt(newProduct.stockCount),
      brand: newProduct.brand,
    }

    setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)))
    setEditingProduct(null)
    setNewProduct({ name: "", description: "", price: "", category: "", image: "", stockCount: "", brand: "" })

    toast({
      title: "Success",
      description: "Product updated successfully",
    })
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId))
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    }
  }

  const toggleProductStatus = (productId: string) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p)))
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
              <Link href="/admin/products" className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">
                Products
              </Link>
              <Link href="/admin/orders" className="text-gray-600 hover:text-blue-600 pb-2">
                Orders
              </Link>
              <Link href="/admin/users" className="text-gray-600 hover:text-blue-600 pb-2">
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
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">Manage your product catalog</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      placeholder="Enter brand name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Count</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stockCount}
                      onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct}>Add Product</Button>
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
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Products ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Product</th>
                      <th className="text-left p-4 font-medium text-gray-900">Category</th>
                      <th className="text-left p-4 font-medium text-gray-900">Price</th>
                      <th className="text-left p-4 font-medium text-gray-900">Stock</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{product.category}</Badge>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">${product.price}</p>
                            {product.originalPrice && (
                              <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                product.stockCount > 10
                                  ? "bg-green-500"
                                  : product.stockCount > 0
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            ></div>
                            <span>{product.stockCount}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={product.inStock ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => toggleProductStatus(product.id)}
                          >
                            {product.inStock ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Dialog
                              open={editingProduct?.id === product.id}
                              onOpenChange={(open) => !open && setEditingProduct(null)}
                            >
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Product</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-name">Product Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={newProduct.name}
                                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-brand">Brand</Label>
                                    <Input
                                      id="edit-brand"
                                      value={newProduct.brand}
                                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-price">Price</Label>
                                    <Input
                                      id="edit-price"
                                      type="number"
                                      step="0.01"
                                      value={newProduct.price}
                                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select
                                      value={newProduct.category}
                                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {categories.map((cat) => (
                                          <SelectItem key={cat.id} value={cat.name}>
                                            {cat.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-stock">Stock Count</Label>
                                    <Input
                                      id="edit-stock"
                                      type="number"
                                      value={newProduct.stockCount}
                                      onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-image">Image URL</Label>
                                    <Input
                                      id="edit-image"
                                      value={newProduct.image}
                                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                      id="edit-description"
                                      value={newProduct.description}
                                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                      rows={3}
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2 mt-4">
                                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleUpdateProduct}>Update Product</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteProduct(product.id)}
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
