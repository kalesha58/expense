import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Calendar } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { SIZES } from '@/constants/theme';

type DatePickerProps = {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  datePickerStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  placeholder?: string;
  format?: string; // Date format string
};

export const DatePicker = ({
  label,
  value,
  onChange,
  error,
  containerStyle,
  labelStyle,
  datePickerStyle,
  errorStyle,
  disabled = false,
  placeholder = 'Select date',
  format = 'MM/DD/YYYY',
}: DatePickerProps) => {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  
  // Format date for display
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'MM/DD/YYYY':
      default:
        return `${month}/${day}/${year}`;
    }
  };
  
  const openDatePicker = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };
  
  // Handle date selection
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value;
    
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    onChange(currentDate);
  };
  
  // Render native date picker based on platform
  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      // For web, we'll use the native date input
      return (
        <input
          type="date"
          value={value.toISOString().split('T')[0]}
          onChange={(e) => {
            const date = new Date(e.target.value);
            onChange(date);
          }}
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          }}
        />
      );
    } else if (showPicker) {
      // For native platforms, we'll use the DateTimePicker component
      // Since we can't import it directly here, we'll show a message
      return (
        <Text style={{ color: colors.error }}>
          Note: In a real app, this would use the native DateTimePicker component.
        </Text>
      );
    }
    
    return null;
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }, labelStyle]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.datePicker,
          { 
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : colors.border,
            opacity: disabled ? 0.7 : 1,
          },
          datePickerStyle,
        ]}
        onPress={openDatePicker}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text 
          style={[
            styles.dateText, 
            { 
              color: value ? colors.text : colors.placeholder 
            }
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        <Calendar size={20} color={colors.placeholder} />
        {renderDatePicker()}
      </TouchableOpacity>
      
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
    marginBottom: 16,
  },
  label: {
    fontSize: SIZES.font,
    marginBottom: 8,
    fontWeight: '500',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    height: 48,
    position: 'relative',
  },
  dateText: {
    fontSize: SIZES.font,
    flex: 1,
  },
  error: {
    fontSize: SIZES.small,
    marginTop: 4,
  },
});