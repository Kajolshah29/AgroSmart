export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    state: string;
    district: string;
    taluka: string;
    role: 'farmer' | 'buyer';
    createdAt: string;
    farmDetails?: FarmDetails;
    businessDetails?: BusinessDetails;
}

export interface FarmDetails {
    farmName: string;
    farmSize: string;
    farmLocation: string;
    crops: string[];
}

export interface BusinessDetails {
    businessName: string;
    businessType: string;
    businessLocation: string;
    preferredProducts: string[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    unit: string;
    category: string;
    images: string[];
    farmer: {
        id: string;
        name: string;
        location: {
            lat: number;
            lng: number;
        };
    };
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    id: string;
    buyer: {
        id: string;
        name: string;
    };
    products: {
        product: Product;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
} 