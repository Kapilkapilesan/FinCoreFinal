export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://teste.agroplus.lk/api';

export const getHeaders = () => {
    // Always get the latest token from storage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};
