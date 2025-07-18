import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { 
  WEEKLY_DATA, 
  MONTHLY_DATA, 
  YEARLY_DATA, 
  WEEKLY_TRANSACTIONS,
  MONTHLY_TRANSACTIONS,
  YEARLY_TRANSACTIONS,
  WEEKLY_METRICS,
  MONTHLY_METRICS,
  YEARLY_METRICS
} from '@/constants/statistics';
import { useTheme } from '@/hooks/useTheme';
import { SIZES } from '@/constants/theme';
import { Header } from '@/components/Header';
import MetricsCard from '@/components/MetricsCard';
import BarChart from '@/components/BarChart';
import TabSelector from '@/components/TabSelector';
import '../i18n';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const TABS = ['Weekly', 'Monthly', 'Yearly'];
const DATA_MAP = [WEEKLY_DATA, MONTHLY_DATA, YEARLY_DATA];
const TRANSACTIONS_MAP = [WEEKLY_TRANSACTIONS, MONTHLY_TRANSACTIONS, YEARLY_TRANSACTIONS];
const METRICS_MAP = [WEEKLY_METRICS, MONTHLY_METRICS, YEARLY_METRICS];

export default function StatisticsScreen() {
  const { colors, shadows } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const currentData = useMemo(() => DATA_MAP[activeTab], [activeTab]);
  const currentTransactions = useMemo(() => TRANSACTIONS_MAP[activeTab], [activeTab]);
  const currentMetrics = useMemo(() => METRICS_MAP[activeTab], [activeTab]);

  const complianceData = useMemo(() => {
    const totalWithinPolicy = currentData.reduce((sum, item) => sum + item.withinPolicy, 0);
    const totalOverPolicy = currentData.reduce((sum, item) => sum + item.overPolicy, 0);
    const complianceRate = Math.round((totalWithinPolicy / (totalWithinPolicy + totalOverPolicy)) * 100);
    
    return {
      totalWithinPolicy,
      totalOverPolicy,
      complianceRate
    };
  }, [currentData]);

  const periodLabel = useMemo(() => {
    switch (activeTab) {
      case 0: return t('statistics.thisWeek', 'This Week');
      case 1: return t('statistics.thisMonth', 'This Month');
      case 2: return t('statistics.thisYear', 'This Year');
      default: return t('statistics.thisWeek', 'This Week');
    }
  }, [activeTab, t]);

  // Calculate additional statistics
  const totalSpending = currentData.reduce((sum, item) => sum + item.withinPolicy + item.overPolicy, 0);
  const averageSpending = totalSpending / currentData.length || 0;
  const spendingChange = 12.5; // Mock change percentage

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={t('statistics.title', 'Statistics')} 
        showThemeToggle={true}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('statistics.expenseStatistics', 'Expense Statistics')}
          </Text>
          <Text style={[styles.periodLabel, { color: colors.placeholder }]}>
            {periodLabel}
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
              <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
                <Feather name="dollar-sign" size={20} color={colors.primary} />
              </View>
              <View style={[styles.changeIndicator, { backgroundColor: colors.success + '15' }]}>
                <Feather name="arrow-up-right" size={14} color={colors.success} />
                <Text style={[styles.changeText, { color: colors.success }]}>
                  +{spendingChange}%
                </Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              ${totalSpending.toLocaleString()}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.placeholder }]}>
              {t('statistics.totalSpending', 'Total Spending')}
            </Text>
          </View>

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
                  +{complianceData.complianceRate}%
                </Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {complianceData.complianceRate}%
            </Text>
            <Text style={[styles.metricLabel, { color: colors.placeholder }]}>
              {t('statistics.complianceRate', 'Compliance Rate')}
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
                  -5.2%
                </Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              ${averageSpending.toFixed(0)}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.placeholder }]}>
              {t('statistics.averageSpending', 'Average Spending')}
            </Text>
          </View>
        </View>

        {/* Compliance Overview Card */}
        <View style={[
          styles.complianceCard,
          { backgroundColor: colors.card, borderColor: colors.border },
          shadows.medium
        ]}>
          <View style={styles.complianceHeader}>
            <View style={styles.complianceTitleSection}>
              <Feather name="shield" size={24} color={colors.primary} />
              <Text style={[styles.complianceTitle, { color: colors.text }]}>
                {t('statistics.policyCompliance', 'Policy Compliance')}
              </Text>
            </View>
            <View style={[
              styles.complianceBadge,
              { backgroundColor: complianceData.complianceRate >= 80 ? colors.success + '15' : colors.warning + '15' }
            ]}>
              <Text style={[
                styles.complianceBadgeText,
                { color: complianceData.complianceRate >= 80 ? colors.success : colors.warning }
              ]}>
                {complianceData.complianceRate >= 80 ? t('statistics.excellent', 'Excellent') : t('statistics.good', 'Good')}
              </Text>
            </View>
          </View>
          
          <View style={styles.complianceContent}>
            <View style={styles.complianceProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${complianceData.complianceRate}%`,
                      backgroundColor: complianceData.complianceRate >= 80 ? colors.success : colors.warning
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: colors.placeholder }]}>
                {complianceData.complianceRate}% {t('statistics.compliant', 'compliant')}
              </Text>
            </View>
            
            <View style={styles.complianceStats}>
              <View style={styles.complianceStat}>
                <Text style={[styles.complianceStatValue, { color: colors.success }]}>
                  ${complianceData.totalWithinPolicy.toLocaleString()}
                </Text>
                <Text style={[styles.complianceStatLabel, { color: colors.placeholder }]}>
                  {t('statistics.withinPolicy', 'Within Policy')}
                </Text>
              </View>
              <View style={styles.complianceStat}>
                <Text style={[styles.complianceStatValue, { color: colors.error }]}>
                  ${complianceData.totalOverPolicy.toLocaleString()}
                </Text>
                <Text style={[styles.complianceStatLabel, { color: colors.placeholder }]}>
                  {t('statistics.overPolicy', 'Over Policy')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Section */}
        <View style={styles.tabSection}>
          <TabSelector
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </View>

        {/* Chart Section */}
        <View style={[
          styles.chartSection,
          { backgroundColor: colors.card, borderColor: colors.border },
          shadows.small
        ]}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleSection}>
              <Feather name="bar-chart-2" size={20} color={colors.primary} />
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                {t('statistics.spendingTrends', 'Spending Trends')}
              </Text>
            </View>
            <TouchableOpacity style={styles.chartAction}>
              <Text style={[styles.chartActionText, { color: colors.primary }]}>
                {t('statistics.viewDetails', 'View Details')}
              </Text>
              <Feather name="arrow-up-right" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.chartContent}>
            <BarChart data={currentData} showContainer={false} />
          </View>
        </View>

        {/* Metrics Section */}
        <View style={styles.metricsSection}>
          <MetricsCard metrics={currentMetrics} />
        </View>

        {/* Quick Insights */}
        <View style={styles.insightsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('statistics.quickInsights', 'Quick Insights')}
          </Text>
          
          <View style={styles.insightsGrid}>
            <View style={[
              styles.insightCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadows.small
            ]}>
              <View style={[styles.insightIcon, { backgroundColor: colors.success + '15' }]}>
                <Feather name="trending-up" size={20} color={colors.success} />
              </View>
              <Text style={[styles.insightTitle, { color: colors.text }]}>
                {t('statistics.spendingIncrease', 'Spending Increase')}
              </Text>
              <Text style={[styles.insightDescription, { color: colors.placeholder }]}>
                {t('statistics.spendingIncreaseDesc', 'Your spending has increased by 12.5% compared to last period')}
              </Text>
            </View>
            
            <View style={[
              styles.insightCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadows.small
            ]}>
              <View style={[styles.insightIcon, { backgroundColor: colors.warning + '15' }]}>
                <Feather name="alert-circle" size={20} color={colors.warning} />
              </View>
              <Text style={[styles.insightTitle, { color: colors.text }]}>
                {t('statistics.policyViolations', 'Policy Violations')}
              </Text>
              <Text style={[styles.insightDescription, { color: colors.placeholder }]}>
                {t('statistics.policyViolationsDesc', '3 expenses exceeded policy limits this period')}
              </Text>
            </View>
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
  periodLabel: {
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
  complianceCard: {
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  complianceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  complianceTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  complianceTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  complianceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  complianceBadgeText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  complianceContent: {
    gap: 16,
  },
  complianceProgress: {
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
  complianceStats: {
    flexDirection: 'row',
    gap: 24,
  },
  complianceStat: {
    flex: 1,
  },
  complianceStatValue: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  complianceStatLabel: {
    fontSize: SIZES.small,
  },
  tabSection: {
    marginBottom: 24,
  },
  chartSection: {
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  chartAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartActionText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  chartContent: {
    paddingTop: 8,
  },
  metricsSection: {
    marginBottom: 24,
  },
  insightsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 16,
  },
  insightsGrid: {
    gap: 12,
  },
  insightCard: {
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: SIZES.small,
    lineHeight: 18,
  },
});