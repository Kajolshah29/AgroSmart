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
import { loadRazorpay, initiatePayment } from '@/src/lib/razorpay';

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
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = totalAmount;
  const gst = subtotal * GST_RATE;
  const deliveryFee = items.length > 0 ? DELIVERY_CHARGES : 0;
  const total = subtotal + gst + deliveryFee;

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to checkout');
        return;
      }

      // Get user details from localStorage
      const userDetails = JSON.parse(localStorage.getItem('user') || '{}');

      // Create order data
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        totalAmount: total,
        buyerDetails: {
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone
        },
        paymentMethod,
        status: 'pending'
      };

      // Create order in backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create order' }));
        throw new Error(errorData.message || 'Failed to create order');
      }

      const orderResult = await response.json();

      // Process payment based on selected method
      if (paymentMethod === 'card') {
        try {
          // Load Razorpay script
          await loadRazorpay();

          // Initiate Razorpay payment
          const paymentResult = await initiatePayment(total * 100); // Convert to paise

          if (!paymentResult.success) {
            throw new Error('Payment failed');
          }

          // Update order with payment details
          const paymentResponse = await fetch(`http://localhost:5000/api/orders/${orderResult.orderId}/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              paymentId: paymentResult.paymentId,
              orderId: paymentResult.orderId
            })
          });

          if (!paymentResponse.ok) {
            const errorData = await paymentResponse.json().catch(() => ({ message: 'Failed to update payment details' }));
            throw new Error(errorData.message || 'Failed to update payment details');
          }
        } catch (error) {
          console.error('Payment processing error:', error);
          toast.error(error instanceof Error ? error.message : 'Payment processing failed');
          return;
        }
      } else if (paymentMethod === 'cod') {
        // For COD, just update the order status
        const codResponse = await fetch(`http://localhost:5000/api/orders/${orderResult.orderId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'pending', paymentMethod: 'cod' })
        });

        if (!codResponse.ok) {
          const errorData = await codResponse.json().catch(() => ({ message: 'Failed to update order status' }));
          throw new Error(errorData.message || 'Failed to update order status');
        }
      }

      toast.success('Order placed successfully!');
      clearCart();
      setShowCheckout(false);
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsLoading(false);
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {item.image && (
                      <img
                        src={`http://localhost:5000/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500">₹{item.price} per unit</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <span className="ml-4 text-sm text-gray-600">
                          Total: ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
        <DialogContent className="max-w-2xl bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Review your order and select a payment method
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
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
                    <span>Total Amount</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                  className={`flex flex-col items-center p-4 h-auto ${
                    paymentMethod === 'upi' ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <QrCode className="w-6 h-6 mb-2" />
                  <span>UPI</span>
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  className={`flex flex-col items-center p-4 h-auto ${
                    paymentMethod === 'card' ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="w-6 h-6 mb-2" />
                  <span>Card</span>
                </Button>
                <Button
                  variant={paymentMethod === 'cod' ? 'default' : 'outline'}
                  className={`flex flex-col items-center p-4 h-auto ${
                    paymentMethod === 'cod' ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <Wallet className="w-6 h-6 mb-2" />
                  <span>Cash on Delivery</span>
                </Button>
              </div>
            </div>

            {/* Card Details Form (shown only when card payment is selected) */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    />
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
                      type="password"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Button */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowCheckout(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cart; 