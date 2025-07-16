import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Moon, Sun } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { SIZES } from '@/constants/theme';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  showThemeToggle?: boolean;
};

export const Header = ({
  title,
  showBackButton = false,
  rightComponent,
  showThemeToggle = false,
}: HeaderProps) => {
  const router = useRouter();
  const { colors, isDark, setTheme, theme } = useTheme();
  
  const handleBack = () => {
    router.back();
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.card, 
        borderBottomColor: colors.border,
        paddingTop: Platform.OS === 'ios' ? 44 : 10, // Account for status bar
      }
    ]}>
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        
        <View style={styles.rightContainer}>
          {showThemeToggle && (
            <TouchableOpacity 
              style={styles.themeToggle} 
              onPress={toggleTheme}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isDark ? (
                <Sun size={24} color={colors.primary} />
              ) : (
                <Moon size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
          
          {rightComponent && rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    minHeight: Platform.OS === 'ios' ? 88 : 64, // Account for status bar + header height
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: SIZES.large,
    fontWeight: '600',
    textAlign: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  themeToggle: {
    padding: 4,
  },
});