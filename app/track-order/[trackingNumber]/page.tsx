"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import type { Order } from "@/lib/types"

interface TrackingEvent {
  date: string
  time: string
  status: string
  location: string
  description: string
}

export default function TrackOrderPage() {
  const params = useParams()
  const trackingNumber = params.trackingNumber as string
  const [order, setOrder] = useState<Order | null>(null)
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([])

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const foundOrder = orders.find((o: Order) => o.trackingNumber === trackingNumber)
    setOrder(foundOrder)

    // Generate mock tracking events
    if (foundOrder) {
      const events: TrackingEvent[] = [
        {
          date: new Date(foundOrder.createdAt).toLocaleDateString(),
          time: new Date(foundOrder.createdAt).toLocaleTimeString(),
          status: "Order Placed",
          location: "Online",
          description: "Your order has been placed and is being processed",
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          time: "10:30 AM",
          status: "Processing",
          location: "Warehouse - San Francisco, CA",
          description: "Your order is being prepared for shipment",
        },
      ]

      if (foundOrder.status === "shipped" || foundOrder.status === "delivered") {
        events.push({
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          time: "2:15 PM",
          status: "Shipped",
          location: "Distribution Center - Oakland, CA",
          description: "Your package has been shipped and is on its way",
        })
      }

      if (foundOrder.status === "delivered") {
        events.push({
          date: new Date().toLocaleDateString(),
          time: "11:45 AM",
          status: "Delivered",
          location: foundOrder.shippingAddress.city + ", " + foundOrder.shippingAddress.state,
          description: "Package delivered successfully",
        })
      }

      setTrackingEvents(events.reverse())
    }
  }, [trackingNumber])

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tracking Number Not Found</h1>
            <p className="text-gray-600 mb-8">Please check your tracking number and try again.</p>
            <Link href="/orders">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case "shipped":
        return <Truck className="w-6 h-6 text-blue-500" />
      case "processing":
        return <Package className="w-6 h-6 text-yellow-500" />
      default:
        return <Clock className="w-6 h-6 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Tracking Number: <span className="font-mono font-medium">{trackingNumber}</span>
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order {order.id}</span>
              <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-medium">
                  {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : "TBD"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-700">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {trackingEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{getStatusIcon(event.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{event.status}</h3>
                      <div className="text-sm text-gray-500">
                        {event.date} at {event.time}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link href={`/order-confirmation/${order.id}`}>
            <Button variant="outline">View Order Details</Button>
          </Link>
          <Link href="/orders">
            <Button variant="outline">All Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
