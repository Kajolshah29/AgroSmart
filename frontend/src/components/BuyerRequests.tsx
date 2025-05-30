import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'react-hot-toast';

interface BuyerRequest {
  _id: string;
  buyerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  paymentDetails?: {
    paymentId: string;
    orderId: string;
  };
}

const BuyerRequests = () => {
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view requests');
        return;
      }

      const response = await fetch('http://localhost:5000/api/orders/farmer', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load buyer requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'accepted' | 'rejected' | 'completed') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('Status updated successfully');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading requests...</div>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">No Buyer Requests</h3>
          <p className="text-gray-500">You haven't received any purchase requests yet</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Buyer Requests</h2>
      {requests.map((request) => (
        <Card key={request._id} className="p-4">
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{request.buyerDetails.name}</h3>
                  <p className="text-sm text-gray-500">{request.buyerDetails.email}</p>
                  <p className="text-sm text-gray-500">{request.buyerDetails.phone}</p>
                  <p className="text-sm text-gray-500">
                    Order Date: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={
                    request.status === 'pending'
                      ? 'default'
                      : request.status === 'accepted'
                      ? 'success'
                      : request.status === 'rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Order Items:</h4>
                {request.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{request.totalAmount}</span>
                  </div>
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStatusUpdate(request._id, 'accepted')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(request._id, 'rejected')}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              )}

              {request.status === 'accepted' && (
                <Button
                  onClick={() => handleStatusUpdate(request._id, 'completed')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Mark as Completed
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BuyerRequests; 