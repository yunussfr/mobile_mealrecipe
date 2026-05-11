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
import { UserPlus, Mail, Lock, User, ArrowLeft, Heart } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

export function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { register, isLoading } = useAuth();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      if(register) {
        await register(email, password, name);
      }
    } catch (error) {
      console.error('Kayıt başarısız:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Dekoratif Kalpler (Arka Plan) */}
        <View style={styles.decorTopRight}>
          <Heart size={120} color="#FFD600" fill="#FFD600" />
        </View>
        <View style={styles.decorBottomLeft}>
          <Heart size={80} color="#FFD600" fill="#FFD600" />
        </View>

        <View style={styles.card}>
          {/* Geri Dönüş Butonu */}
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <ArrowLeft color="#1A1A2E" size={20} />
          </TouchableOpacity>

          <View style={styles.headerBox}>
            <Text style={styles.titleLine}>YENİ BİR</Text>
            <View style={styles.titleRow}>
              <Text style={styles.titleHighlight}>HESAP</Text>
              <Text style={styles.titleLine}> AÇ</Text>
            </View>
            <Text style={styles.subtitle}>Lezzet dünyasına ilk adımı at!</Text>
          </View>

          <View style={styles.formSection}>
            {/* Ad Soyad */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adın Soyadın</Text>
              <View style={styles.inputWrapper}>
                <User color="#1A1A2E" size={16} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Örn: Lezzet Sever"
                  placeholderTextColor="rgba(26,26,46,0.5)"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta</Text>
              <View style={styles.inputWrapper}>
                <Mail color="#1A1A2E" size={16} style={styles.inputIcon} />
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

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.inputWrapper}>
                <Lock color="#1A1A2E" size={16} style={styles.inputIcon} />
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

            {/* Submit */}
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>ÜYE OL VE BAŞLA</Text>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E83F6F',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  decorTopRight: {
    position: 'absolute',
    top: 40,
    right: -20,
    opacity: 0.2,
    transform: [{ rotate: '-12deg' }],
  },
  decorBottomLeft: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    opacity: 0.1,
    transform: [{ rotate: '45deg' }],
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
    position: 'relative',
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    top: -16,
    left: -16,
    width: 40,
    height: 40,
    backgroundColor: '#FFD600',
    borderWidth: 3,
    borderColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    zIndex: 20,
  },
  headerBox: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleLine: {
    fontFamily: 'Righteous',
    fontSize: 28,
    lineHeight: 32,
    color: '#1A1A2E',
    textTransform: 'uppercase',
  },
  titleHighlight: {
    fontFamily: 'Righteous',
    fontSize: 28,
    lineHeight: 32,
    color: '#FF6B00',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(26, 26, 46, 0.6)',
    textTransform: 'uppercase',
    marginTop: 8,
  },
  formSection: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Nunito-Black',
    fontSize: 10,
    fontWeight: '900',
    color: '#1A1A2E',
    textTransform: 'uppercase',
    marginBottom: 6,
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
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A2E',
    borderWidth: 3,
    borderColor: '#1A1A2E',
    paddingVertical: 16,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito-Black',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});