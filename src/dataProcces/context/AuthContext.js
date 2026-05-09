import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userClient } from '../Client/apiclient';

// -------------------------------------------------
// Context oluştur
// -------------------------------------------------
const AuthContext = createContext(null);

// -------------------------------------------------
// Provider
// -------------------------------------------------
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // başlangıçta token kontrol ediyoruz

    // Uygulama açıldığında AsyncStorage'daki token'ı kontrol et
    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('lezzet_token');
                const storedUser = await AsyncStorage.getItem('lezzet_user');

                if (token && storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('AuthContext - Token yüklenirken hata:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredAuth();
    }, []);

    // -------------------------------------------------
    // Login
    // -------------------------------------------------
    const login = async (username, password) => {
        try {
            setIsLoading(true);

            const response = await userClient.post('auth/login', {
                username,
                password,
                expiresInMins: 60, // DummyJSON opsiyonel, token ömrü
            });

            const { token, ...userData } = response.data;

            // AsyncStorage'a kaydet
            await AsyncStorage.setItem('lezzet_token', token);
            await AsyncStorage.setItem('lezzet_user', JSON.stringify(userData));

            // State'i güncelle
            setUser(userData);

            return { success: true };
        } catch (error) {
            const message =
                error?.response?.data?.message || 'Giriş başarısız. Bilgilerini kontrol et.';
            console.error('AuthContext - Login hatası:', error);
            return { success: false, message };
        } finally {
            setIsLoading(false);
        }
    };

    // -------------------------------------------------
    // Logout
    // -------------------------------------------------
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('lezzet_token');
            await AsyncStorage.removeItem('lezzet_user');
            setUser(null);
        } catch (error) {
            console.error('AuthContext - Logout hatası:', error);
        }
    };

    // -------------------------------------------------
    // Value
    // -------------------------------------------------
    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// -------------------------------------------------
// Hook
// -------------------------------------------------
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth, AuthProvider içinde kullanılmalıdır.');
    }
    return context;
};

export default AuthContext;
