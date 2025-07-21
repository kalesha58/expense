import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SIZES } from '@/constants/theme';
import '../../i18n';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

// Mock data for expenses list
const MOCK_EXPENSES = [
  { 
    id: '1', 
    title: 'Business Trip to New York', 
    amount: 1250.75, 
    status: 'approved', 
    date: '2025-07-10',
    items: 5,
    category: 'Travel'
  },
  { 
    id: '2', 
    title: 'Office Supplies', 
    amount: 89.99, 
    status: 'pending', 
    date: '2025-07-08',
    items: 2,
    category: 'Office'
  },
  { 
    id: '3', 
    title: 'Client Dinner', 
    amount: 156.50, 
    status: 'rejected', 
    date: '2025-07-05',
    items: 1,
    category: 'Meals'
  },
  { 
    id: '4', 
    title: 'Conference Registration', 
    amount: 499.00, 
    status: 'approved', 
    date: '2025-07-01',
    items: 1,
    category: 'Events'
  },
  { 
    id: '5', 
    title: 'Team Building Event', 
    amount: 350.25, 
    status: 'pending', 
    date: '2025-06-28',
    items: 3,
    category: 'Events'
  },
  { 
    id: '6', 
    title: 'Software Subscription', 
    amount: 79.99, 
    status: 'approved', 
    date: '2025-06-25',
    items: 1,
    category: 'Software'
  },
  { 
    id: '7', 
    title: 'Marketing Materials', 
    amount: 245.50, 
    status: 'rejected', 
    date: '2025-06-20',
    items: 4,
    category: 'Marketing'
  },
];

