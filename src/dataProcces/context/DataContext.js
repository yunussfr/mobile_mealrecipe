import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mealClient } from '../Client/apiclient';

const NOTEBOOK_KEY = 'user_notebook';

// -------------------------------------------------
// Context oluştur
// -------------------------------------------------
const DataContext = createContext(null);

// -------------------------------------------------
// Provider
// -------------------------------------------------
export const DataProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);           // TheMealDB'den gelen tarifler
    const [notebookEntries, setNotebookEntries] = useState([]); // Kullanıcının kaydettiği tarifler
    const [isRecipesLoading, setIsRecipesLoading] = useState(false);

    // Uygulama açıldığında notebook'u AsyncStorage'dan yükle
    useEffect(() => {
        const loadNotebook = async () => {
            try {
                const stored = await AsyncStorage.getItem(NOTEBOOK_KEY);
                if (stored) {
                    setNotebookEntries(JSON.parse(stored));
                }
            } catch (error) {
                console.error('DataContext - Notebook yüklenirken hata:', error);
            }
        };

        loadNotebook();
    }, []);

    // -------------------------------------------------
    // Tarifleri TheMealDB'den çek
    // Örnek: /search.php?s= (boş → popüler tarifler)
    //        /filter.php?c=Seafood (kategoriye göre)
    // -------------------------------------------------
    const fetchRecipes = async (query = '') => {
        try {
            setIsRecipesLoading(true);
            const endpoint = query
                ? `search.php?s=${encodeURIComponent(query)}`
                : 'search.php?s=';

            const response = await mealClient.get(endpoint);
            const meals = response.data?.meals ?? [];
            setRecipes(meals);
            return meals;
        } catch (error) {
            console.error('DataContext - Tarifler çekilirken hata:', error);
            setRecipes([]);
            return [];
        } finally {
            setIsRecipesLoading(false);
        }
    };

    // Kategoriye göre tarif çek (opsiyonel yardımcı)
    const fetchRecipesByCategory = async (category) => {
        try {
            setIsRecipesLoading(true);
            const response = await mealClient.get(
                `filter.php?c=${encodeURIComponent(category)}`
            );
            const meals = response.data?.meals ?? [];
            setRecipes(meals);
            return meals;
        } catch (error) {
            console.error('DataContext - Kategoriye göre tarifler çekilirken hata:', error);
            setRecipes([]);
            return [];
        } finally {
            setIsRecipesLoading(false);
        }
    };

    // -------------------------------------------------
    // Notebook yardımcısı — state + AsyncStorage'ı günceller
    // -------------------------------------------------
    const persistNotebook = async (newList) => {
        try {
            setNotebookEntries(newList);
            await AsyncStorage.setItem(NOTEBOOK_KEY, JSON.stringify(newList));
        } catch (error) {
            console.error('DataContext - Notebook kaydedilirken hata:', error);
        }
    };

    // -------------------------------------------------
    // addToNotebook
    // -------------------------------------------------
    const addToNotebook = async (recipe) => {
        const alreadyExists = notebookEntries.some(
            (entry) => entry.idMeal === recipe.idMeal
        );
        if (alreadyExists) return; // zaten ekli, tekrar ekleme

        const newList = [...notebookEntries, recipe];
        await persistNotebook(newList);
    };

    // -------------------------------------------------
    // removeFromNotebook
    // -------------------------------------------------
    const removeFromNotebook = async (recipeId) => {
        const newList = notebookEntries.filter(
            (entry) => entry.idMeal !== recipeId
        );
        await persistNotebook(newList);
    };

    // -------------------------------------------------
    // Value
    // -------------------------------------------------
    const value = {
        recipes,
        notebookEntries,
        isRecipesLoading,
        fetchRecipes,
        fetchRecipesByCategory,
        addToNotebook,
        removeFromNotebook,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// -------------------------------------------------
// Hook
// -------------------------------------------------
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData, DataProvider içinde kullanılmalıdır.');
    }
    return context;
};

export default DataContext;
