// src/components/LoadingSpinner.js
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/config';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
});

export default LoadingSpinner;