import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { SIZES } from '@/constants/theme';
import { fetchExpensesWithLineItems } from '@/services/sqlite';

const isPdf = (file?: { uri?: string; name?: string; mimeType?: string }) =>
  file?.mimeType === 'application/pdf' ||
  file?.name?.toLowerCase().endsWith('.pdf') ||
  file?.uri?.toLowerCase().includes('.pdf');

export default function ReviewExpenseScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [expense, setExpense] = useState<any>(null);
  const [lineItems, setLineItems] = useState<any[]>([]);

  useEffect(() => {
    fetchExpensesWithLineItems().then((expenses) => {
      if (expenses?.length > 0) {
        setExpense(expenses[0]);
        setLineItems(expenses[0].lineItems || []);
      }
    });
  }, []);

  const totalAmount = lineItems.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  const handleSaveOrSubmit = async (type: 'save' | 'submit') => {
    try {
      setIsLoading(true);
      // Future API Call Here (Draft/Submit)
      router.push('/expenses/confirmation');
    } catch {
      Alert.alert('Error', `Failed to ${type} expense report`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderReceipts = (receipts: any[]) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
      {receipts.map((file, i) =>
        isPdf(file) ? (
          <View
            key={file.uri + i}
            style={{ alignItems: 'center', marginRight: 12 }}
          >
            <Feather name="file-text" size={32} color={colors.primary} />
            <Text
              style={{ color: colors.primary, fontSize: 10, maxWidth: 80 }}
              numberOfLines={1}
            >
              {file.name || file.uri.split('/').pop()}
            </Text>
          </View>
        ) : (
          <Image
            key={file.uri + i}
            source={{ uri: file.uri }}
            style={{ width: 48, height: 48, borderRadius: 8, marginRight: 8, marginBottom: 4 }}
          />
        )
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Review & Submit" showBackButton />

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
            Please review all details before submitting.
          </Text>
        </View>

        {expense ? (
          <>
            <View style={styles.card}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Report Info</Text>
              <Text style={{ color: colors.text }}>Title: {expense.title}</Text>
              <Text style={{ color: colors.text }}>Purpose: {expense.purpose}</Text>
              <Text style={{ color: colors.text }}>Type: {expense.expenseType}</Text>
              <Text style={{ color: colors.text }}>Business Unit: {expense.businessUnit}</Text>
              <Text style={{ color: colors.text }}>
                Date: {new Date(expense.date).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Line Items</Text>
              {lineItems.length ? (
                lineItems.map((item, idx) => (
                  <View
                    key={item.id || idx}
                    style={{
                      marginBottom: 20,
                      borderBottomWidth: 1,
                      borderColor: colors.border,
                      paddingBottom: 12,
                    }}
                  >
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>
                      {item.expenseType} - {item.merchant}
                    </Text>
                    <Text style={{ color: colors.text }}>
                      Amount: {item.amount} {item.currency}
                    </Text>
                    <Text style={{ color: colors.text }}>
                      Date: {new Date(item.date).toLocaleDateString()}
                    </Text>
                    <Text style={{ color: colors.text }}>
                      Project Code: {item.projectCode}
                    </Text>
                    {item.comments ? (
                      <Text style={{ color: colors.text }}>Comments: {item.comments}</Text>
                    ) : null}
                    {item.receipts?.length > 0 && renderReceipts(item.receipts)}
                  </View>
                ))
              ) : (
                <Text style={{ color: colors.placeholder }}>No line items added.</Text>
              )}
              <Text
                style={{
                  color: colors.text,
                  fontWeight: 'bold',
                  marginTop: 8,
                }}
              >
                Total: {totalAmount}
              </Text>
            </View>
          </>
        ) : (
          <Text
            style={{
              color: colors.placeholder,
              textAlign: 'center',
              marginTop: 40,
            }}
          >
            No expense data found.
          </Text>
        )}

        <View
          style={[
            styles.policyContainer,
            {
              backgroundColor: colors.warning + '15',
              borderColor: colors.warning,
            },
          ]}
        >
          <Feather name="alert-circle" size={20} color={colors.warning} />
          <Text style={[styles.policyText, { color: colors.text }]}>
            Please review all expense details carefully. Once submitted, the report will be sent for approval.
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Save as Draft"
            onPress={() => handleSaveOrSubmit('save')}
            variant="outline"
            loading={isLoading}
            style={styles.actionButton}
          />
          <Button
            title="Submit Report"
            onPress={() => handleSaveOrSubmit('submit')}
            loading={isLoading}
            style={styles.actionButton}
          />
        </View>

        <View style={styles.helpSection}>
          <Text style={[styles.helpTitle, { color: colors.text }]}>Before You Submit</Text>
          <Text style={[styles.helpText, { color: colors.placeholder }]}>
            • Verify all expense amounts are correct{'\n'}
            • Ensure receipts are attached for expenses over $25{'\n'}
            • Confirm project codes are assigned{'\n'}
            • Check merchant names for accuracy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 12 },
  headerSection: { marginBottom: 20 },
  sectionTitle: { fontSize: SIZES.xxlarge, fontWeight: '700', marginBottom: 8 },
  sectionSubtitle: { fontSize: SIZES.medium, lineHeight: 20 },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: { fontSize: SIZES.large, fontWeight: '600', marginBottom: 8 },
  policyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 24,
    borderWidth: 1,
    gap: 12,
  },
  policyText: { fontSize: SIZES.font, flex: 1, lineHeight: 20 },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: { flex: 1, marginTop: 0, marginBottom: 0 },
  helpSection: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
  },
  helpTitle: { fontSize: SIZES.medium, fontWeight: '600', marginBottom: 8 },
  helpText: { fontSize: SIZES.small, lineHeight: 18 },
});
