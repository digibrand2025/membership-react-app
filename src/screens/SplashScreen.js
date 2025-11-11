// src/screens/SplashScreen.js
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/config';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>RDW</Text>
          <Text style={styles.subtitle}>Membership System</Text>
        </View>
        <ActivityIndicator size="large" color={COLORS.white} style={styles.loader} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.white,
    marginTop: 8,
    opacity: 0.9,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;