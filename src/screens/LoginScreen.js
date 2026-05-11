import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LogIn, UserPlus, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading } = useAuth();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Giriş başarısız:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          {/* dekor */}
          <View style={styles.decorCircle} />

          <View style={styles.content}>
            {/* logo */}
            <View style={styles.logoSection}>
              <View style={styles.logoBox}>
                <Text style={styles.logoEmoji}>🥘</Text>
              </View>
              <Text style={styles.logoTitle}>LEZZETTAT</Text>
              <Text style={styles.logoSubtitle}>Mutfaktaki Partiye Katıl!</Text>
            </View>

            {/* form */}
            <View style={styles.formSection}>
              {/* email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-posta</Text>
                <View style={styles.inputWrapper}>
                  <Mail color="#1A1A2E" size={18} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="lezzet@tat.com"
                    placeholderTextColor="rgba(26,26,46,0.5)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Şifre</Text>
                <View style={styles.inputWrapper}>
                  <Lock color="#1A1A2E" size={18} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(26,26,46,0.5)"
                    secureTextEntry
                  />
                </View>
              </View>

              {/* login button */}
              <TouchableOpacity
                style={styles.loginButton}
                activeOpacity={0.8}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <LogIn color="#FFFFFF" size={20} />
                    <Text style={styles.loginButtonText}>GİRİŞ YAP</Text>
                    <ArrowRight color="#FFFFFF" size={20} />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* register */}
            <View style={styles.registerSection}>
              <Text style={styles.registerHint}>Henüz üye değil misin?</Text>
              <TouchableOpacity
                style={styles.registerButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Register')}
              >
                <UserPlus color="#FFFFFF" size={18} />
                <Text style={styles.registerButtonText}>KAYIT OL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>© 2026 LEZZETTAT CREATIVE STUDIO</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFD600',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#1A1A2E',
    padding: 32,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    overflow: 'hidden', // to cut off the decorCircle if needed
  },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 96,
    height: 96,
    backgroundColor: '#FF6B00',
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#1A1A2E',
  },
  content: {
    zIndex: 10,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#FFD600',
    borderWidth: 3,
    borderColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    transform: [{ rotate: '3deg' }],
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: 36,
  },
  logoTitle: {
    fontFamily: 'Righteous',
    fontSize: 28,
    color: '#1A1A2E',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  logoSubtitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(26, 26, 46, 0.6)',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  formSection: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Nunito-Black',
    fontSize: 10,
    fontWeight: '900',
    color: '#1A1A2E',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    borderWidth: 3,
    borderColor: '#1A1A2E',
    height: 48,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    color: '#1A1A2E',
    height: '100%',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    borderWidth: 3,
    borderColor: '#1A1A2E',
    paddingVertical: 16,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito-Black',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginHorizontal: 8,
  },
  registerSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 3,
    borderTopColor: 'rgba(26, 26, 46, 0.1)',
    alignItems: 'center',
  },
  registerHint: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(26, 26, 46, 0.6)',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E83F6F',
    borderWidth: 3,
    borderColor: '#1A1A2E',
    paddingVertical: 12,
    width: '100%',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito-Black',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginLeft: 8,
  },
  footerText: {
    marginTop: 32,
    fontFamily: 'Nunito-Black',
    fontSize: 8,
    fontWeight: '900',
    color: 'rgba(26, 26, 46, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});