'use client';

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import React from 'react';

interface BaseUserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

interface FarmerData extends BaseUserData {
  farmDetails: {
    farmName: string;
    farmSize: string;
    farmLocation: string;
    crops: string[];
  };
}

interface BuyerData extends BaseUserData {
  businessDetails: {
    businessName: string;
    businessType: string;
    businessLocation: string;
    preferredProducts: string[];
  };
}

type UserData = FarmerData | BuyerData;

const Profile = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userType, setUserType] = useState<'farmer' | 'buyer'>('farmer');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data.user);
        setUserType(data.user.role);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (field: string, value: string, parentField?: string) => {
    if (!userData) return;

    if (parentField) {
      if (userType === 'farmer' && parentField === 'farmDetails') {
        setUserData(prev => ({
          ...prev!,
          farmDetails: {
            ...(prev as FarmerData).farmDetails,
            [field]: value
          }
        } as FarmerData));
      } else if (userType === 'buyer' && parentField === 'businessDetails') {
        setUserData(prev => ({
          ...prev!,
          businessDetails: {
            ...(prev as BuyerData).businessDetails,
            [field]: value
          }
        } as BuyerData));
      }
    } else {
      setUserData(prev => ({ ...prev!, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!userData) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <Button onClick={() => router.push('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const dashboardRoute = userType === 'farmer' ? '/farmerdashboard' : '/buyersdashboard';
  const avatarUrl = `https://api.dicebear.com/7.x/avatars/svg?seed=${userData.name}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    <div className={`min-h-screen ${userType === 'farmer' ? 'bg-gradient-to-br from-green-50/50 via-white to-amber-50/30' : 'bg-gradient-to-br from-blue-50/50 via-white to-green-50/30'}`}>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.push(dashboardRoute)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          </div>

          <div className="text-center mb-6">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={avatarUrl} alt={userData.name} />
              <AvatarFallback className="text-2xl">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-xl font-semibold text-gray-900">{userData.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Save className="w-4 h-4" onClick={handleSave} /> : <Edit className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-gray-600 capitalize">{userType}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{userData.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    value={userData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{userData.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{userData.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={userData.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{userData.address}</p>
                )}
              </div>

              {userType === 'farmer' && (
                <>
                  <div>
                    <Label htmlFor="farmName">Farm Name</Label>
                    {isEditing ? (
                      <Input
                        id="farmName"
                        value={(userData as FarmerData).farmDetails.farmName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('farmName', e.target.value, 'farmDetails')}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{(userData as FarmerData).farmDetails.farmName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="farmSize">Farm Size</Label>
                    {isEditing ? (
                      <Input
                        id="farmSize"
                        value={(userData as FarmerData).farmDetails.farmSize}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('farmSize', e.target.value, 'farmDetails')}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{(userData as FarmerData).farmDetails.farmSize}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="farmLocation">Farm Location</Label>
                    {isEditing ? (
                      <Input
                        id="farmLocation"
                        value={(userData as FarmerData).farmDetails.farmLocation}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('farmLocation', e.target.value, 'farmDetails')}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{(userData as FarmerData).farmDetails.farmLocation}</p>
                    )}
                  </div>
                </>
              )}

              {userType === 'buyer' && (
                <>
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    {isEditing ? (
                      <Input
                        id="businessName"
                        value={(userData as BuyerData).businessDetails.businessName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('businessName', e.target.value, 'businessDetails')}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{(userData as BuyerData).businessDetails.businessName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    {isEditing ? (
                      <Input
                        id="businessType"
                        value={(userData as BuyerData).businessDetails.businessType}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('businessType', e.target.value, 'businessDetails')}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{(userData as BuyerData).businessDetails.businessType}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="businessLocation">Business Location</Label>
                    {isEditing ? (
                      <Input
                        id="businessLocation"
                        value={(userData as BuyerData).businessDetails.businessLocation}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('businessLocation', e.target.value, 'businessDetails')}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{(userData as BuyerData).businessDetails.businessLocation}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <Label>Member Since</Label>
                <p className="mt-1 text-gray-900">{new Date(userData.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={handleSave} 
                className={`flex-1 ${userType === 'farmer' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;