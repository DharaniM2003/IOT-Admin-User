"use client"

import { Clock, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/Header"
import ProductCard from "@/components/ProductCard"
import { saleProducts } from "@/lib/mock-data"
import { useCart } from "@/contexts/CartContext"

export default function DealsPage() {
  const { addToCart } = useCart()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Special Deals & Offers</h1>
              <p className="text-lg opacity-90">Save big on top IoT hardware components</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-yellow-300 mb-2">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-medium">Limited Time</span>
              </div>
              <p className="text-sm opacity-75">Offers valid until stocks last</p>
            </div>
          </div>
        </div>

        {/* Deal Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Tag className="w-5 h-5 mr-2" />
                Flash Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600">Up to 50% off on selected items</p>
              <Badge className="mt-2 bg-blue-600">Limited Stock</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Tag className="w-5 h-5 mr-2" />
                Bundle Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600">Buy 2 get 1 free on sensors</p>
              <Badge className="mt-2 bg-green-600">Best Value</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <Tag className="w-5 h-5 mr-2" />
                Clearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-600">Last chance items at lowest prices</p>
              <Badge className="mt-2 bg-purple-600">Final Sale</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Sale Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Products on Sale</h2>
          {saleProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deals available</h3>
                <p className="text-gray-600">Check back soon for amazing deals and offers!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Promo Codes */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-orange-700">Promo Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-lg">SAVE10</span>
                  <Badge variant="outline">10% OFF</Badge>
                </div>
                <p className="text-sm text-gray-600">Get 10% off on orders above $50</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-lg">FREESHIP</span>
                  <Badge variant="outline">Free Shipping</Badge>
                </div>
                <p className="text-sm text-gray-600">Free shipping on any order</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
