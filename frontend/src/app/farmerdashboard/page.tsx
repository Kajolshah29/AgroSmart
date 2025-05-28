"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { User, Home, Settings, LogOut, Edit, Check, Trash2, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import AIChatPopup from "../../components/AIChatPopup";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  images: string[];
  location: string;
  harvestDate?: string;
  isOrganic: boolean;
  status: 'available' | 'sold' | 'reserved';
  farmer: string; // Farmer ID
  createdAt: string;
}

interface Order {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  buyer: {
    _id: string;
    name: string;
    email: string;
  };
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

const FarmerDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    location: "",
    harvestDate: "",
    isOrganic: false,
    image: null as File | null,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [showAIChat, setShowAIChat] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/products/farmer', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    setOrderError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setOrderError('Authentication token not found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/orders/farmer', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (err: any) {
      setOrderError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Mock data
  const produceList = [
    {
      id: 1,
      name: "Organic Tomatoes",
      price: "$5.99/kg",
      quantity: "50 kg",
      category: "Vegetables",
    },
    {
      id: 2,
      name: "Fresh Carrots",
      price: "$3.49/kg",
      quantity: "30 kg",
      category: "Vegetables",
    },
    {
      id: 3,
      name: "Wheat Grain",
      price: "$2.99/kg",
      quantity: "100 kg",
      category: "Grains",
    },
  ];

  const buyerRequests = [
    {
      id: 1,
      buyer: "John Market",
      item: "Organic Tomatoes",
      quantity: "10 kg",
      date: "2024-01-15",
    },
    {
      id: 2,
      buyer: "Green Grocery",
      item: "Fresh Carrots",
      quantity: "15 kg",
      date: "2024-01-14",
    },
  ];

