import { Platform } from 'react-native';

export const COLORS = {
  // Light theme
  light: {
    primary: '#0572CE', // Oracle blue
    secondary: '#7A86B8', // Soft purple
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#333333',
    textLight: '#9A8478', // Added for login UI
    border: '#E0E0E0',
    notification: '#FF4D4F',
    success: '#52C41A',
    warning: '#FAAD14',
    error: '#F5222D',
    inputBackground: '#FFFFFF',
    placeholder: '#9CA3AF',
    disabled: '#E5E7EB',
    divider: '#E5E7EB',
    white: '#FFFFFF', // Added for login UI
    expense: '#E74C3C', // Added for error styling
  },
  // Dark theme
  dark: {
    primary: '#2A85D0', // Lighter Oracle blue for dark mode
    secondary: '#9CA3FF', // Lighter purple for dark mode
    background: '#121212',
    card: '#1E1E1E',
    text: '#F5F5F5',
    textLight: '#9A8478', // Added for login UI
    border: '#383838',
    notification: '#FF4D4F',
    success: '#52C41A',
    warning: '#FAAD14',
    error: '#F5222D',
    inputBackground: '#2C2C2C',
    placeholder: '#6B7280',
    disabled: '#383838',
    divider: '#383838',
    white: '#FFFFFF', // Added for login UI
    expense: '#E74C3C', // Added for error styling
  }
};

export const FONTS = {
  regular: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  medium: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  bold: Platform.OS === 'ios' ? 'System' : 'sans-serif-bold',
  light: Platform.OS === 'ios' ? 'System' : 'sans-serif-light',
};

export const SIZES = {
  // Global sizes
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
  
  // Specific sizes
  radius: 8,
  padding: 16,
  margin: 16,
};

export const SHADOWS = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 5.46,
      elevation: 5,
    },
  },
  dark: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 3.84,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5.46,
      elevation: 5,
    },
  },
};