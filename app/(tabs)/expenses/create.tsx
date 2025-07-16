import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useExpense } from '@/hooks/useExpense';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { DatePicker } from '@/components/ui/DatePicker';
import { SIZES } from '@/constants/theme';
import { EXPENSE_TYPES, BUSINESS_UNITS } from '@/constants/mockData';

export default function CreateExpenseScreen() {
  const router = useRouter();
  const { colors, shadows } = useTheme();
  const { header, updateHeader, saveAsDraft } = useExpense();
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!header.title.trim()) {
      newErrors.title = 'Report title is required';
    }
    
    if (!header.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }
    
    if (!header.expenseType) {
      newErrors.expenseType = 'Expense type is required';
    }
    
    if (!header.businessUnit) {
      newErrors.businessUnit = 'Business unit is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveAsDraft = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      await saveAsDraft();
      Alert.alert('Success', 'Expense report saved as draft');
      router.push('/expenses');
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense report');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleContinue = () => {
    if (!validateForm()) return;
    router.push('/expenses/add-line-item');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Create Expense Report" 
        showBackButton={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Expense Report Details
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.placeholder }]}>
            Fill in the basic information for your expense report
          </Text>
        </View>
        
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }, shadows.small]}>
          <Input
            label="Report Title"
            placeholder="Enter report title"
            value={header.title}
            onChangeText={(text) => updateHeader({ title: text })}
            error={errors.title}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Purpose"
            placeholder="Enter purpose of expense"
            value={header.purpose}
            onChangeText={(text) => updateHeader({ purpose: text })}
            error={errors.purpose}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ height: 80, paddingTop: 12 }}
            containerStyle={styles.inputContainer}
          />
          
          <Dropdown
            label="Expense Type"
            placeholder="Select expense type"
            options={EXPENSE_TYPES}
            value={header.expenseType}
            onChange={(value) => updateHeader({ expenseType: value })}
            error={errors.expenseType}
            containerStyle={styles.inputContainer}
          />
          
          <Dropdown
            label="Business Unit"
            placeholder="Select business unit"
            options={BUSINESS_UNITS}
            value={header.businessUnit}
            onChange={(value) => updateHeader({ businessUnit: value })}
            error={errors.businessUnit}
            containerStyle={styles.inputContainer}
          />
          
          <DatePicker
            label="Date"
            value={header.date}
            onChange={(date) => updateHeader({ date })}
            containerStyle={styles.inputContainer}
          />
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Save as Draft"
            onPress={handleSaveAsDraft}
            variant="outline"
            loading={isLoading}
            style={styles.actionButton}
          />
          <Button
            title="Continue"
            onPress={handleContinue}
            style={styles.actionButton}
          />
        </View>
        
        <View style={styles.helpSection}>
          <Text style={[styles.helpTitle, { color: colors.text }]}>
            Need Help?
          </Text>
          <Text style={[styles.helpText, { color: colors.placeholder }]}>
            You can save your progress as a draft and continue later. 
            All information will be preserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: SIZES.xxlarge,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: SIZES.medium,
    lineHeight: 20,
  },
  formCard: {
    borderRadius: SIZES.radius * 2,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
  },
  helpSection: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
  },
  helpTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: 8,
  },
  helpText: {
    fontSize: SIZES.small,
    lineHeight: 18,
  },
});