  const transactions = [
    {
      id: 1,
      item: "Organic Tomatoes",
      amount: "$59.90",
      buyer: "John Market",
      date: "2024-01-10",
    },
    {
      id: 2,
      item: "Wheat Grain",
      amount: "$89.70",
      buyer: "Local Bakery",
      date: "2024-01-08",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
       setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else if (name === "image") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).files?.[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmitProduce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity || !formData.category || !formData.location) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Prepare FormData
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    data.append('category', formData.category);
    data.append('location', formData.location);
    if (formData.harvestDate) {
        data.append('harvestDate', formData.harvestDate);
    }
    data.append('isOrganic', formData.isOrganic.toString());
    if (formData.image) {
      data.append('images', formData.image);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please log in.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/products/farmer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Do NOT set Content-Type for FormData, the browser does it automatically
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add product');
      }

      toast.success('Product added successfully!');
      setShowAddForm(false);
      setFormData({
        name: "", description: "", price: "", quantity: "", category: "", location: "", harvestDate: "", isOrganic: false, image: null,
      });
      fetchProducts(); // Refresh the product list
    } catch (err: any) {
      toast.error(err.message);
      console.error('Error adding product:', err);
    }
  };

  const handleEditProduct = (product: Product) => {
      setShowEditForm(product);
      setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          quantity: product.quantity.toString(),
          category: product.category,
          location: product.location,
          harvestDate: product.harvestDate || '', // Handle potential undefined
          isOrganic: product.isOrganic,
          image: null, // Image editing might require separate handling
      });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!showEditForm) return;

      // Basic validation (you might want more comprehensive validation)
      if (!formData.name || !formData.price || !formData.quantity || !formData.category || !formData.location) {
        toast.error('Please fill in all required fields.');
        return;
      }

      // Prepare FormData
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('quantity', formData.quantity);
      data.append('category', formData.category);
      data.append('location', formData.location);
      if (formData.harvestDate) {
          data.append('harvestDate', formData.harvestDate);
      }
      data.append('isOrganic', formData.isOrganic.toString());
      if (formData.image) {
        data.append('images', formData.image);
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication token not found. Please log in.');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/products/farmer/${showEditForm._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Do NOT set Content-Type for FormData
          },
          body: data,
        });

         const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to update product');
        }

        toast.success('Product updated successfully!');
        setShowEditForm(null);
        setFormData({ name: "", description: "", price: "", quantity: "", category: "", location: "", harvestDate: "", isOrganic: false, image: null });
        fetchProducts(); // Refresh the product list
      } catch (err: any) {
        toast.error(err.message);
         console.error('Error updating product:', err);
      }
  };

  const handleDeleteProduct = async (productId: string) => {
    // TODO: Implement delete submission to backend
    console.log("Deleting produce with ID:", productId);

    try {
      const token = localStorage.getItem('token');
       if (!token) {
        toast.error('Authentication token not found. Please log in.');
        return;
      }
      const response = await fetch(`http://localhost:5000/api/products/farmer/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete product');
      }

      toast.success('Product deleted successfully!');
      fetchProducts(); // Refresh the product list
    } catch (err: any) {
      toast.error(err.message);
      console.error('Error deleting product:', err);
    }
  };

  const handleLogout = () => {
    // Clear authentication data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    router.push('/');
  };

  const calculateStats = () => {
    const totalProducts = products.length;
    const pendingRequests = orders.filter(order => order.status === 'pending').length;
    const totalSales = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalProducts,
      pendingRequests,
      totalSales
    };
  };

  const stats = calculateStats();

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      toast.success('Order status updated successfully');
      fetchOrders(); // Refresh orders
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalProducts}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-amber-700">
                    Pending Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.pendingRequests}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-700">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    ${stats.totalSales.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{order.buyer.name}</span> requested{' '}
                        <span className="font-medium">{order.quantity}</span> units of{' '}
                        <span className="font-medium">{order.product.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "produce":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Produce</h2>
              <Button
                onClick={() => {setShowAddForm(true); setShowEditForm(null);}}
                className="bg-green-600 hover:bg-green-700"
              >
                Add New Produce
              </Button>
            </div>

            {isLoading && <p>Loading products...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!isLoading && !error && products.length === 0 && (
                <p>You haven't added any produce yet.</p>
            )}

            {(showAddForm || showEditForm) && (
              <Card>
                <CardHeader>
                  <CardTitle>{showEditForm ? 'Edit Produce' : 'Add New Produce'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={showEditForm ? handleUpdateProduct : handleSubmitProduce} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="5.99"
                          required
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          placeholder="50"
                          required
                          step="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          placeholder="Vegetables"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Farm location"
                          required
                        />
                      </div>
                       <div>
                        <Label htmlFor="harvestDate">Harvest Date</Label>
                        <Input
                          id="harvestDate"
                          name="harvestDate"
                          type="date"
                          value={formData.harvestDate}
                          onChange={handleInputChange}
                        />
                      </div>
                       <div>
                        <Label htmlFor="isOrganic">Is Organic</Label>
                        <Input
                          id="isOrganic"
                          name="isOrganic"
                          type="checkbox"
                          checked={formData.isOrganic}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </div>
                       <div>
                        <Label htmlFor="image">Product Image</Label>
                        <Input
                          id="image"
                          name="image"
                          type="file"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">
                      {showEditForm ? 'Update Produce' : 'Add Produce'}
                    </Button>
                     <Button type="button" variant="outline" onClick={() => {setShowAddForm(false); setShowEditForm(null);}} className="w-full mt-2">
                      Cancel
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {!showAddForm && !showEditForm && products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>My Produce List</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((produce) => (
                        <TableRow key={produce._id}>
                          <TableCell>{produce.name}</TableCell>
                          <TableCell>${produce.price.toFixed(2)}</TableCell>
                          <TableCell>{produce.quantity}</TableCell>
                          <TableCell>{produce.category}</TableCell>
                          <TableCell>{produce.status}</TableCell>
                          <TableCell className="flex items-center space-x-2">
                             <Button variant="outline" size="sm" onClick={() => handleEditProduct(produce)}>
                               <Edit className="w-4 h-4" />
                            </Button>
                             <Button variant="outline" size="sm" color="red" onClick={() => handleDeleteProduct(produce._id)}>
                               <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "requests":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Buyer Requests</h2>
            {isLoadingOrders && <p>Loading requests...</p>}
            {orderError && <p className="text-red-500">Error: {orderError}</p>}
            {!isLoadingOrders && !orderError && orders.length === 0 && (
              <p>No pending requests.</p>
            )}
            {!isLoadingOrders && !orderError && orders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>{order.buyer.name}</TableCell>
                          <TableCell>{order.product.name}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {order.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleOrderStatusUpdate(order._id, 'accepted')}
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleOrderStatusUpdate(order._id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "transactions":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
            {isLoadingOrders && <p>Loading transactions...</p>}
            {orderError && <p className="text-red-500">Error: {orderError}</p>}
            {!isLoadingOrders && !orderError && orders.length === 0 && (
              <p>No transactions found.</p>
            )}
            {!isLoadingOrders && !orderError && orders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders
                        .filter(order => order.status === 'completed')
                        .map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order.product.name}</TableCell>
                            <TableCell>{order.buyer.name}</TableCell>
                            <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                order.paymentStatus === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.paymentStatus}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return <div className="text-center">Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-amber-50/30">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 md:pr-8 mb-8 md:mb-0">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Agri<span className="text-green-600">Chain</span>
            </Link>
          </div>
          <nav className="space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "produce" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("produce")}
            >
              <Check className="w-4 h-4 mr-2" />
              My Produce
            </Button>
            <Button
              variant={activeTab === "requests" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("requests")}
            >
              <Edit className="w-4 h-4 mr-2" />
              Buyer Requests
            </Button>
            <Button
              variant={activeTab === "transactions" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("transactions")}
            >
              <Edit className="w-4 h-4 mr-2" />
              Transactions
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50/50"
              onClick={() => setShowAIChat(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
            <Link href="/profile?type=farmer">
              <Button variant="ghost" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50/50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderDashboardContent()}
        </div>
      </div>

      {/* AI Chat Popup */}
      <AIChatPopup isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </div>
  );
};

export default FarmerDashboard;
