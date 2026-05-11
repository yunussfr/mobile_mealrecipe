import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Icons
import { Home, Book, Search as SearchIcon, User, Calendar } from 'lucide-react-native';

// Contexts
import { AuthProvider, useAuth } from './src/dataProcces/context/AuthContext';
import { DataProvider } from './src/dataProcces/context/DataContext';

// Screens
import {
  LoginScreen,
  RegisterScreen,
  DiscoverScreen,
  MyRecipesScreen,
  NotebookScreen,
  WeeklyPlanScreen,
  ProfileScreen,
  RecipeDetailScreen,
  CategoryScreen,
  SearchScreen,
  SettingsScreen,
} from './src/screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Main Tab Navigator ---
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Discover') return <Home color={color} size={size} />;
          if (route.name === 'Search') return <SearchIcon color={color} size={size} />;
          if (route.name === 'MyRecipes') return <Book color={color} size={size} />;
          if (route.name === 'WeeklyPlan') return <Calendar color={color} size={size} />;
          if (route.name === 'Profile') return <User color={color} size={size} />;
        },
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: '#1A1A2E',
        tabBarStyle: {
          backgroundColor: '#FFF8F0',
          borderTopWidth: 3,
          borderTopColor: '#1A1A2E',
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ title: 'Keşfet' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Ara' }} />
      <Tab.Screen name="MyRecipes" component={MyRecipesScreen} options={{ title: 'Tariflerim' }} />
      <Tab.Screen name="WeeklyPlan" component={WeeklyPlanScreen} options={{ title: 'Plan' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

// --- Main Stack (Tabs + Detail Screens) ---
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Notebook" component={NotebookScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

// --- Auth Stack ---
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// --- Root Navigator (Handles Auth State) ---
function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="#FFF8F0" />
      <AuthProvider>
        <DataProvider>
          <RootNavigator />
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
});

export default App;
