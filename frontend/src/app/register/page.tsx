'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { states, districts, talukas } from '@/src/data/locations';

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
    state: "",
    district: "",
    taluka: "",
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

  const [errors, setErrors] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
    farmDetails: {
      farmName: string;
      farmSize: string;
      farmLocation: string;
    };
    businessDetails: {
      businessName: string;
      businessType: string;
      businessLocation: string;
    };
  }>({
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
    console.log('Validating form...');
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

    // Enhanced password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character";
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

    // Location validations
     if (!formData.state) {
        // Assuming state selection is required
        isValid = false;
        // You might want to add an error message for state as well
    }
     if (!formData.district) {
        // Assuming district selection is required
         isValid = false;
         // You might want to add an error message for district as well
     }
     if (!formData.taluka) {
        // Assuming taluka selection is required
         isValid = false;
         // You might want to add an error message for taluka as well
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
     console.log('Validation errors:', newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Attempting to submit registration form.');
    const isFormValid = validateForm();
    console.log('Form validation result:', isFormValid);

    if (!isFormValid) {
      console.log('Form validation failed. Aborting submission.');
      toast.error('Please fill in all required fields correctly.'); // Show a general error message for validation failure
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = userType === 'farmer' 
        ? 'http://localhost:5000/api/auth/register/farmer'
        : 'http://localhost:5000/api/auth/register/buyer';
      
      console.log('Sending registration request to endpoint:', endpoint);
      console.log('Request payload:', JSON.stringify({ // Log payload, but exclude password for security
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          state: formData.state,
          district: formData.district,
          taluka: formData.taluka,
          ...(userType === 'farmer' 
            ? { farmDetails: formData.farmDetails }
            : { businessDetails: formData.businessDetails }
          )
        }));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password, // Include password in actual body
          phone: formData.phone,
          address: formData.address,
          state: formData.state,
          district: formData.district,
          taluka: formData.taluka,
          ...(userType === 'farmer' 
            ? { farmDetails: formData.farmDetails }
            : { businessDetails: formData.businessDetails }
          )
        }),
      });
      
      console.log('Registration API response status:', response.status);
      const data = await response.json();
      console.log('Registration API response data:', data);

      if (!response.ok) {
        console.error('Registration failed on backend:', data.message);
        throw new Error(data.message || 'Registration failed');
      }

      console.log('Registration successful. User data:', data.user);
      console.log('User role:', data.user.role);

      // Store token and user in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Show success message
      toast.success(data.message);

      // Redirect based on role
      if (data.user && data.user.role === 'farmer') {
        console.log('Redirecting to /farmerdashboard');
        router.push('/farmerdashboard');
      } else if (data.user && data.user.role === 'buyer') {
        console.log('Redirecting to /buyersdashboard');
        router.push('/buyersdashboard');
      } else {
        console.log('Unknown user role or user data missing. Redirecting to home.');
        router.push('/'); // Fallback redirect
      }
    } catch (error: any) {
      console.error('Registration submission error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('Registration process finished.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('farmDetails.') || name.startsWith('businessDetails.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as 'farmDetails' | 'businessDetails']),
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
    const fieldName = name.includes('.') ? name.split('.')[1] : name;
    if (errors[fieldName as keyof typeof errors] || (name.includes('.') && errors[name.split('.')[0] as keyof typeof errors]?.[fieldName as keyof typeof errors[keyof typeof errors]])) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (name.includes('.')) {
          const [parent, child] = name.split('.');
          if (parent === 'farmDetails') {
            newErrors.farmDetails = { ...newErrors.farmDetails, [child]: "" };
          } else if (parent === 'businessDetails') {
            newErrors.businessDetails = { ...newErrors.businessDetails, [child]: "" };
          }
        } else {
          (newErrors as any)[name] = "";
        }
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50/50 via-white to-amber-50/30 py-12">
       <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Agro<span className="text-green-600">Smart</span>
          </Link>
          <CardTitle className="mt-6 text-2xl">
            Join as {userType === "farmer" ? "Farmer" : "Buyer"}
          </CardTitle>
          <p className="text-gray-600">Create your AgroSmart account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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
  
              <div className="space-y-2">
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
  
              <div className="space-y-2">
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
  
              <div className="space-y-2">
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
  
              <div className="space-y-2">
                <Label>State</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value, district: '', taluka: '' })}
                  required // Make state required
                >
                  <SelectTrigger className={errors.address && !formData.state ? "border-red-500" : ""}> {/* Basic highlighting for missing required state */}
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {errors.address && !formData.state && <p className="text-red-500 text-sm mt-1">State is required</p>} {/* Error message for state */}
              </div>
  
              <div className="space-y-2">
                <Label>District</Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => setFormData({ ...formData, district: value, taluka: '' })}
                  disabled={!formData.state}
                   required // Make district required
                >
                  <SelectTrigger className={errors.address && !formData.district && formData.state ? "border-red-500" : ""}> {/* Basic highlighting for missing required district */}
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.state && districts[formData.state]?.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {errors.address && !formData.district && formData.state && <p className="text-red-500 text-sm mt-1">District is required</p>} {/* Error message for district */}
              </div>
  
              <div className="space-y-2">
                <Label>Taluka</Label>
                <Select
                  value={formData.taluka}
                  onValueChange={(value) => setFormData({ ...formData, taluka: value })}
                  disabled={!formData.district}
                   required // Make taluka required
                >
                  <SelectTrigger className={errors.address && !formData.taluka && formData.district ? "border-red-500" : ""}> {/* Basic highlighting for missing required taluka */}
                    <SelectValue placeholder="Select Taluka" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.district && talukas[formData.district]?.map((taluka) => (
                      <SelectItem key={taluka} value={taluka}>
                        {taluka}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {errors.address && !formData.taluka && formData.district && <p className="text-red-500 text-sm mt-1">Taluka is required</p>} {/* Error message for taluka */}
              </div>
            </div>
  
            {userType === 'farmer' ? (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Farm Details</h3>
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
              </div>
            ) : (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Business Details</h3>
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
              </div>
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
                placeholder="Create a password (min. 8 characters, uppercase, lowercase, number, special character)"
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
        </CardContent>
       </Card>
    </div>
  );
};

export default Register;
