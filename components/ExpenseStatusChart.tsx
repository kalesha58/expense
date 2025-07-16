import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { SIZES } from '@/constants/theme';

type ExpenseStatusData = {
  approved: number;
  pending: number;
  rejected: number;
};

type ExpenseStatusChartProps = {
  data: ExpenseStatusData;
};

export const ExpenseStatusChart = ({ data }: ExpenseStatusChartProps) => {
  const { colors } = useTheme();
  
  const total = data.approved + data.pending + data.rejected;
  
  // Calculate percentages
  const approvedPercentage = total > 0 ? (data.approved / total) * 100 : 0;
  const pendingPercentage = total > 0 ? (data.pending / total) * 100 : 0;
  const rejectedPercentage = total > 0 ? (data.rejected / total) * 100 : 0;
  
  // Bar chart data
  const chartData = [
    {
      label: 'Approved',
      count: data.approved,
      percentage: approvedPercentage,
      color: colors.success,
      icon: <CheckCircle size={16} color={colors.success} />,
    },
    {
      label: 'Pending',
      count: data.pending,
      percentage: pendingPercentage,
      color: colors.warning,
      icon: <Clock size={16} color={colors.warning} />,
    },
    {
      label: 'Rejected',
      count: data.rejected,
      percentage: rejectedPercentage,
      color: colors.error,
      icon: <AlertCircle size={16} color={colors.error} />,
    },
  ];
  
  // Find the maximum count for scaling
  const maxCount = Math.max(data.approved, data.pending, data.rejected);
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Total Expenses: {total}
      </Text>
      
      <View style={styles.chartContainer}>
        {chartData.map((item, index) => {
          // Calculate bar height based on percentage of max value
          const barHeight = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${barHeight}%`,
                      backgroundColor: item.color + '30', // 30% opacity
                      borderColor: item.color,
                    }
                  ]} 
                />
                <Text style={[styles.barValue, { color: colors.text }]}>
                  {item.count}
                </Text>
              </View>
              
              <View style={styles.labelContainer}>
                {item.icon}
                <Text style={[styles.label, { color: colors.text }]}>
                  {item.label}
                </Text>
                <Text style={[styles.percentage, { color: colors.placeholder }]}>
                  {item.percentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      
      {/* Summary stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.summaryItem}>
              <View style={styles.summaryIconContainer}>
                {item.icon}
                <Text style={[styles.summaryCount, { color: colors.text }]}>
                  {item.count}
                </Text>
              </View>
              <Text style={[styles.summaryLabel, { color: colors.placeholder }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  barWrapper: {
    height: 80,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  bar: {
    width: '80%',
    borderWidth: 2,
    borderRadius: 4,
    minHeight: 8,
  },
  barValue: {
    position: 'absolute',
    top: -20,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  labelContainer: {
    alignItems: 'center',
    marginTop: 8,
    gap: 2,
  },
  label: {
    fontSize: SIZES.small,
    fontWeight: '500',
    textAlign: 'center',
  },
  percentage: {
    fontSize: SIZES.small - 2,
  },
  summaryContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  summaryCount: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: SIZES.small,
    textAlign: 'center',
  },
});