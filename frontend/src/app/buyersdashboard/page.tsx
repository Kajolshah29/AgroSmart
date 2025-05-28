'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { User, Home, Settings, LogOut, Search, Check, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  farmer: { // Populate farmer details if needed
    _id: string;
    name: string;
    farmDetails?: { // Optional field based on farmer schema
      farmName: string;
    }
  };
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
  farmer: {
    _id: string;
    name: string;
    farmDetails?: { // Optional field based on farmer schema
      farmName: string;
    }
  };
  buyer: string; // Buyer ID
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

const BuyerDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    region: "",
    priceRange: [0, 100],
    search: ""
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Note: Product fetching for buyers is public, but you might need the token for other buyer-specific data later

      const response = await fetch('http://localhost:5000/api/products');

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
        setOrderError('Authentication token not found. Please log in.');
        setIsLoadingOrders(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/orders/buyer', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
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
    fetchOrders(); // Fetch orders as well
  }, []);

  const handlePurchase = (product: Product) => {
    alert(`Purchase initiated for ${product.name}. Redirecting to wallet...`);
    // TODO: Implement actual purchase logic (creating an order on the backend)
     // This will likely involve sending a POST request to /api/orders
  };

  const handleLogout = () => {
    // Clear authentication data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    router.push('/');
  };

  // Calculate dashboard statistics based on dynamic data
  const calculateStats = () => {
    const totalProductsAvailable = products.filter(p => p.status === 'available').length;
    const totalOrders = orders.length;
    const totalSpent = orders
      .filter(order => order.paymentStatus === 'completed') // Assuming paymentStatus 'completed' means spent
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalProductsAvailable,
      totalOrders,
      totalSpent
    };
  };

  const stats = calculateStats();

  const renderDashboardContent = () => {
    // Filter and search products based on filters state
    const filteredProducts = products.filter(product => {
      const categoryMatch = filters.category === "" || product.category === filters.category;
      const regionMatch = filters.region === "" || product.location.toLowerCase().includes(filters.region.toLowerCase()); // Assuming location can be used for region filter
      // Implement price range filter if needed
      const searchMatch = filters.search === "" || product.name.toLowerCase().includes(filters.search.toLowerCase()) || product.description.toLowerCase().includes(filters.search.toLowerCase());
      
      return categoryMatch && regionMatch && searchMatch; // Add priceRangeMatch when implemented
    });

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-700">Available Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProductsAvailable}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-amber-700">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Featured Products</CardTitle>
              </CardHeader>
              <CardContent>
                 {isLoading && <p>Loading featured products...</p>}
                {error && <p className="text-red-500">Error loading featured products: {error}</p>}
                {!isLoading && !error && filteredProducts.length === 0 && <p>No featured products available.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {!isLoading && !error && filteredProducts.slice(0, 3).map((product) => (
                    <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      {/* Display first image if available, otherwise a placeholder */}
                      <img
                        src={product.images && product.images.length > 0 ? `http://localhost:5000/${product.images[0]}` : "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.location}</p>
                      <p className="text-lg font-bold text-green-600 mt-2">${product.price.toFixed(2)}</p>
                       <p className="text-sm text-gray-500">Farmer: {product.farmer?.name || 'N/A'}</p>
                      <Button
                        size="sm"
                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setSelectedProduct(product)}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "marketplace":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full mt-1 p-2 border rounded-md"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                      <option value="">All Categories</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                       <option value="grains">Grains</option>
                       <option value="dairy">Dairy</option>
                       <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="region">Location</Label>
                    <Input
                      id="region"
                      placeholder="Filter by location..."
                       value={filters.region}
                      onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Input id="search" placeholder="Search products..." className="pl-10"
                         value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                       />
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                   {/* TODO: Add Price Range Filter */}
                </div>
              </CardContent>
            </Card>

             {isLoading && <p>Loading products...</p>}
            {error && <p className="text-red-500">Error loading products: {error}</p>}
             {!isLoading && !error && filteredProducts.length === 0 && <p>No products match your filters.</p>}

            {!isLoading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      {/* Display first image if available, otherwise a placeholder */}
                      <img
                        src={product.images && product.images.length > 0 ? `http://localhost:5000/${product.images[0]}` : "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>📍 {product.location}</p>
                        <p>🏷️ {product.category}</p>
                        <p>📦 {product.quantity}</p>
                        <p>🚜 {product.farmer?.name || 'N/A'}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-600">${product.price.toFixed(2)}</span>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setSelectedProduct(product)}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case "order-history":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
            {isLoadingOrders && <p>Loading orders...</p>}
            {orderError && <p className="text-red-500">Error: {orderError}</p>}
            {!isLoadingOrders && !orderError && orders.length === 0 && (
              <p>You haven't placed any orders yet.</p>
            )}
            {!isLoadingOrders && !orderError && orders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Farmer</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>{order.product.name}</TableCell>
                          <TableCell>{order.farmer.name}</TableCell>
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

   // Modal for Product Details (simplified example)
  const renderProductDetailsModal = () => {
    if (!selectedProduct) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="max-w-2xl w-full mx-4 bg-white">
          <CardHeader className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">{selectedProduct.name}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Added on {new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Image */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={selectedProduct.images && selectedProduct.images.length > 0 ? `http://localhost:5000/${selectedProduct.images[0]}` : "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedProduct.isOrganic && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-full w-fit">
                    <span className="text-lg">🌱</span>
                    <span className="font-medium">Organic Product</span>
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-xl font-bold text-green-600">${selectedProduct.price.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Quantity Available</p>
                    <p className="text-xl font-bold text-gray-900">{selectedProduct.quantity} units</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📍</span>
                    <span className="text-gray-700">{selectedProduct.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">🏷️</span>
                    <span className="text-gray-700">{selectedProduct.category}</span>
                  </div>
                  {selectedProduct.harvestDate && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">📅</span>
                      <span className="text-gray-700">Harvested on {new Date(selectedProduct.harvestDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">🚜</span>
                    <span className="text-gray-700">Farmer: {selectedProduct.farmer?.name || 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedProduct(null)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handlePurchase(selectedProduct)}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-green-50/30">
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
              variant={activeTab === "marketplace" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("marketplace")}
            >
              <Search className="w-4 h-4 mr-2" />
              Marketplace
            </Button>
             {/* TODO: Add orders and settings tabs */}
              <Button
                variant={activeTab === "order-history" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("order-history")}
              >
               <ShoppingBag className="w-4 h-4 mr-2" />
                Order History
              </Button>
             <Link href="/profile?type=buyer">
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

        {/* Product Details Modal */}
        {renderProductDetailsModal()}
      </div>
    </div>
  );
};

export default BuyerDashboard;
