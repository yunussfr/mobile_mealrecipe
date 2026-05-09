import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'app_settings';

const DEFAULT_SETTINGS = {
    theme: 'light',        // 'light' | 'dark'
    primaryColor: '#FF6B35', // varsayılan ana renk
};

// -------------------------------------------------
// Context oluştur
// -------------------------------------------------
const SettingsContext = createContext(null);

// -------------------------------------------------
// Provider
// -------------------------------------------------
export const SettingsProvider = ({ children }) => {
    const [theme, setTheme] = useState(DEFAULT_SETTINGS.theme);
    const [primaryColor, setPrimaryColor] = useState(DEFAULT_SETTINGS.primaryColor);
    const [isLoading, setIsLoading] = useState(true);

    // Uygulama açıldığında kayıtlı ayarları yükle
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setTheme(parsed.theme ?? DEFAULT_SETTINGS.theme);
                    setPrimaryColor(parsed.primaryColor ?? DEFAULT_SETTINGS.primaryColor);
                }
            } catch (error) {
                console.error('SettingsContext - Ayarlar yüklenirken hata:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSettings();
    }, []);

    // AsyncStorage'a mevcut değerleri yazar (yardımcı)
    const persistSettings = async (newTheme, newColor) => {
        try {
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ theme: newTheme, primaryColor: newColor })
            );
        } catch (error) {
            console.error('SettingsContext - Ayarlar kaydedilirken hata:', error);
        }
    };

    // -------------------------------------------------
    // updateTheme
    // -------------------------------------------------
    const updateTheme = async (newTheme) => {
        setTheme(newTheme);
        await persistSettings(newTheme, primaryColor);
    };

    // -------------------------------------------------
    // updatePrimaryColor
    // -------------------------------------------------
    const updatePrimaryColor = async (newColor) => {
        setPrimaryColor(newColor);
        await persistSettings(theme, newColor);
    };

    // -------------------------------------------------
    // Value
    // -------------------------------------------------
    const value = {
        theme,
        primaryColor,
        isLoading,
        isDark: theme === 'dark',
        updateTheme,
        updatePrimaryColor,
    };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

// -------------------------------------------------
// Hook
// -------------------------------------------------
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings, SettingsProvider içinde kullanılmalıdır.');
    }
    return context;
};

export default SettingsContext;
