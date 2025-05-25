"use client"

import { useState, useEffect } from "react"
import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/Header"
import ProductCard from "@/components/ProductCard"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function WishlistPage() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])

  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`)
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist))
      }
    }
  }, [user])

  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== productId)
    setWishlistItems(updatedWishlist)
    if (user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist))
    }

    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    })
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product)
  }

  return (
    <ProtectedRoute requireAuth>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wishlist</h1>
            <p className="text-gray-600">Save your favorite items for later</p>
          </div>

          {wishlistItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">Start adding items you love to your wishlist.</p>
                <Button onClick={() => (window.location.href = "/shop")}>Start Shopping</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
