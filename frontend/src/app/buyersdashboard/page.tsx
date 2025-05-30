'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { User, Home, Settings, LogOut, Search, Check, ShoppingBag, ShoppingCart, Store, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCart, CartProvider } from "../../context/CartContext";
import Cart from "@/src/components/Cart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { states, districts, talukas } from "@/src/data/locations";
import MapWrapper from '@/src/components/MapWrapper';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  farmerId: string;
  farmerName: string;
  farmerAddress: string;
  state: string;
  district: string;
  taluka: string;
  location: {
    lat: number;
    lng: number;
  };
  harvestDate: string;
  isOrganic: boolean;
  stock: number;
  unit: string;
  status: 'available' | 'sold' | 'reserved';
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  farmerAddress: string;
}

interface Order {
  _id: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const BuyerDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    state: "",
    district: "",
    taluka: "",
    search: ""
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);

  const { addToCart, totalItems } = useCart();

  const [showMap, setShowMap] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data.slice(0, 6)); // Show only 6 products on dashboard
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
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
    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeTab === "marketplace") {
      let filtered = [...products];
      
      // Apply search filter
      if (filters.search) {
        filtered = filtered.filter(product => 
          (product.name && product.name.toLowerCase().includes(filters.search.toLowerCase())) ||
          (product.description && product.description.toLowerCase().includes(filters.search.toLowerCase()))
        );
      }

      // Apply location filters
      if (filters.state) {
        filtered = filtered.filter(product => 
          product.state && product.state.toLowerCase().includes(filters.state.toLowerCase())
        );
      }
      if (filters.district) {
        filtered = filtered.filter(product => 
          product.district && product.district.toLowerCase().includes(filters.district.toLowerCase())
        );
      }
      if (filters.taluka) {
        filtered = filtered.filter(product => 
          product.taluka && product.taluka.toLowerCase().includes(filters.taluka.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
    }
  }, [filters, products, activeTab]);

  const handleAddToCart = (product: Product) => {
    if (product.status !== 'available') {
      toast.error('Product is not available');
      return;
    }
    
    const cartItem: CartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      farmerAddress: product.farmerAddress
    };
    addToCart(cartItem);
    toast.success('Product added to cart');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const calculateStats = () => {
    const totalProductsAvailable = products.filter(p => p.status === 'available').length;
    const totalOrders = orders.length;
    const totalSpent = orders
      .filter(order => order.paymentStatus === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalProductsAvailable,
      totalOrders,
      totalSpent
    };
  };

  const stats = calculateStats();

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 min-h-screen bg-white shadow-sm">
            <div className="p-4">
              <h1 className="text-2xl font-bold text-green-600 mb-8">AgroSmart</h1>
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
                  <Store className="w-4 h-4 mr-2" />
                Marketplace
              </Button>
                <Button
                  variant={activeTab === "cart" ? "secondary" : "ghost"}
                  className="w-full justify-start relative"
                  onClick={() => setActiveTab("cart")}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {totalItems > 0 && (
                    <span className="absolute right-2 bg-green-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
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
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{stats.totalProductsAvailable}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{stats.totalOrders}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">₹{stats.totalSpent}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Featured Products</h2>
                      <Button
                        variant="ghost"
                        onClick={() => setActiveTab("marketplace")}
                        className="text-green-600"
                      >
                        View All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <Card key={product._id} className="overflow-hidden">
                          {product.images[0] && (
                            <img
                              src={`http://localhost:5000/${product.images[0]}`}
                              alt={product.name}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold">₹{product.price}</span>
                              <Button
                                onClick={() => handleAddToCart(product)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>₹{order.totalAmount}</TableCell>
                            <TableCell>{order.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "marketplace" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h2 className="text-xl font-semibold mb-4">Product Map</h2>
                      <MapWrapper
                        center={[20.5937, 78.9629]} // Center of India
                        zoom={5}
                        markers={filteredProducts
                          .filter(product => product.location?.lat !== undefined && product.location?.lng !== undefined)
                          .map(product => ({
                            position: [product.location.lat, product.location.lng],
                            title: product.name
                          }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h2 className="text-xl font-semibold mb-4">Filters</h2>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="search">Search Products</Label>
                          <Input
                            id="search"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            placeholder="Search by name..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Select
                            value={filters.state}
                            onValueChange={(value) => {
                              setFilters({ ...filters, state: value, district: '', taluka: '' });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {filters.state && (
                          <div>
                            <Label htmlFor="district">District</Label>
                            <Select
                              value={filters.district}
                              onValueChange={(value) => {
                                setFilters({ ...filters, district: value, taluka: '' });
                              }}
                              disabled={!filters.state}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select district" />
                              </SelectTrigger>
                              <SelectContent>
                                {districts[filters.state]?.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {district}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {filters.district && (
                          <div>
                            <Label htmlFor="taluka">Taluka</Label>
                            <Select
                              value={filters.taluka}
                              onValueChange={(value) => setFilters({ ...filters, taluka: value })}
                              disabled={!filters.district}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select taluka" />
                              </SelectTrigger>
                              <SelectContent>
                                {talukas[filters.district]?.map((taluka) => (
                                  <SelectItem key={taluka} value={taluka}>
                                    {taluka}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="relative h-48">
                        <img
                          src={`http://localhost:5000/${product.images[0]}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                        <div className="mt-2">
                          <span className="text-green-600 font-semibold">₹{product.price}</span>
                          <span className="text-gray-500 text-sm ml-2">per {product.unit}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Location: {product.taluka}, {product.district}, {product.state}</p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedProduct(product)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "cart" && (
              <div className="max-w-4xl mx-auto">
                <Cart />
              </div>
            )}
          </div>
        </div>
      </div>
    </CartProvider>
  );
};

export default BuyerDashboard;
