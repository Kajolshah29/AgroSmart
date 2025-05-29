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
import { User, Home, Settings, LogOut, Edit, Check, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { states, districts, talukas } from '@/src/data/locations';

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
  unit: string;
  stock: number;
  state?: string;
  district?: string;
  taluka?: string;
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
    unit: "",
    stock: "",
    category: "",
    state: "",
    district: "",
    taluka: "",
    harvestDate: "",
    isOrganic: false,
    images: [] as File[],
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Add stats state
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingRequests: 0,
    totalSales: 0
  });

  // Calculate stats whenever products or orders change
  useEffect(() => {
    setStats({
      totalProducts: products.length,
      pendingRequests: orders.filter(order => order.status === 'pending').length,
      totalSales: orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.totalAmount, 0)
    });
  }, [products, orders]);

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
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const type = target.type;
    const value = target.value;
    const checked = target.checked;
    const files = target.files;

    if (type === 'checkbox') {
       setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
        setFormData({ ...formData, [name]: files ? files[0] : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmitProduce = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.unit || !formData.stock || !formData.category) {
        toast.error('Please fill in all required fields.');
        return;
    }

    // Prepare FormData
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('unit', formData.unit);
    data.append('stock', formData.stock);
    data.append('category', formData.category);
    data.append('state', formData.state);
    data.append('district', formData.district);
    data.append('taluka', formData.taluka);
    if (formData.harvestDate) {
        data.append('harvestDate', formData.harvestDate);
    }
    data.append('isOrganic', formData.isOrganic.toString());
    
    // Append all images
    formData.images.forEach((image, index) => {
        data.append('images', image);
    });

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
            name: "",
            description: "",
            price: "",
            unit: "",
            stock: "",
            category: "",
            state: "",
            district: "",
            taluka: "",
            harvestDate: "",
            isOrganic: false,
            images: [],
        });
        fetchProducts(); // Refresh the product list
    } catch (err: any) {
        toast.error(err.message);
        console.error('Error adding product:', err);
    }
  };

  const handleEditProduct = (product: Product) => {
    setShowEditForm(product);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh products after deletion
      fetchProducts();
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditForm) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/products/${showEditForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(showEditForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Refresh products after update
      fetchProducts();
      setShowEditForm(null);
      toast.success('Product updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders after update
      fetchOrders();
      toast.success('Order status updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
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
              <h2 className="text-2xl font-semibold">My Produce</h2>
              <Button onClick={() => setShowAddForm(true)}>+ Add New Produce</Button>
            </div>

            {showAddForm && (
  <Card className="p-6">
    <CardTitle className="mb-4">Add New Produce</CardTitle>
    <form onSubmit={handleSubmitProduce} className="space-y-4">
      
      {/* Form Fields */}
      <div>
        <Label htmlFor="name">Produce Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" value={formData.description} onChange={handleInputChange} required />
      </div>

      {/* Pricing & Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="unit">Unit (e.g., kg, dozen)</Label>
          <Input id="unit" name="unit" value={formData.unit} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="stock">Stock Available</Label>
          <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} required />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="state">State</Label>
          <Select name="state" value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="district">District</Label>
          <Select name="district" value={formData.district} onValueChange={(value) => setFormData({ ...formData, district: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districts[formData.state]?.map((district) => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="taluka">Taluka</Label>
          <Select name="taluka" value={formData.taluka} onValueChange={(value) => setFormData({ ...formData, taluka: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select taluka" />
            </SelectTrigger>
            <SelectContent>
              {talukas[formData.district]?.map((taluka) => (
                <SelectItem key={taluka} value={taluka}>{taluka}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category">Category</Label>
        <Select name="category" value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vegetables">Vegetables</SelectItem>
            <SelectItem value="fruits">Fruits</SelectItem>
            <SelectItem value="grains">Grains</SelectItem>
            <SelectItem value="dairy">Dairy</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Harvest Date */}
      <div>
        <Label htmlFor="harvestDate">Harvest Date</Label>
        <Input id="harvestDate" name="harvestDate" type="date" value={formData.harvestDate} onChange={handleInputChange} />
      </div>

      {/* Organic Status */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isOrganic"
          name="isOrganic"
          checked={formData.isOrganic}
          onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
          className="form-checkbox"
        />
        <Label htmlFor="isOrganic">Is Organic?</Label>
      </div>

      {/* Images */}
      <div>
        <Label htmlFor="images">Produce Images (up to 5)</Label>
        <Input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 5) {
              toast.error('Maximum 5 images allowed');
              return;
            }
            setFormData({ ...formData, images: files });
          }}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>
          Cancel
        </Button>
        <Button type="submit">Add Produce</Button>
      </div>
    </form>
  </Card>
)}


            {/* My Produce Table */}
            {!showAddForm && !showEditForm && (
            <Card>
              <CardHeader>
                <CardTitle>My Listings</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading products...</p>
                ) : error ? (
                  <p className="text-red-500">Error loading products: {error}</p>
                ) : products.length === 0 ? (
                  <p>No products listed yet. Add your first produce!</p>
                ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          {product.images && product.images[0] ? (
                            <img src={`http://localhost:5000/${product.images[0]}`} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">No Image</div>
                          )}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                         <TableCell>₹{product.price} / {product.unit}</TableCell>
                        <TableCell>{product.stock} {product.unit}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        {/* Assuming location string is stored in a single field for simplicity in existing data */}
                         <TableCell>{`${product.taluka || ''}, ${product.district || ''}, ${product.state || ''}`}</TableCell>
                        <TableCell>{product.status}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditProduct(product)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteProduct(product._id)}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 )}
              </CardContent>
            </Card>
             )}

            {/* Edit Produce Form */}
            {showEditForm && (
                <Card className="p-6">
                <CardTitle className="mb-4">Edit Produce</CardTitle>
                 <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Produce Name</Label>
                    <Input id="edit-name" value={showEditForm.name} onChange={(e) => setShowEditForm({ ...showEditForm!, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Input id="edit-description" value={showEditForm.description} onChange={(e) => setShowEditForm({ ...showEditForm!, description: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit-price">Price</Label>
                      <Input id="edit-price" type="number" step="0.01" value={showEditForm.price} onChange={(e) => setShowEditForm({ ...showEditForm!, price: parseFloat(e.target.value) })} required />
                    </div>
                     <div>
                      <Label htmlFor="edit-unit">Unit (e.g., kg, dozen)</Label>
                      <Input id="edit-unit" value={showEditForm.unit} onChange={(e) => setShowEditForm({ ...showEditForm!, unit: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="edit-stock">Stock Available</Label>
                      <Input id="edit-stock" type="number" value={showEditForm.stock} onChange={(e) => setShowEditForm({ ...showEditForm!, stock: parseInt(e.target.value, 10) })} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                     <Select onValueChange={(value) => setShowEditForm({ ...showEditForm!, category: value })} value={showEditForm.category} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Vegetables">Vegetables</SelectItem>
                            <SelectItem value="Fruits">Fruits</SelectItem>
                            <SelectItem value="Grains">Grains</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  {/* Location fields are not present in the edit form currently - consider adding */}
                   {/* Add Image Upload for Edit - currently not implemented */}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowEditForm(null)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
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
    </div>
  );
};

export default FarmerDashboard;
