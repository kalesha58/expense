import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleProp,
  TextInputProps,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { SIZES } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  secureTextEntry?: boolean;
}

export const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  ...props
}: InputProps) => {
  const { colors } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  // Determine if we should show the password toggle
  const showPasswordToggle = secureTextEntry && !rightIcon;
  
  // Determine if the input should be secure
  const isSecure = secureTextEntry && !isPasswordVisible;
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer, 
        { 
          backgroundColor: colors.inputBackground,
          borderColor: error ? colors.error : colors.border 
        }
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input, 
            { 
              color: colors.text,
              paddingLeft: leftIcon ? 0 : 12,
              paddingRight: (rightIcon || showPasswordToggle) ? 0 : 12,
            },
            inputStyle
          ]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isSecure}
          {...props}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity 
            style={styles.iconContainer} 
            onPress={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={colors.placeholder} />
            ) : (
              <Eye size={20} color={colors.placeholder} />
            )}
          </TouchableOpacity>
        )}
        
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      
      {error && (
        <Text style={[styles.error, { color: colors.error }, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0, // Will be controlled by containerStyle prop
  },
  label: {
    fontSize: SIZES.font,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SIZES.radius * 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: SIZES.font,
    paddingVertical: 12,
  },
  iconContainer: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: SIZES.small,
    marginTop: 4,
  },
});