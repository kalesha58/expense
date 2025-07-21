import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface Department {
  DepartmentCode: string;
  DepartmentName: string;
}

interface Props {
  department: Department;
  selected: boolean;
  onPress: () => void;
}

export default function DepartmentListItem({ department, selected, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.item,
        { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary + '15' : colors.card },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: colors.text }]}> 
        {department.DepartmentCode} - {department.DepartmentName}
      </Text>
      {selected && <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
}); 