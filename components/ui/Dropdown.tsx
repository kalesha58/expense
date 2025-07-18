import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { SIZES } from '@/constants/theme';

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export const Dropdown = ({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  error,
  containerStyle,
  labelStyle,
  dropdownStyle,
  errorStyle,
  disabled = false,
}: DropdownProps) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  
  // Find the selected option label
  const selectedOption = options.find(option => option.value === value);
  
  const openDropdown = () => {
    if (!disabled) {
      setModalVisible(true);
    }
  };
  
  const closeDropdown = () => {
    setModalVisible(false);
  };
  
  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    closeDropdown();
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
          styles.dropdown,
          { 
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : colors.border,
            opacity: disabled ? 0.7 : 1,
          },
          dropdownStyle,
        ]}
        onPress={openDropdown}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text 
          style={[
            styles.dropdownText, 
            { 
              color: selectedOption ? colors.text : colors.placeholder 
            }
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Feather name="chevron-down" size={20} color={colors.placeholder} />
      </TouchableOpacity>
      
      {error && (
        <Text style={[styles.error, { color: colors.error }, errorStyle]}>
          {error}
        </Text>
      )}
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeDropdown}
        >
          <View 
            style={[
              styles.modalContent, 
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {label || 'Select an option'}
            </Text>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && { 
                      backgroundColor: colors.primary + '20' // 20% opacity
                    }
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Feather name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    height: 48,
  },
  dropdownText: {
    fontSize: SIZES.font,
    flex: 1,
  },
  error: {
    fontSize: SIZES.small,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  optionText: {
    fontSize: SIZES.font,
  },
});