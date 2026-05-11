import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';

export function SearchBar({ value, onChangeText, placeholder = "Ara...", style }) {
  return (
    <View style={[styles.container, style]}>
      <Search
        color="#1A1A2E"
        size={20}
        strokeWidth={3}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(26, 26, 46, 0.5)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#1A1A2E',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1A1A2E',
    height: '100%',
  },
});
