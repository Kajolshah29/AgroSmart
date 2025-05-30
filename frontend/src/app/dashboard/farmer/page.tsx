'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BuyerRequests from '@/src/components/BuyerRequests';
import { Card } from '@/src/components/ui/card';
import { toast } from 'react-hot-toast';

const FarmerDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to access the dashboard');
        router.push('/login');
        return;
      }

      // Verify user role
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      if (data.role !== 'farmer') {
        toast.error('Access denied. Farmer account required.');
        router.push('/');
        return;
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      toast.error('Authentication failed');
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Farmer Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <BuyerRequests />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">₹0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="text-center text-gray-500">
              No recent activity
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard; 