import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { SIZES } from '@/constants/theme';
import { Transaction } from '@/constants/mockTransactionData';

type TransactionCardProps = {
  transaction: Transaction;
  onPress?: () => void;
};

export const TransactionCard = ({ transaction, onPress }: TransactionCardProps) => {
  const { colors, shadows } = useTheme();
  
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'synced':
        return <Feather name="check-circle" size={20} color={colors.success} />;
      case 'pending':
        return <Feather name="clock" size={20} color={colors.warning} />;
      case 'failed':
        return <Feather name="alert-circle" size={20} color={colors.error} />;
      default:
        return <Feather name="clock" size={20} color={colors.placeholder} />;
    }
  };
  
  const getStatusColor = () => {
    switch (transaction.status) {
      case 'synced':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'failed':
        return colors.error;
      default:
        return colors.placeholder;
    }
  };
  
  const getStatusText = () => {
    switch (transaction.status) {
      case 'synced':
        return 'Synced';
      case 'pending':
        return 'Pending Sync';
      case 'failed':
        return 'Sync Failed';
      default:
        return 'Unknown';
    }
  };
  
  const getLocalIcon = () => {
    return transaction.local ? (
      <Feather name="database" size={16} color={colors.primary} />
    ) : (
      <Feather name="cloud" size={16} color={colors.secondary} />
    );
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        shadows.small
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {transaction.title}
          </Text>
          <Text style={[styles.date, { color: colors.placeholder }]}>
            {transaction.date}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text 
            style={[
              styles.statusText, 
              { color: getStatusColor() }
            ]}
          >
            {getStatusText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.reportInfo}>
          <Text style={[styles.reportLabel, { color: colors.placeholder }]}>
            Report
          </Text>
          <Text style={[styles.reportTitle, { color: colors.text }]} numberOfLines={1}>
            {transaction.reportTitle}
          </Text>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: colors.text }]}>
            {transaction.amount}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.storageInfo}>
          {getLocalIcon()}
          <Text style={[styles.storageText, { color: colors.placeholder }]}>
            {transaction.local ? 'Local Storage' : 'Cloud Only'}
          </Text>
        </View>
        
        {transaction.synced ? (
          <View style={styles.syncedIndicator}>
            <Feather name="wifi" size={16} color={colors.success} />
            <Text style={[styles.syncedText, { color: colors.success }]}>
              Online
            </Text>
          </View>
        ) : (
          <View style={styles.offlineIndicator}>
            <Feather name="wifi-off" size={16} color={colors.warning} />
            <Text style={[styles.offlineText, { color: colors.warning }]}>
              Offline
            </Text>
          </View>
        )}
        
        <Feather name="chevron-right" size={16} color={colors.placeholder} />
      </View>
      
      {transaction.errorMessage && (
        <View style={[
          styles.errorContainer, 
          { 
            backgroundColor: colors.error + '15',
            borderColor: colors.error,
          }
        ]}>
          <Feather name="alert-circle" size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            {transaction.errorMessage}
          </Text>
        </View>
      )}
      
      {transaction.apiEndpoint && (
        <View style={styles.apiInfo}>
          <Text style={[styles.apiText, { color: colors.placeholder }]}>
            {transaction.apiEndpoint}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: SIZES.small,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportLabel: {
    fontSize: SIZES.small - 2,
    marginBottom: 2,
  },
  reportTitle: {
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  storageText: {
    fontSize: SIZES.small,
  },
  syncedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncedText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  offlineText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: SIZES.radius - 2,
    marginTop: 8,
    borderWidth: 1,
    gap: 6,
  },
  errorText: {
    fontSize: SIZES.small,
    flex: 1,
  },
  apiInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  apiText: {
    fontSize: SIZES.small - 2,
    fontFamily: 'monospace',
  },
});