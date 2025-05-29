'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'farmer' | 'buyer';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string, role: string) => Promise<void>;
    register: (data: any, role: 'farmer' | 'buyer') => Promise<void>;
    logout: () => void;
    updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await authAPI.getProfile();
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string, role: string) => {
        try {
            const response = await authAPI.login({ email, password, role });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            router.push(user.role === 'farmer' ? '/farmerdashboard' : '/buyersdashboard');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (data: any, role: 'farmer' | 'buyer') => {
        try {
            const response = await authAPI.register(data, role);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            router.push(user.role === 'farmer' ? '/farmerdashboard' : '/buyersdashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    const updateProfile = async (data: any) => {
        try {
            const response = await authAPI.updateProfile(data);
            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 