// src/screens/LoginScreen.js
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../constants/config';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await login(username.trim(), password);
      
      // Navigate based on role
      if (response.user.role === 'admin') {
        navigation.replace('AdminDashboard');
      } else if (response.user.role === 'collector') {
        navigation.replace('CollectorDashboard');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
        </View>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logoText}>RDW</Text>
          <Text style={styles.subtitle}>Membership System</Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Info Text */}
          <Text style={styles.infoText}>
            Contact your administrator for login credentials
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 50,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 4,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.dark,
    marginTop: 20,
  },
  formSection: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.dark,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  infoText: {
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 14,
    marginTop: 24,
    lineHeight: 20,
  },
});

export default LoginScreen;