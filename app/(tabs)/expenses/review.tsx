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
import { AlertCircle, ChevronRight, Edit2 } from 'lucide-react-native';
import { useExpense } from '@/hooks/useExpense';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { SIZES } from '@/constants/theme';
import { EXPENSE_TYPES, BUSINESS_UNITS, CURRENCIES, PROJECT_CODES } from '@/constants/mockData';

export default function ReviewExpenseScreen() {
  const router = useRouter();
  const { colors, shadows } = useTheme();
  const { header, lineItems, saveAsDraft, submitReport } = useExpense();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Helper function to get label from value
  const getLabelFromValue = (value: string, options: { label: string; value: string }[]) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };
  
  // Calculate total amount
  const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);
  
  const handleSaveAsDraft = async () => {
    try {
      setIsLoading(true);
      await saveAsDraft();
      router.push('/expenses/confirmation');
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense report');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await submitReport();
      router.push('/expenses/confirmation');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit expense report');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Review & Submit" 
        showBackButton={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Review Expense Report
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.placeholder }]}>
            Please review all details before submitting your expense report
          </Text>
        </View>
        
        <View style={[styles.reportCard, { backgroundColor: colors.card, borderColor: colors.border }, shadows.small]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Report Details
            </Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/expenses/create')}
            >
              <Edit2 size={16} color={colors.primary} />
              <Text style={[styles.editText, { color: colors.primary }]}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
              Title
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {header.title}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
              Purpose
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {header.purpose}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
              Expense Type
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {getLabelFromValue(header.expenseType, EXPENSE_TYPES)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
              Business Unit
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {getLabelFromValue(header.businessUnit, BUSINESS_UNITS)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
              Date
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatDate(header.date)}
            </Text>
          </View>
        </View>
        
        <View style={[styles.lineItemsCard, { backgroundColor: colors.card, borderColor: colors.border }, shadows.small]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Expense Line Items ({lineItems.length})
            </Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/expenses/add-line-item')}
            >
              <Edit2 size={16} color={colors.primary} />
              <Text style={[styles.editText, { color: colors.primary }]}>
                Add More
              </Text>
            </TouchableOpacity>
          </View>
          
          {lineItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.noItemsText, { color: colors.placeholder }]}>
                No expense line items added yet
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
                Add at least one expense item to continue
              </Text>
            </View>
          ) : (
            lineItems.map((item, index) => (
              <View 
                key={item.id}
                style={[
                  styles.lineItemContainer,
                  index < lineItems.length - 1 && { 
                    borderBottomWidth: 1, 
                    borderBottomColor: colors.border 
                  }
                ]}
              >
                <View style={styles.lineItemHeader}>
                  <Text style={[styles.lineItemTitle, { color: colors.text }]}>
                    {getLabelFromValue(item.expenseType, EXPENSE_TYPES)}
                  </Text>
                  <Text style={[styles.lineItemAmount, { color: colors.primary }]}>
                    {item.amount.toFixed(2)} {item.currency}
                  </Text>
                </View>
                
                <View style={styles.lineItemDetails}>
                  <View style={styles.lineItemDetail}>
                    <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
                      Date
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {formatDate(item.date)}
                    </Text>
                  </View>
                  
                  <View style={styles.lineItemDetail}>
                    <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
                      Merchant
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {item.merchant}
                    </Text>
                  </View>
                  
                  <View style={styles.lineItemDetail}>
                    <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
                      Project
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {getLabelFromValue(item.projectCode, PROJECT_CODES)}
                    </Text>
                  </View>
                  
                  {item.comments && (
                    <View style={styles.lineItemDetail}>
                      <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
                        Comments
                      </Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {item.comments}
                      </Text>
                    </View>
                  )}
                  
                  {item.receipt && (
                    <Image 
                      source={{ uri: item.receipt }} 
                      style={styles.receiptThumbnail} 
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
            ))
          )}
          
          {lineItems.length > 0 && (
            <View style={[styles.totalContainer, { borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Total Amount
              </Text>
              <Text style={[styles.totalAmount, { color: colors.primary }]}>
                ${totalAmount.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
        
        <View style={[styles.policyContainer, { 
          backgroundColor: colors.warning + '15',
          borderColor: colors.warning,
        }]}>
          <AlertCircle size={20} color={colors.warning} />
          <Text style={[styles.policyText, { color: colors.text }]}>
            Please review all expense details before submitting. Once submitted, the report will be sent for approval.
          </Text>
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
            title="Submit Report"
            onPress={handleSubmit}
            style={styles.actionButton}
          />
        </View>
        
        <View style={styles.helpSection}>
          <Text style={[styles.helpTitle, { color: colors.text }]}>
            Before You Submit
          </Text>
          <Text style={[styles.helpText, { color: colors.placeholder }]}>
            • Verify all expense amounts are correct{'\n'}
            • Ensure receipts are attached for expenses over $25{'\n'}
            • Check that project codes are properly assigned{'\n'}
            • Review merchant names for accuracy
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
  reportCard: {
    borderRadius: SIZES.radius * 2,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  lineItemsCard: {
    borderRadius: SIZES.radius * 2,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: SIZES.small,
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noItemsText: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  lineItemContainer: {
    paddingVertical: 16,
  },
  lineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lineItemTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  lineItemAmount: {
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  lineItemDetails: {
    gap: 8,
  },
  lineItemDetail: {
    marginBottom: 6,
  },
  receiptThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: SIZES.radius,
    marginTop: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
  },
  policyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 24,
    borderWidth: 1,
    gap: 12,
  },
  policyText: {
    fontSize: SIZES.font,
    flex: 1,
    lineHeight: 20,
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