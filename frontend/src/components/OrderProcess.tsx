import { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface OrderProcessProps {
    product: {
        id: string;
        name: string;
        price: number;
        farmerAddress: string;
    };
    onOrderComplete: () => void;
}

const OrderProcess = ({ product, onOrderComplete }: OrderProcessProps) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleOrder = async () => {
        try {
            setLoading(true);
            
            // Create order
            const orderRes = await fetch('http://localhost:5000/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    farmerAddress: product.farmerAddress,
                    productId: product.id,
                    quantity,
                    amount: product.price * quantity
                })
            });

            const orderData = await orderRes.json();
            
            if (!orderData.success) {
                throw new Error(orderData.message);
            }

            // Process payment
            const paymentRes = await fetch(`http://localhost:5000/api/orders/pay/${orderData.orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    amount: product.price * quantity
                })
            });

            const paymentData = await paymentRes.json();
            
            if (!paymentData.success) {
                throw new Error(paymentData.message);
            }

            toast({
                title: "Order Successful!",
                description: "Your order has been placed and payment processed.",
            });

            onOrderComplete();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to process order",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Place Order</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price per unit:</span>
                        <span>₹{product.price}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Quantity:</span>
                        <span>{quantity}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount:</span>
                        <span>₹{product.price * quantity}</span>
                    </div>
                </div>

                <Button
                    onClick={handleOrder}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </Button>
            </div>
        </div>
    );
};

export default OrderProcess; 