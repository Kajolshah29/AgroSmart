'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  farmerAddress: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        // Calculate initial totals
        const total = parsedCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
        const amount = parsedCart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
        setTotalItems(total);
        setTotalAmount(amount);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem('cart'); // Clear corrupted cart data
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      // Calculate totals
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      const amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotalItems(total);
      setTotalAmount(amount);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // Update quantity if item exists
        const updatedItems = currentItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
        toast.success(`${item.name} quantity updated in cart!`);
        return updatedItems;
      }
      
      // Add new item with quantity 1
      const newItems = [...currentItems, { ...item, quantity: 1 }];
      toast.success(`${item.name} added to cart!`);
      return newItems;
    });
  };

  const removeFromCart = (id: string) => {
    setItems(currentItems => {
      const item = currentItems.find(i => i.id === id);
      if (item) {
        toast.success(`${item.name} removed from cart!`);
      }
      return currentItems.filter(i => i.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems => {
      const item = currentItems.find(i => i.id === id);
      if (item) {
        toast.success(`${item.name} quantity updated!`);
      }
      return currentItems.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared!');
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 