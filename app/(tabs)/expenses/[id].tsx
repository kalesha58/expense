import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { SIZES } from '@/constants/theme';
import * as FileSystem from 'expo-file-system';
import { Snackbar } from 'react-native-paper';
import '../../i18n';
import { useTranslation } from 'react-i18next';

// Mock data for expense details
const MOCK_EXPENSE_DETAILS = {
  '1': {
    id: '1',
    title: 'Business Trip to New York',
    purpose: 'Annual sales conference and client meetings',
    expenseType: 'Travel',
    businessUnit: 'Sales',
    date: '2025-07-10',
    status: 'approved',
    approvedBy: 'Jane Smith',
    approvedDate: '2025-07-12',
    rejectionReason: null,
    totalAmount: 1250.75,
    lineItems: [
      {
        id: '1-1',
        date: '2025-07-08',
        expenseType: 'Airfare',
        merchant: 'Delta Airlines',
        amount: 450.00,
        currency: 'USD',
        projectCode: 'PRJ001',
        receipt: ''
      },
      {
        id: '1-2',
        date: '2025-07-08',
        expenseType: 'Hotel',
        merchant: 'Marriott',
        amount: 650.75,
        currency: 'USD',
        projectCode: 'PRJ001',
        receipt: ''
      },
      {
        id: '1-3',
        date: '2025-07-09',
        expenseType: 'Meals',
        merchant: 'The Cheesecake Factory',
        amount: 85.00,
        currency: 'USD',
        projectCode: 'PRJ001',
        receipt: ''
      },
      {
        id: '1-4',
        date: '2025-07-10',
        expenseType: 'Taxi',
        merchant: 'NYC Yellow Cab',
        amount: 35.00,
        currency: 'USD',
        projectCode: 'PRJ001',
        receipt: ''
      },
      {
        id: '1-5',
        date: '2025-07-10',
        expenseType: 'Miscellaneous',
        merchant: 'Office Depot',
        amount: 30.00,
        currency: 'USD',
        projectCode: 'PRJ001',
        receipt: ''
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Office Supplies',
    purpose: 'Quarterly office supply replenishment',
    expenseType: 'Office Supplies',
    businessUnit: 'Administration',
    date: '2025-07-08',
    status: 'pending',
    approvedBy: null,
    approvedDate: null,
    rejectionReason: null,
    totalAmount: 89.99,
    lineItems: [
      {
        id: '2-1',
        date: '2025-07-08',
        expenseType: 'Office Supplies',
        merchant: 'Staples',
        amount: 89.99,
        currency: 'USD',
        projectCode: 'PRJ005',
        receipt: 'https://images.unsplash.com/photo-1553531888-0ea58ad0fbd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlJTIwc3VwcGxpZXN8ZW58MHx8MHx8&ixlib=rb-4.0.3&q=80&w=400'
      },
    ],
  },
  '3': {
    id: '3',
    title: 'Client Dinner',
    purpose: 'Business development meeting with potential client',
    expenseType: 'Meals',
    businessUnit: 'Sales',
    date: '2025-07-05',
    status: 'rejected',
    approvedBy: 'John Doe',
    approvedDate: '2025-07-07',
    rejectionReason: 'Amount exceeds the allowed limit for client meals',
    totalAmount: 156.50,
    lineItems: [
      {
        id: '3-1',
        date: '2025-07-05',
        expenseType: 'Meals',
        merchant: 'The Capital Grille',
        amount: 156.50,
        currency: 'USD',
        projectCode: 'PRJ002',
        receipt: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fG1lYWxzJTIwcmVzdGF1cmFudHxlbnwwfHwwfHw%3D&ixlib=rb-4.0.3&q=80&w=400'
      },
    ],
  },
};


export default function ExpenseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, shadows } = useTheme();
  const [snackbar, setSnackbar] = React.useState({ visible: false, message: '', error: false });
  const { t } = useTranslation();
  
  // Get expense details from mock data
  const expense = MOCK_EXPENSE_DETAILS[id as keyof typeof MOCK_EXPENSE_DETAILS];
  
  if (!expense) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header 
          title={t('expenseDetails.title', 'Expense Details')} 
          showBackButton={true}
          showThemeToggle={true}
        />
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            {t('expenseDetails.notFound', 'Expense report not found')}
          </Text>
          <Button
            title={t('expenseDetails.goBack', 'Go Back')}
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'rejected':
        return colors.error;
      default:
        return colors.placeholder;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Feather name="check-circle" size={20} color={colors.success} />;
      case 'pending':
        return <Feather name="clock" size={20} color={colors.warning} />;
      case 'rejected':
        return <Feather name="alert-circle" size={20} color={colors.error} />;
      default:
        return null;
    }
  };

  // Download handler for receipts with Android/iOS permissions and snackbar
  const handleDownloadReceipt = async (url: string) => {
    try {
      let hasPermission = true;
      let MediaLibrary: any;
      if (Platform.OS !== 'web') {
        MediaLibrary = await import('expo-media-library');
        const { status } = await MediaLibrary.requestPermissionsAsync();
        hasPermission = status === 'granted';
      }
      if (!hasPermission) {
        setSnackbar({ visible: true, message: 'Permission denied to save files.', error: true });
        return;
      }
      const fileName = url.split('/').pop()?.split('?')[0] || 'receipt.jpg';
      const fileUri = FileSystem.documentDirectory + fileName;
      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const result = await downloadResumable.downloadAsync();
      if (result && result.uri) {
        if (Platform.OS !== 'web' && MediaLibrary) {
          await MediaLibrary.saveToLibraryAsync(result.uri);
        }
        setSnackbar({ visible: true, message: 'Downloaded to gallery!', error: false });
      } else {
        setSnackbar({ visible: true, message: 'Download failed.', error: true });
      }
    } catch (error) {
      setSnackbar({ visible: true, message: 'Could not download the image.', error: true });
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={t('expenseDetails.title', 'Expense Details')} 
        showBackButton={true}
        showThemeToggle={true}
        rightComponent={
          <TouchableOpacity style={styles.shareButton}>
            <Feather name="share-2" size={20} color={colors.primary} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Expense Summary Card */}
        <View style={[
          styles.headerCard, 
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          shadows.medium
        ]}>
          <View style={styles.expenseHeader}>
            <View style={styles.titleSection}>
              <Text style={[styles.expenseTitle, { color: colors.text }]}>
                {expense.title}
              </Text>
              <View style={styles.statusChip}>
                {getStatusIcon(expense.status)}
                <Text 
                  style={[
                    styles.statusText, 
                    { color: getStatusColor(expense.status) }
                  ]}
                >
                  {t(`expenseDetails.${expense.status}`, expense.status.charAt(0).toUpperCase() + expense.status.slice(1))}
                </Text>
              </View>
            </View>
            
            <View style={styles.amountSection}>
              <Text style={[styles.amountLabel, { color: colors.placeholder }]}>
                {t('expenseDetails.totalAmount', 'Total Amount')}
              </Text>
              <Text style={[styles.amountValue, { color: colors.text }]}>
                ${expense.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Feather name="file-text" size={16} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
                  {t('expenseDetails.reportId', 'Report ID')}
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  EXP-{expense.id}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Feather name="calendar" size={16} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
                  {t('expenseDetails.date', 'Date')}
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {new Date(expense.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Feather name="dollar-sign" size={16} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
                  {t('expenseDetails.expenseType', 'Expense Type')}
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {expense.expenseType}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Feather name="building" size={16} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
                  {t('expenseDetails.businessUnit', 'Business Unit')}
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {expense.businessUnit}
                </Text>
              </View>
            </View>
          </View>
          
          {expense.status === 'approved' && expense.approvedDate && (
            <View style={styles.approvalInfo}>
              <Text style={[styles.approvalLabel, { color: colors.placeholder }]}>
                {t('expenseDetails.approvedBy', 'Approved by')} {expense.approvedBy} {t('expenseDetails.on', 'on')} {new Date(expense.approvedDate).toLocaleDateString()}
              </Text>
            </View>
          )}
          
          {expense.status === 'rejected' && expense.rejectionReason && (
            <View style={[
              styles.rejectionContainer, 
              { 
                backgroundColor: colors.error + '15',
                borderColor: colors.error,
              }
            ]}>
              <Feather name="alert-circle" size={16} color={colors.error} />
              <Text style={[styles.rejectionText, { color: colors.error }]}>
                {expense.rejectionReason}
              </Text>
            </View>
          )}
        </View>
        
        {/* Purpose Card */}
        <View style={[
          styles.purposeCard, 
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          shadows.small
        ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('expenseDetails.purpose', 'Purpose')}
          </Text>
          <Text style={[styles.purposeText, { color: colors.text }]}>
            {expense.purpose}
          </Text>
        </View>
        
        {/* Line Items Section */}
        <View style={styles.lineItemsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('expenseDetails.lineItems', 'Line Items')} ({expense.lineItems.length})
          </Text>
          
          {expense.lineItems.map((item, index) => (
            <View 
              key={item.id}
              style={[
                styles.lineItemCard, 
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
                shadows.small
              ]}
            >
              <View style={styles.lineItemHeader}>
                <View style={styles.lineItemInfo}>
                  <Text style={[styles.lineItemTitle, { color: colors.text }]}>
                    {item.expenseType}
                  </Text>
                  <Text style={[styles.lineItemMerchant, { color: colors.placeholder }]}>
                    {item.merchant}
                  </Text>
                </View>
                <Text style={[styles.lineItemAmount, { color: colors.text }]}>
                  ${item.amount.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.lineItemDetails}>
                <View style={styles.lineItemDetail}>
                  <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
                    {t('expenseDetails.date', 'Date')}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.lineItemDetail}>
                  <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
                    {t('expenseDetails.projectCode', 'Project Code')}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {item.projectCode}
                  </Text>
                </View>
              </View>
              
              {item.receipt && (
                <View style={styles.receiptContainer}>
                  <Text style={[styles.receiptLabel, { color: colors.placeholder }]}>
                    {t('expenseDetails.receipt', 'Receipt')}
                  </Text>
                  <View style={styles.receiptImageContainer}>
                    <Image 
                      source={{ uri: item.receipt }} 
                      style={styles.receiptImage} 
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={[
                        styles.downloadButton, 
                        { backgroundColor: colors.primary }
                      ]}
                      onPress={() => handleDownloadReceipt(item.receipt)}
                    >
                      <Feather name="download" size={16} color="#FFFFFF" />
                      <Text style={styles.downloadText}>{t('expenseDetails.download', 'Download')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {expense.status === 'pending' && (
            <>
              <Button
                title={t('expenseDetails.editReport', 'Edit Report')}
                onPress={() => {}}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title={t('expenseDetails.cancelReport', 'Cancel Report')}
                onPress={() => {}}
                variant="danger"
                style={{ flex: 1 }}
              />
            </>
          )}
          
          {expense.status === 'rejected' && (
            <Button
              title={t('expenseDetails.resubmit', 'Resubmit with Changes')}
              onPress={() => {}}
              style={{ flex: 1 }}
            />
          )}
          
          {expense.status === 'approved' && (
            <Button
              title={t('expenseDetails.downloadReport', 'Download Report')}
              onPress={() => {}}
              leftIcon={<Feather name="download" size={18} color="#FFFFFF" />}
              style={{ flex: 1 }}
            />
          )}
        </View>
        
        {/* Help Section */}
        <View style={[
          styles.helpCard,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          shadows.small
        ]}>
          <View style={styles.helpHeader}>
            <Feather name="help-circle" size={20} color={colors.primary} />
            <Text style={[styles.helpTitle, { color: colors.text }]}>
              {t('expenseDetails.helpTitle', 'Need Help?')}
            </Text>
          </View>
          <Text style={[styles.helpText, { color: colors.placeholder }]}>
            {t('expenseDetails.helpText', '• Download receipts for your records\n• Share expense reports with your team\n• Contact support for any questions\n• Review line items for accuracy')}
          </Text>
        </View>
      </ScrollView>
      
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        style={{ backgroundColor: snackbar.error ? '#F5222D' : '#0572CE' }}
      >
        {snackbar.message}
      </Snackbar>
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
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  notFoundText: {
    fontSize: SIZES.large,
    textAlign: 'center',
  },
  shareButton: {
    padding: 4,
  },
  headerCard: {
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  expenseHeader: {
    marginBottom: 16,
  },
  titleSection: {
    marginBottom: 12,
  },
  expenseTitle: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 32,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  statusText: {
    fontSize: SIZES.small,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountSection: {
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: SIZES.small,
    marginBottom: 4,
    fontWeight: '500',
  },
  amountValue: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 20,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: SIZES.small,
    marginBottom: 2,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: SIZES.font,
    fontWeight: '600',
    lineHeight: 20,
  },
  approvalInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: SIZES.radius,
  },
  approvalLabel: {
    fontSize: SIZES.small,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  rejectionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: SIZES.radius,
    marginTop: 12,
    borderWidth: 1,
    gap: 12,
  },
  rejectionText: {
    fontSize: SIZES.small,
    flex: 1,
    lineHeight: 18,
  },
  purposeCard: {
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: 12,
  },
  purposeText: {
    fontSize: SIZES.font,
    lineHeight: 24,
  },
  lineItemsSection: {
    marginBottom: 24,
  },
  lineItemCard: {
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  lineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  lineItemInfo: {
    flex: 1,
  },
  lineItemTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: 4,
  },
  lineItemMerchant: {
    fontSize: SIZES.small,
  },
  lineItemAmount: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  lineItemDetails: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  lineItemDetail: {
    flex: 1,
  },
  receiptContainer: {
    marginTop: 16,
  },
  receiptLabel: {
    fontSize: SIZES.small,
    marginBottom: 12,
    fontWeight: '500',
  },
  receiptImageContainer: {
    position: 'relative',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.radius,
    marginBottom: 12,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-end',
    gap: 6,
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  helpCard: {
    borderRadius: SIZES.radius,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  helpTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  helpText: {
    fontSize: SIZES.small,
    lineHeight: 20,
  },
});