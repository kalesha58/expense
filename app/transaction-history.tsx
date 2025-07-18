import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { TransactionCard } from '@/components/TransactionCard';
import { Input } from '@/components/ui/Input';
import { mockTransactionHistory, Transaction } from '@/constants/mockTransactionData';
import { SIZES } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import './i18n';

const { width } = Dimensions.get('window');

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const { colors, shadows } = useTheme();
  const { t } = useTranslation();
  
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactionHistory);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactionHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(transaction => 
        transaction.title.toLowerCase().includes(text.toLowerCase()) ||
        transaction.reportTitle.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  };
  
  const handleSync = async () => {
    setIsSyncing(true);
    
    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      Alert.alert(
        'Sync Complete', 
        'Transaction sync triggered successfully. All pending transactions will be processed.',
        [{ text: 'OK' }]
      );
      
      // Update some pending transactions to synced for demo
      const updatedTransactions = transactions.map(transaction => {
        if (transaction.status === 'pending' && Math.random() > 0.5) {
          return { ...transaction, status: 'synced' as const, synced: true };
        }
        return transaction;
      });
      
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
    }, 2000);
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      Alert.alert('Refreshed', 'Transaction history has been updated.');
    }, 1500);
  };
  
  const handleTransactionPress = (transaction: Transaction) => {
    Alert.alert(
      'Transaction Details',
      `Transaction: ${transaction.title}\nReport: ${transaction.reportTitle}\nStatus: ${transaction.status}\nAmount: ${transaction.amount}`,
      [{ text: 'OK' }]
    );
  };
  

  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={t('transactionHistory.title', 'Transaction History')} 
        showBackButton={true}
        showThemeToggle={true}
        rightComponent={
          <TouchableOpacity 
            style={[
              styles.syncButton,
              { backgroundColor: colors.primary },
              isSyncing && { opacity: 0.7 }
            ]}
            onPress={handleSync}
            disabled={isSyncing}
          >
            <Feather 
              name="refresh-cw" 
              size={20} 
              color="#FFFFFF" 
              style={isSyncing ? { transform: [{ rotate: '180deg' }] } : {}}
            />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('transactionHistory.transactionOverview', 'Transaction Overview')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            {t('transactionHistory.realTimeSync', 'Real-time sync status and transaction logs')}
          </Text>
        </View>

        {/* Key Metrics Cards */}
        <View style={styles.metricsGrid}>
          <View style={[
            styles.metricCard,
            { backgroundColor: colors.card, borderColor: colors.border },
            shadows.small
          ]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: colors.success + '15' }]}>
                <Feather name="check-circle" size={20} color={colors.success} />
              </View>
              <View style={[styles.changeIndicator, { backgroundColor: colors.success + '15' }]}>
                <Feather name="arrow-up-right" size={14} color={colors.success} />
                <Text style={[styles.changeText, { color: colors.success }]}>
                  +{transactions.filter(t => t.status === 'synced').length}
                </Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {transactions.filter(t => t.status === 'synced').length}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.placeholder }]}>
              {t('transactionHistory.synced', 'Synced')}
            </Text>
          </View>

          <View style={[
            styles.metricCard,
            { backgroundColor: colors.card, borderColor: colors.border },
            shadows.small
          ]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: colors.warning + '15' }]}>
                <Feather name="clock" size={20} color={colors.warning} />
              </View>
              <View style={[styles.changeIndicator, { backgroundColor: colors.warning + '15' }]}>
                <Feather name="arrow-down-right" size={14} color={colors.warning} />
                <Text style={[styles.changeText, { color: colors.warning }]}>
                  {transactions.filter(t => t.status === 'pending').length}
                </Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {transactions.filter(t => t.status === 'pending').length}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.placeholder }]}>
              {t('transactionHistory.pending', 'Pending')}
            </Text>
          </View>

          <View style={[
            styles.metricCard,
            { backgroundColor: colors.card, borderColor: colors.border },
            shadows.small
          ]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: colors.error + '15' }]}>
                <Feather name="alert-circle" size={20} color={colors.error} />
              </View>
              <View style={[styles.changeIndicator, { backgroundColor: colors.error + '15' }]}>
                <Feather name="arrow-down-right" size={14} color={colors.error} />
                <Text style={[styles.changeText, { color: colors.error }]}>
                  {transactions.filter(t => t.status === 'failed').length}
                </Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {transactions.filter(t => t.status === 'failed').length}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.placeholder }]}>
              {t('transactionHistory.failed', 'Failed')}
            </Text>
          </View>
        </View>

        {/* Sync Status Card */}
        <View style={[
          styles.syncStatusCard,
          { backgroundColor: colors.card, borderColor: colors.border },
          shadows.medium
        ]}>
          <View style={styles.syncStatusHeader}>
            <View style={styles.syncStatusTitleSection}>
              <Feather name="shield" size={24} color={colors.primary} />
              <Text style={[styles.syncStatusTitle, { color: colors.text }]}>
                {t('transactionHistory.syncStatus', 'Sync Status')}
              </Text>
            </View>
            <View style={[
              styles.syncStatusBadge,
              { backgroundColor: isSyncing ? colors.warning + '15' : colors.success + '15' }
            ]}>
              <Text style={[
                styles.syncStatusBadgeText,
                { color: isSyncing ? colors.warning : colors.success }
              ]}>
                {isSyncing ? t('transactionHistory.syncing', 'Syncing') : t('transactionHistory.online', 'Online')}
              </Text>
            </View>
          </View>
          
          <View style={styles.syncStatusContent}>
            <View style={styles.syncProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${(transactions.filter(t => t.status === 'synced').length / transactions.length) * 100}%`,
                      backgroundColor: colors.success
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: colors.placeholder }]}>
                {Math.round((transactions.filter(t => t.status === 'synced').length / transactions.length) * 100)}% {t('transactionHistory.synced', 'synced')}
              </Text>
            </View>
            
            <View style={styles.syncStats}>
              <View style={styles.syncStat}>
                <Text style={[styles.syncStatValue, { color: colors.success }]}>
                  {transactions.filter(t => t.status === 'synced').length}
                </Text>
                <Text style={[styles.syncStatLabel, { color: colors.placeholder }]}>
                  {t('transactionHistory.synced', 'Synced')}
                </Text>
              </View>
              <View style={styles.syncStat}>
                <Text style={[styles.syncStatValue, { color: colors.warning }]}>
                  {transactions.filter(t => t.status === 'pending').length}
                </Text>
                <Text style={[styles.syncStatLabel, { color: colors.placeholder }]}>
                  {t('transactionHistory.pending', 'Pending')}
                </Text>
              </View>
              <View style={styles.syncStat}>
                <Text style={[styles.syncStatValue, { color: colors.error }]}>
                  {transactions.filter(t => t.status === 'failed').length}
                </Text>
                <Text style={[styles.syncStatLabel, { color: colors.placeholder }]}>
                  {t('transactionHistory.failed', 'Failed')}
                </Text>
              </View>
            </View>
          </View>
        </View>


        {/* Transactions List */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.transactionsTitle, { color: colors.text }]}>
              {t('transactionHistory.recentTransactions', 'Recent Transactions')}
            </Text>
            <Text style={[styles.transactionsSubtitle, { color: colors.placeholder }]}>
              {filteredTransactions.length} {t('transactionHistory.transactions', 'transactions')}
            </Text>
          </View>
          
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionCard 
                key={transaction.id}
                transaction={transaction} 
                onPress={() => handleTransactionPress(transaction)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.placeholder + '15' }]}>
                <Feather name="clock" size={48} color={colors.placeholder} />
              </View>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                {t('transactionHistory.noTransactions', 'No transactions found')}
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
                {t('transactionHistory.noTransactionsDesc', 'Your transaction history will appear here')}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('transactionHistory.quickActions', 'Quick Actions')}
          </Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[
              styles.quickActionCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadows.small
            ]}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Feather name="download" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.quickActionTitle, { color: colors.text }]}>
                {t('transactionHistory.exportData', 'Export Data')}
              </Text>
              <Text style={[styles.quickActionDescription, { color: colors.placeholder }]}>
                {t('transactionHistory.exportDataDesc', 'Download transaction report')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[
              styles.quickActionCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadows.small
            ]}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.success + '15' }]}>
                <Feather name="upload" size={20} color={colors.success} />
              </View>
              <Text style={[styles.quickActionTitle, { color: colors.text }]}>
                {t('transactionHistory.importData', 'Import Data')}
              </Text>
              <Text style={[styles.quickActionDescription, { color: colors.placeholder }]}>
                {t('transactionHistory.importDataDesc', 'Upload transaction file')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[
              styles.quickActionCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadows.small
            ]}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.warning + '15' }]}>
                <Feather name="eye" size={20} color={colors.warning} />
              </View>
              <Text style={[styles.quickActionTitle, { color: colors.text }]}>
                {t('transactionHistory.viewAnalytics', 'View Analytics')}
              </Text>
              <Text style={[styles.quickActionDescription, { color: colors.placeholder }]}>
                {t('transactionHistory.viewAnalyticsDesc', 'Transaction insights')}
              </Text>
            </TouchableOpacity>
          </View>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  changeText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  syncStatusCard: {
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  syncStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  syncStatusTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncStatusTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  syncStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  syncStatusBadgeText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  syncStatusContent: {
    gap: 16,
  },
  syncProgress: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  syncStats: {
    flexDirection: 'row',
    gap: 24,
  },
  syncStat: {
    flex: 1,
  },
  syncStatValue: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  syncStatLabel: {
    fontSize: SIZES.small,
  },
  searchSection: {
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  transactionsSection: {
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  transactionsSubtitle: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: SIZES.small,
    lineHeight: 18,
  },
  syncButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});