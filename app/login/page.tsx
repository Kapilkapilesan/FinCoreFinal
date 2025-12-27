"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginScreen } from '../../components/auth/LoginScreen';
import { authService } from '../../services/auth.service';

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = async (username: string, password: string) => {
        try {
            await authService.login(username, password);
            // Login successful, redirect to dashboard
            router.push('/');
        } catch (error) {
            // Error is handled by LoginScreen which catches promise rejection
            throw error;
        }
    };

    return <LoginScreen onLogin={handleLogin} />;
}
