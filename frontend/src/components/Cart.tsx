'use client';

import React, { useState } from 'react';
import { useCart } from '@/src/context/CartContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Minus, Plus, Trash2, X, Info, CreditCard, Wallet, Banknote, QrCode } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';

const DELIVERY_CHARGES = 50; // ₹50 delivery charges
const GST_RATE = 0.18; // 18% GST

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  const subtotal = totalAmount;
  const gst = subtotal * GST_RATE;
  const deliveryFee = items.length > 0 ? DELIVERY_CHARGES : 0;
  const total = subtotal + gst + deliveryFee;

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to checkout');
        return;
      }

      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        paymentMethod,
        paymentDetails: paymentMethod === 'card' ? cardDetails : undefined
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      toast.success('Order placed successfully!');
      clearCart();
      setShowCheckout(false);
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  if (items.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
          <p className="text-gray-500">Add some products to your cart to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-red-500 hover:text-red-700"
            >
              Clear Cart
            </Button>
          </div>

          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <img
                      src={`http://localhost:5000/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500">₹{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowProductDetails(item.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="border-t pt-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Charges</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </Card>

      {/* Product Details Dialog */}
      <Dialog open={!!showProductDetails} onOpenChange={() => setShowProductDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {showProductDetails && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <img
                  src={`http://localhost:5000/${items.find(item => item.id === showProductDetails)?.image}`}
                  alt="Product"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  {items.find(item => item.id === showProductDetails)?.name}
                </h3>
                <p className="text-gray-600">
                  {items.find(item => item.id === showProductDetails)?.description}
                </p>
                <div className="space-y-2">
                  <p className="text-lg font-bold">
                    ₹{items.find(item => item.id === showProductDetails)?.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {items.find(item => item.id === showProductDetails)?.quantity}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="font-semibold">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => setPaymentMethod('upi')}
                >
                  <QrCode className="h-6 w-6 mb-2" />
                  <span className="text-sm">UPI</span>
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span className="text-sm">Card</span>
                </Button>
                <Button
                  variant={paymentMethod === 'cod' ? 'default' : 'outline'}
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => setPaymentMethod('cod')}
                >
                  <Banknote className="h-6 w-6 mb-2" />
                  <span className="text-sm">COD</span>
                </Button>
              </div>
            </div>

            {/* Payment Details */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                <div className="text-center">
                  <img
                    src="/images/upi-qr.png"
                    alt="UPI QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Scan QR code to pay using any UPI app
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      maxLength={3}
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  Pay ₹{total.toFixed(2)} in cash when your order arrives
                </p>
              </div>
            )}

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleCheckout}
            >
              Place Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cart; 