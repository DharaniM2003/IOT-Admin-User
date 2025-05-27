import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap, Shield, Truck, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/Header"
import ProductCard from "@/components/ProductCard"
import { featuredProducts, categories } from "@/lib/mock-data"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Build the Future with
                <span className="text-yellow-400"> IoT Hardware</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover cutting-edge microcontrollers, sensors, and development boards to bring your innovative
                projects to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="IoT Hardware Collection"
                width={500}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our IoT Hardware Store?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide high-quality components and exceptional service to help you succeed in your IoT projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Latest Technology",
                description: "Cutting-edge components from leading manufacturers",
              },
              {
                icon: Shield,
                title: "Quality Guaranteed",
                description: "All products tested and verified for reliability",
              },
              {
                icon: Truck,
                title: "Fast Shipping",
                description: "Quick delivery to get your projects started",
              },
              {
                icon: Headphones,
                title: "Expert Support",
                description: "24/7 technical support from IoT specialists",
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">Discover our most popular IoT hardware components</p>
            </div>
            <Link href="/shop">
              <Button variant="outline">
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Find exactly what you need for your IoT project</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.id} href={`/category/${category.name.toLowerCase()}`}>
                <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardContent className="p-0">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{category.description}</p>
                      <p className="text-sm text-blue-600 font-medium">{category.productCount} products</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated with Latest IoT Trends</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for product updates, tutorials, and exclusive offers.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IoT</span>
                </div>
                <span className="font-bold text-xl">Hardware Store</span>
              </div>
              <p className="text-gray-400">Your trusted partner for IoT hardware components and development tools.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/shop" className="hover:text-white">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-white">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/deals" className="hover:text-white">
                    Deals
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 IoT Hardware Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
