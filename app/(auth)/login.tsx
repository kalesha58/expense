// TODO: Add additional login features or improvements here
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  Alert,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { SIZES } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const VERSION = 'ExpenseApp v1.0.0';

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors, isDark, setTheme, theme, shadows } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
      router.replace('/select-department');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Theme toggle in top right */}
          <View style={styles.themeToggleContainer}>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleBtn}>
              {isDark ? (
                <Feather name="sun" size={24} color={colors.primary} />
              ) : (
                <Feather name="moon" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Logo/Illustration */}
            <Image 
              source={require('@/assets/images/loginlogo.png')} 
              style={styles.illustration} 
              resizeMode="contain" 
            />
            
            {/* Title */}
            <Text style={[styles.title, { color: colors.text }]}>Welcome to Expense App</Text>

            {/* Error Box */}
            {error ? (
              <View style={[styles.errorBox, { 
                backgroundColor: isDark ? '#2D1B1B' : '#FFE5E5', 
                borderLeftColor: colors.expense 
              }]}>
                <Feather name="alert-circle" size={20} color={colors.expense} />
                <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
                <TouchableOpacity onPress={() => setError("")}>
                  <Feather name="x" size={20} color={colors.textLight} />
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Username Input */}
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground, 
                borderColor: colors.border, 
                color: colors.text 
              }, error && error.toLowerCase().includes('username') && { borderColor: colors.expense }]}
              autoCapitalize="none"
              value={username}
              placeholder="Enter Username"
              placeholderTextColor={colors.placeholder}
              onChangeText={setUsername}
            />

            {/* Password Input */}
            <View style={{ width: '100%', position: 'relative', marginBottom: 16 }}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground, 
                  borderColor: colors.border, 
                  color: colors.text,
                  paddingRight: 48 // space for the icon
                }, error && error.toLowerCase().includes('password') && { borderColor: colors.expense }]}
                value={password}
                placeholder="Enter Password"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 16, top: 0, height: '100%', justifyContent: 'center' }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showPassword ? (
                  <Feather name="eye-off" size={22} color={colors.placeholder} />
                ) : (
                  <Feather name="eye" size={22} color={colors.placeholder} />
                )}
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity 
              style={[styles.button, { 
                backgroundColor: colors.primary,
                opacity: isLoading ? 0.7 : 1
              }]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, { color: colors.white }]}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Text>
            </TouchableOpacity>


          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 32,
    right: 32,
    zIndex: 10,
  },
  themeToggleBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    height: 310,
    width: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  input: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    fontSize: 16,
    width: '100%',
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
});