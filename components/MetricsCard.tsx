import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DollarSign, CheckCircle, AlertTriangle } from 'lucide-react-native';

import { useTheme } from '@/hooks/useTheme';
import { SIZES } from '@/constants/theme';
import { MetricData } from '@/constants/statistics';

interface MetricsCardProps {
  metrics: MetricData;
}

export default function MetricsCard({ metrics }: MetricsCardProps) {
  const { colors } = useTheme();
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const metricsData = [
    {
      title: 'Total Submitted',
      value: formatCurrency(metrics.totalSubmitted),
      icon: DollarSign,
      color: colors.primary,
      bgColor: colors.primary + '15',
    },
    {
      title: 'Total Approved',
      value: formatCurrency(metrics.totalApproved),
      icon: CheckCircle,
      color: colors.success,
      bgColor: colors.success + '15',
    },
    {
      title: 'Policy Violations',
      value: metrics.policyViolations.toString(),
      icon: AlertTriangle,
      color: colors.warning,
      bgColor: colors.warning + '15',
    },
  ];

  return (
    <View style={styles.container}>
      {metricsData.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <View key={metric.title} style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: metric.bgColor }]}>
              <IconComponent size={24} color={metric.color} />
            </View>
            <Text style={[styles.metricTitle, { color: metric.color }]}>{metric.title}</Text>
            <Text style={[styles.metricValue, { color: metric.color }]}>
              {metric.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SIZES.base * 1.5,
  },
  metricCard: {
    flex: 1,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: SIZES.small,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    textAlign: 'center',
  },
});