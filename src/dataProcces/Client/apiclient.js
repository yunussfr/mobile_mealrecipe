import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // React Native storage eklendi

// 1. TheMealDB İstemcisi
export const mealClient = axios.create({
    baseURL: 'https://www.themealdb.com/api/json/v1/1/',
    timeout: 10000,
});

// 2. Kendi Kullanıcı Sistemin (DummyJSON) İçin İstemci
export const userClient = axios.create({
    baseURL: 'https://dummyjson.com/', // auth işlemleri için kök dizin gerekli
    timeout: 10000,
});

// Güvenlik (Token) Interceptor'ı
userClient.interceptors.request.use(
    async (config) => { // AsyncStorage kullanacağımız için async eklendi
        // Token'ı React Native hafızasından okuyoruz
        const token = await AsyncStorage.getItem('lezzet_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);