export default function ExpensesListScreen() {
  const router = useRouter();
  const { colors, shadows } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState(MOCK_EXPENSES);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const { t } = useTranslation();
  
  // Calculate statistics
  const totalExpenses = MOCK_EXPENSES.length;
  const approvedExpenses = MOCK_EXPENSES.filter(e => e.status === 'approved').length;
  const pendingExpenses = MOCK_EXPENSES.filter(e => e.status === 'pending').length;
  const totalAmount = MOCK_EXPENSES.reduce((sum, expense) => sum + expense.amount, 0);
  
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
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredExpenses(MOCK_EXPENSES);
    } else {
      const filtered = MOCK_EXPENSES.filter(expense => 
        expense.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredExpenses(filtered);
    }
  };
  
  const handleCreateExpense = () => {
    router.push({ pathname: '/expenses/create', params: { fromDashboard: 'false' } });
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === 'all') {
      setFilteredExpenses(MOCK_EXPENSES);
    } else {
      const filtered = MOCK_EXPENSES.filter(expense => expense.status === filter);
      setFilteredExpenses(filtered);
    }
  };
  
  const renderExpenseItem = ({ item }: { item: typeof MOCK_EXPENSES[0] }) => (
    <TouchableOpacity 
      style={[
        styles.expenseCard, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        shadows.medium
      ]}
      onPress={() => router.push(`/expenses/${item.id}`)}
    >
      <View style={styles.expenseHeader}>
        <View style={styles.expenseTitleSection}>
          <Text style={[styles.expenseTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[styles.categoryChip, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {item.category}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-horizontal" size={20} color={colors.placeholder} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.expenseContent}>
        <View style={styles.expenseMainInfo}>
          <View style={styles.amountSection}>
            <Feather name="dollar-sign" size={16} color={colors.primary} />
            <Text style={[styles.expenseAmount, { color: colors.text }]}>
              ${item.amount.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.expenseDetails}>
            <View style={styles.detailItem}>
              <Feather name="calendar" size={14} color={colors.placeholder} />
              <Text style={[styles.detailText, { color: colors.placeholder }]}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Feather name="file-text" size={14} color={colors.placeholder} />
              <Text style={[styles.detailText, { color: colors.placeholder }]}>
                {item.items} {item.items === 1 ? 'item' : 'items'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.expenseActions}>
          <View style={[
            styles.statusChip,
            { backgroundColor: getStatusColor(item.status) + '15' }
          ]}>
            {getStatusIcon(item.status)}
            <Text 
              style={[
                styles.statusText, 
                { color: getStatusColor(item.status) }
              ]}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          
          <Feather name="arrow-right" size={16} color={colors.placeholder} />
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={t('expenses.title', 'Expenses')} 
        showThemeToggle={true}
      />
      
      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={[
          styles.statCard,
          { backgroundColor: colors.card, borderColor: colors.border },
          shadows.small
        ]}>
          <View style={[styles.statIcon, { backgroundColor: colors.primary + '15' }]}>
            <Feather name="dollar-sign" size={20} color={colors.primary} />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              ${totalAmount.toFixed(0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.placeholder }]}>
              {t('expenses.totalAmount', 'Total Amount')}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.statCard,
          { backgroundColor: colors.card, borderColor: colors.border },
          shadows.small
        ]}>
          <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
            <Feather name="check-circle" size={20} color={colors.success} />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {approvedExpenses}
            </Text>
            <Text style={[styles.statLabel, { color: colors.placeholder }]}>
              {t('expenses.approved', 'Approved')}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.statCard,
          { backgroundColor: colors.card, borderColor: colors.border },
          shadows.small
        ]}>
          <View style={[styles.statIcon, { backgroundColor: colors.warning + '15' }]}>
            <Feather name="clock" size={20} color={colors.warning} />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {pendingExpenses}
            </Text>
            <Text style={[styles.statLabel, { color: colors.placeholder }]}>
              {t('expenses.pending', 'Pending')}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInput,
          { backgroundColor: colors.card, borderColor: colors.border }
        ]}>
          <Feather name="search" size={20} color={colors.placeholder} />
          <Input
            placeholder={t('expenses.searchPlaceholder', 'Search expenses...')}
            value={searchQuery}
            onChangeText={handleSearch}
            containerStyle={styles.inputContainer}
            style={styles.input}
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { backgroundColor: colors.card, borderColor: colors.border }
          ]}
        >
          <Feather name="filter" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {[
          { key: 'all', label: t('expenses.all', 'All'), count: totalExpenses },
          { key: 'approved', label: t('expenses.approved', 'Approved'), count: approvedExpenses },
          { key: 'pending', label: t('expenses.pending', 'Pending'), count: pendingExpenses },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              }
            ]}
            onPress={() => handleFilterChange(filter.key)}
          >
            <Text style={[
              styles.filterTabText,
              { 
                color: selectedFilter === filter.key ? '#FFFFFF' : colors.text 
              }
            ]}>
              {filter.label}
            </Text>
            <View style={[
              styles.filterCount,
              { 
                backgroundColor: selectedFilter === filter.key ? 'rgba(255,255,255,0.2)' : colors.primary + '15'
              }
            ]}>
              <Text style={[
                styles.filterCountText,
                { 
                  color: selectedFilter === filter.key ? '#FFFFFF' : colors.primary 
                }
              ]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '15' }]}>
              <Feather name="file-text" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('expenses.noExpensesTitle', 'No expenses found')}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.placeholder }]}>
              {t('expenses.noExpensesSubtitle', 'Try adjusting your search or filters')}
            </Text>
          </View>
        }
      />
      
      <View style={[styles.fabContainer, { shadowColor: colors.text }]}>
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={handleCreateExpense}
        >
          <Feather name="plus-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 16,
    gap: 12,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    fontSize: SIZES.font,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 16,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  filterTabText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  filterCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  listContent: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  expenseCard: {
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  expenseTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  expenseTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  moreButton: {
    padding: 4,
  },
  expenseContent: {
    gap: 16,
  },
  expenseMainInfo: {
    gap: 12,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expenseAmount: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  expenseDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: SIZES.small,
  },
  expenseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: SIZES.font,
    textAlign: 'center',
    lineHeight: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});