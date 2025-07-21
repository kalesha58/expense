import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function splashScreen({ onGetStarted }: { onGetStarted?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.illustrationContainer}>
        <Image source={require('../assets/images/welcome.png')} style={styles.illustration} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.headline}>Always take control{"\n"}of your finances</Text>
        <Text style={styles.subtitle}>Finances must be arranged to set a better lifestyle in future</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181028',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  illustrationContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  illustration: {
    width: 340,
    height: 340,
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  headline: {
    color: '#332b01',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
    width: '90%',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 