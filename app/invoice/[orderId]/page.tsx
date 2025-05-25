"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/Header"
import type { Order } from "@/lib/types"

export default function InvoicePage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const foundOrder = orders.find((o: Order) => o.id === orderId)
    setOrder(foundOrder)
  }, [orderId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real application, you would generate a PDF here
    // For demo purposes, we'll just trigger the print dialog
    window.print()
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h1>
            <p className="text-gray-600">The invoice you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="print:hidden">
        <Header />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Print Actions */}
        <div className="flex justify-end space-x-4 mb-8 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Invoice */}
        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">IoT</span>
                  </div>
                  <span className="font-bold text-2xl text-gray-900">Hardware Store</span>
                </div>
                <div className="text-gray-600">
                  <p>123 Tech Street</p>
                  <p>San Francisco, CA 94105</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Email: support@iot-store.com</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <div className="text-gray-600">
                  <p>
                    <strong>Invoice #:</strong> INV-{order.id}
                  </p>
                  <p>
                    <strong>Order #:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
              <div className="text-gray-700">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 font-semibold">Description</th>
                    <th className="text-center py-3 font-semibold">Qty</th>
                    <th className="text-right py-3 font-semibold">Unit Price</th>
                    <th className="text-right py-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">{item.product.description}</p>
                        </div>
                      </td>
                      <td className="text-center py-3">{item.quantity}</td>
                      <td className="text-right py-3">${item.product.price.toFixed(2)}</td>
                      <td className="text-right py-3">${(item.product.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-2 text-lg font-semibold">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Method:</h3>
                  <p className="text-gray-600 capitalize">{order.paymentMethod.replace("_", " ")}</p>
                  {order.paymentMethod === "card" && <p className="text-gray-600">Card ending in ****</p>}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Status:</h3>
                  <p className="text-gray-600 capitalize">{order.status}</p>
                  {order.trackingNumber && <p className="text-gray-600">Tracking: {order.trackingNumber}</p>}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
              <p className="mb-2">Thank you for your business!</p>
              <p className="text-sm">
                For questions about this invoice, contact us at support@iot-store.com or (555) 123-4567
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
