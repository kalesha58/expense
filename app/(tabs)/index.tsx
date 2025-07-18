import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { SIZES } from '@/constants/theme';
import { Card } from 'react-native-paper';
import '../i18n';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors, shadows } = useTheme();
  const { t } = useTranslation();
  
  // Mock data for dashboard
  const recentExpenses = [
    { id: '1', title: 'Business Trip to New York', amount: 1250.75, status: 'approved', date: '2025-07-10' },
    { id: '2', title: 'Office Supplies', amount: 89.99, status: 'pending', date: '2025-07-08' },
    { id: '3', title: 'Client Dinner', amount: 156.50, status: 'rejected', date: '2025-07-05' },
  ];
  
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
        return <Feather name="check-circle" size={16} color={colors.success} />;
      case 'pending':
        return <Feather name="clock" size={16} color={colors.warning} />;
      case 'rejected':
        return <Feather name="alert-circle" size={16} color={colors.error} />;
      default:
        return null;
    }
  };
  
  const handleCreateExpense = () => {
    router.push('/expenses/create');
  };
  
  const handleViewAllExpenses = () => {
    router.push('/expenses');
  };

  const handleTransactionHistory = () => {
    router.push('/transaction-history');
  };

  const handleViewExpenseDetails = (id: string) => {
    router.push(`/expenses/${id}`);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={t('dashboard.title', 'Dashboard')} 
        showThemeToggle={true}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={[styles.welcomeText, { color: colors.placeholder }]}>
              {t('dashboard.welcome', 'Welcome back,')}
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.username || t('dashboard.user', 'User')}
            </Text>
          </View>
          <View style={[styles.welcomeIcon, { backgroundColor: colors.primary + '15' }]}>
            <Feather name="home" size={24} color={colors.primary} />
          </View>
        </View>
        
        {/* Main Modules Grid */}
        <View style={styles.modulesGrid}>
          {/* Create Expense Module */}
          <TouchableOpacity 
            style={[
              styles.moduleTile,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadows.medium
            ]}
            onPress={handleCreateExpense}
          >
            <View style={styles.moduleHeader}>
              <View style={[styles.moduleIcon, { backgroundColor: colors.primary + '15' }]}>
                <Feather name="plus-circle" size={24} color={colors.primary} />
              </View>
              <View style={styles.moduleBadge}>
                <Text style={[styles.moduleBadgeText, { color: colors.primary }]}>
                  {t('dashboard.new', 'NEW')}
                </Text>
              </View>
            </View>
            
            <View style={styles.moduleContent}>
              <Text style={[styles.moduleTitle, { color: colors.text }]}>
                {t('dashboard.createExpense', 'Create Expense')}
              </Text>
              <Text style={[styles.moduleDescription, { color: colors.placeholder }]}>
                {t('dashboard.createExpenseDesc', 'Submit new expense report')}
              </Text>
            </View>
            
            <View style={styles.moduleFooter}>
              <Text style={[styles.moduleStatValue, { color: colors.text }]}>
                5 min
              </Text>
              <Feather name="arrow-right" size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
          
          {/* View Expenses Module */}
          <TouchableOpacity 
            style={[
              styles.moduleTile,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadows.medium
            ]}
            onPress={handleViewAllExpenses}
          >
            <View style={styles.moduleHeader}>
              <View style={[styles.moduleIcon, { backgroundColor: colors.secondary + '15' }]}>
                <Feather name="file-text" size={24} color={colors.secondary} />
              </View>
              <View style={[styles.moduleBadge, { backgroundColor: colors.warning + '15' }]}>
                <Text style={[styles.moduleBadgeText, { color: colors.warning }]}>
                  5
                </Text>
              </View>
            </View>
            
            <View style={styles.moduleContent}>
              <Text style={[styles.moduleTitle, { color: colors.text }]}>
                {t('dashboard.viewExpenses', 'View Expenses')}
              </Text>
              <Text style={[styles.moduleDescription, { color: colors.placeholder }]}>
                {t('dashboard.viewExpensesDesc', 'Browse all reports')}
              </Text>
            </View>
            
            <View style={styles.moduleFooter}>
              <Text style={[styles.moduleStatValue, { color: colors.text }]}>
                3 pending
              </Text>
              <Feather name="arrow-right" size={16} color={colors.secondary} />
            </View>
          </TouchableOpacity>
          
          {/* Transaction History Module */}
          <TouchableOpacity 
            style={[
              styles.moduleTile,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadows.medium
            ]}
            onPress={handleTransactionHistory}
          >
            <View style={styles.moduleHeader}>
              <View style={[styles.moduleIcon, { backgroundColor: colors.success + '15' }]}>
                <Feather name="activity" size={24} color={colors.success} />
              </View>
              <View style={[styles.moduleBadge, { backgroundColor: colors.success + '15' }]}>
                <Text style={[styles.moduleBadgeText, { color: colors.success }]}>
                  {t('dashboard.live', 'LIVE')}
                </Text>
              </View>
            </View>
            
            <View style={styles.moduleContent}>
              <Text style={[styles.moduleTitle, { color: colors.text }]}>
                {t('dashboard.transactionHistory', 'History')}
              </Text>
              <Text style={[styles.moduleDescription, { color: colors.placeholder }]}>
                {t('dashboard.transactionHistoryDesc', 'View transaction logs')}
              </Text>
            </View>
            
            <View style={styles.moduleFooter}>
              <Text style={[styles.moduleStatValue, { color: colors.text }]}>
                284 total
              </Text>
              <Feather name="arrow-right" size={16} color={colors.success} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Recent Expenses Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('dashboard.recentExpenses', 'Recent Expenses')}
            </Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={handleViewAllExpenses}
            >
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                {t('dashboard.viewAll', 'View All')}
              </Text>
              <Feather name="arrow-right" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {recentExpenses.map((expense) => (
            <TouchableOpacity
              key={expense.id}
              style={[
                styles.expenseCard,
                { backgroundColor: colors.card, borderColor: colors.border },
                shadows.small
              ]}
              onPress={() => handleViewExpenseDetails(expense.id)}
            >
              <View style={styles.expenseCardContent}>
                <View style={styles.expenseHeader}>
                  <View style={styles.expenseInfo}>
                    <Text style={[styles.expenseTitle, { color: colors.text }]} numberOfLines={1}>
                      {expense.title}
                    </Text>
                    <Text style={[styles.expenseDate, { color: colors.placeholder }]}>
                      {new Date(expense.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(expense.status) + '15' }
                  ]}>
                    {getStatusIcon(expense.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(expense.status) }]}>
                      {t(`dashboard.${expense.status}`, expense.status.charAt(0).toUpperCase() + expense.status.slice(1))}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.expenseFooter}>
                  <Text style={[styles.expenseAmount, { color: colors.text }]}>
                    ${expense.amount.toFixed(2)}
                  </Text>
                  <Feather name="arrow-right" size={16} color={colors.placeholder} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: SIZES.font,
    marginBottom: 4,
  },
  userName: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modulesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  moduleTile: {
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    flex: 1,
    minHeight: 120,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  moduleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  moduleBadgeText: {
    fontSize: SIZES.small,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  moduleContent: {
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: SIZES.small,
    lineHeight: 16,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleStatValue: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  expenseCard: {
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  expenseCardContent: {
    gap: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expenseInfo: {
    flex: 1,
    marginRight: 12,
  },
  expenseTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: SIZES.small,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseAmount: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
});

