'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "react-hot-toast";

const Register = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("type") || "farmer";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    // Additional fields based on user type
    farmDetails: {
      farmName: "",
      farmSize: "",
      farmLocation: "",
      crops: []
    },
    businessDetails: {
      businessName: "",
      businessType: "",
      businessLocation: "",
      preferredProducts: []
    }
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    farmDetails: {
      farmName: "",
      farmSize: "",
      farmLocation: ""
    },
    businessDetails: {
      businessName: "",
      businessType: "",
      businessLocation: ""
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      farmDetails: {
        farmName: "",
        farmSize: "",
        farmLocation: ""
      },
      businessDetails: {
        businessName: "",
        businessType: "",
        businessLocation: ""
      }
    };

    let isValid = true;

    // Basic validations
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    // Role-specific validations
    if (userType === 'farmer') {
      if (!formData.farmDetails.farmName.trim()) {
        newErrors.farmDetails.farmName = "Farm name is required";
        isValid = false;
      }
      if (!formData.farmDetails.farmSize.trim()) {
        newErrors.farmDetails.farmSize = "Farm size is required";
        isValid = false;
      }
      if (!formData.farmDetails.farmLocation.trim()) {
        newErrors.farmDetails.farmLocation = "Farm location is required";
        isValid = false;
      }
    } else {
      if (!formData.businessDetails.businessName.trim()) {
        newErrors.businessDetails.businessName = "Business name is required";
        isValid = false;
      }
      if (!formData.businessDetails.businessType.trim()) {
        newErrors.businessDetails.businessType = "Business type is required";
        isValid = false;
      }
      if (!formData.businessDetails.businessLocation.trim()) {
        newErrors.businessDetails.businessLocation = "Business location is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = userType === 'farmer' 
        ? 'http://localhost:5000/api/auth/register/farmer'
        : 'http://localhost:5000/api/auth/register/buyer';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          ...(userType === 'farmer' 
            ? { farmDetails: formData.farmDetails }
            : { businessDetails: formData.businessDetails }
          )
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Show success message
      toast.success(data.message);

      // Redirect based on role
      if (data.user.role === 'farmer') {
        router.push('/farmerdashboard');
      } else {
        router.push('/buyersdashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('farmDetails.') || name.startsWith('businessDetails.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50/50 via-white to-amber-50/30 py-12">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Agri<span className="text-green-600">Chain</span>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 mt-6">
              Join as {userType === "farmer" ? "Farmer" : "Buyer"}
            </h2>
            <p className="text-gray-600 mt-2">Create your AgriChain account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your address"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {userType === 'farmer' ? (
              <>
                <div>
                  <Label htmlFor="farmDetails.farmName">Farm Name</Label>
                  <Input
                    id="farmDetails.farmName"
                    name="farmDetails.farmName"
                    type="text"
                    value={formData.farmDetails.farmName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your farm name"
                    className={errors.farmDetails?.farmName ? "border-red-500" : ""}
                  />
                  {errors.farmDetails?.farmName && (
                    <p className="text-red-500 text-sm mt-1">{errors.farmDetails.farmName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="farmDetails.farmSize">Farm Size</Label>
                  <Input
                    id="farmDetails.farmSize"
                    name="farmDetails.farmSize"
                    type="text"
                    value={formData.farmDetails.farmSize}
                    onChange={handleChange}
                    required
                    placeholder="Enter your farm size"
                    className={errors.farmDetails?.farmSize ? "border-red-500" : ""}
                  />
                  {errors.farmDetails?.farmSize && (
                    <p className="text-red-500 text-sm mt-1">{errors.farmDetails.farmSize}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="farmDetails.farmLocation">Farm Location</Label>
                  <Input
                    id="farmDetails.farmLocation"
                    name="farmDetails.farmLocation"
                    type="text"
                    value={formData.farmDetails.farmLocation}
                    onChange={handleChange}
                    required
                    placeholder="Enter your farm location"
                    className={errors.farmDetails?.farmLocation ? "border-red-500" : ""}
                  />
                  {errors.farmDetails?.farmLocation && (
                    <p className="text-red-500 text-sm mt-1">{errors.farmDetails.farmLocation}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="businessDetails.businessName">Business Name</Label>
                  <Input
                    id="businessDetails.businessName"
                    name="businessDetails.businessName"
                    type="text"
                    value={formData.businessDetails.businessName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your business name"
                    className={errors.businessDetails?.businessName ? "border-red-500" : ""}
                  />
                  {errors.businessDetails?.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessDetails.businessName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="businessDetails.businessType">Business Type</Label>
                  <Input
                    id="businessDetails.businessType"
                    name="businessDetails.businessType"
                    type="text"
                    value={formData.businessDetails.businessType}
                    onChange={handleChange}
                    required
                    placeholder="Enter your business type"
                    className={errors.businessDetails?.businessType ? "border-red-500" : ""}
                  />
                  {errors.businessDetails?.businessType && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessDetails.businessType}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="businessDetails.businessLocation">Business Location</Label>
                  <Input
                    id="businessDetails.businessLocation"
                    name="businessDetails.businessLocation"
                    type="text"
                    value={formData.businessDetails.businessLocation}
                    onChange={handleChange}
                    required
                    placeholder="Enter your business location"
                    className={errors.businessDetails?.businessLocation ? "border-red-500" : ""}
                  />
                  {errors.businessDetails?.businessLocation && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessDetails.businessLocation}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password (min. 6 characters)"
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href={`/login?type=${userType}`}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
