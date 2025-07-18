import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useExpense } from '@/hooks/useExpense';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { DatePicker } from '@/components/ui/DatePicker';
import { SIZES } from '@/constants/theme';
import { EXPENSE_TYPES, CURRENCIES, PROJECT_CODES } from '@/constants/mockData';

export default function AddLineItemScreen() {
  const router = useRouter();
  const { colors, shadows } = useTheme();
  const { addLineItem } = useExpense();
  
  const [date, setDate] = useState(new Date());
  const [expenseType, setExpenseType] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [projectCode, setProjectCode] = useState('');
  const [comments, setComments] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!expenseType) {
      newErrors.expenseType = 'Expense type is required';
    }
    
    if (!merchant.trim()) {
      newErrors.merchant = 'Merchant name is required';
    }
    
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!currency) {
      newErrors.currency = 'Currency is required';
    }
    
    if (!projectCode) {
      newErrors.projectCode = 'Project code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddLineItem = () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      // Add line item to expense
      addLineItem({
        date,
        expenseType,
        merchant,
        amount: parseFloat(amount),
        currency,
        projectCode,
        comments,
        receipt: receipt || undefined,
      });
      
      // Reset form
      setDate(new Date());
      setExpenseType('');
      setMerchant('');
      setAmount('');
      setCurrency('USD');
      setProjectCode('');
      setComments('');
      setReceipt(null);
      setErrors({});
      
      Alert.alert('Success', 'Expense line item added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense line item');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddAnother = () => {
    handleAddLineItem();
    // Form is already reset in handleAddLineItem
  };
  
  const handleContinueToReview = () => {
    if (validateForm()) {
      handleAddLineItem();
      router.push('/expenses/review');
    }
  };
  
  const handleUploadReceipt = () => {
    // In a real app, this would use expo-image-picker
    // For this demo, we'll just set a mock receipt URL
    setReceipt('https://images.unsplash.com/photo-1572636583595-7f0525c8f3ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80');
  };
  
  const handleRemoveReceipt = () => {
    setReceipt(null);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Add Expense Line Item" 
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
            Expense Line Item Details
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.placeholder }]}>
            Add detailed information for this expense item
          </Text>
        </View>
        
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }, shadows.small]}>
          <DatePicker
            label="Date"
            value={date}
            onChange={setDate}
            containerStyle={styles.inputContainer}
          />
          
          <Dropdown
            label="Expense Type"
            placeholder="Select expense type"
            options={EXPENSE_TYPES}
            value={expenseType}
            onChange={setExpenseType}
            error={errors.expenseType}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Merchant / Vendor"
            placeholder="Enter merchant name"
            value={merchant}
            onChangeText={setMerchant}
            error={errors.merchant}
            containerStyle={styles.inputContainer}
          />
          
          <View style={styles.amountRow}>
            <View style={{ flex: 2 }}>
              <Input
                label="Amount"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                error={errors.amount}
                containerStyle={styles.inputContainer}
              />
            </View>
            
            <View style={{ flex: 3 }}>
              <Dropdown
                label="Currency"
                placeholder="Select currency"
                options={CURRENCIES}
                value={currency}
                onChange={setCurrency}
                error={errors.currency}
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>
          
          <Dropdown
            label="Project Code"
            placeholder="Select project code"
            options={PROJECT_CODES}
            value={projectCode}
            onChange={setProjectCode}
            error={errors.projectCode}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Comments (Optional)"
            placeholder="Enter additional details"
            value={comments}
            onChangeText={setComments}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ height: 80, paddingTop: 12 }}
            containerStyle={styles.inputContainer}
          />
        </View>
        
        <View style={[styles.receiptCard, { backgroundColor: colors.card, borderColor: colors.border }, shadows.small]}>
          <Text style={[styles.receiptLabel, { color: colors.text }]}>
            Receipt
          </Text>
          
          {receipt ? (
            <View style={styles.receiptContainer}>
              <Image 
                source={{ uri: receipt }} 
                style={styles.receiptImage} 
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={[styles.removeButton, { backgroundColor: colors.error }]}
                onPress={handleRemoveReceipt}
              >
                <Feather name="x" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadContainer}>
              <Button
                title="Take Photo"
                onPress={handleUploadReceipt}
                variant="outline"
                leftIcon={<Feather name="camera" size={18} color={colors.primary} />}
                style={styles.uploadButton}
              />
              <Button
                title="Upload Receipt"
                onPress={handleUploadReceipt}
                variant="outline"
                leftIcon={<Feather name="upload" size={18} color={colors.primary} />}
                style={styles.uploadButton}
              />
            </View>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Add Another"
            onPress={handleAddAnother}
            variant="outline"
            loading={isLoading}
            style={styles.actionButton}
          />
          <Button
            title="Continue to Review"
            onPress={handleContinueToReview}
            style={styles.actionButton}
          />
        </View>
        
        <View style={styles.helpSection}>
          <Text style={[styles.helpTitle, { color: colors.text }]}>
            Tips for Better Expense Tracking
          </Text>
          <Text style={[styles.helpText, { color: colors.placeholder }]}>
            • Always attach receipts for expenses over $25{'\n'}
            • Use specific merchant names for better categorization{'\n'}
            • Add detailed comments for complex expenses
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
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  amountRow: {
    flexDirection: 'row',
    gap: 12,
  },
  receiptCard: {
    borderRadius: SIZES.radius * 2,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  receiptLabel: {
    fontSize: SIZES.font,
    marginBottom: 16,
    fontWeight: '500',
  },
  uploadContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
  },
  receiptContainer: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  receiptImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
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