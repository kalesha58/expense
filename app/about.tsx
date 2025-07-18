import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { SIZES } from '@/constants/theme';
import './i18n';
import { useTranslation } from 'react-i18next';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: '1',
    question: 'What is Oracle EBS iExpense used for?',
    answer: 'Oracle EBS iExpense is designed for submitting, managing, and tracking employee expenses within Oracle E-Business Suite. It streamlines the entire expense reporting process from submission to reimbursement.',
  },
  {
    id: '2',
    question: 'How do I know if my expense is approved?',
    answer: 'You can check your expense status on the Dashboard or through Notifications. Approved reports will show a ✅ Approved status with green indicators throughout the app.',
  },
  {
    id: '3',
    question: 'Why was my expense rejected?',
    answer: 'Common reasons include policy violations, missing receipts, incorrect expense types, or amounts exceeding limits. You can view the specific rejection reason in the expense details.',
  },
  {
    id: '4',
    question: 'How does this app connect to Oracle?',
    answer: 'The app integrates securely via REST APIs to sync data in real-time with Oracle EBS backend systems, ensuring data consistency and security compliance.',
  },
  {
    id: '5',
    question: 'Can I submit expenses offline?',
    answer: 'Yes, you can create and save expense drafts offline. They will be automatically synced when you reconnect to the internet.',
  },
  {
    id: '6',
    question: 'What file formats are supported for receipts?',
    answer: 'The app supports common image formats (JPG, PNG) and PDF files. Each receipt should be clear and legible for approval processing.',
  },
];

interface FaqAccordionProps {
  item: FaqItem;
  isExpanded: boolean;
  onToggle: () => void;
  colors: any;
}

function FaqAccordion({ item, isExpanded, onToggle, colors }: FaqAccordionProps) {
  return (
    <View style={[styles.faqItem, { borderBottomColor: colors.border }]}>
      <TouchableOpacity style={styles.faqHeader} onPress={onToggle}>
        <View style={styles.faqQuestionContainer}>
          <Feather name="help-circle" size={20} color={colors.primary} style={styles.faqIcon} />
          <Text style={[styles.faqQuestion, { color: colors.text }]}>{item.question}</Text>
        </View>
        {isExpanded ? (
          <Feather name="chevron-up" size={20} color={colors.placeholder} />
        ) : (
          <Feather name="chevron-down" size={20} color={colors.placeholder} />
        )}
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={[styles.faqAnswerText, { color: colors.placeholder }]}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
}

export default function AboutScreen() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const { colors, shadows } = useTheme();
  const { t } = useTranslation();

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const features = [
    {
      icon: Feather.name.zap,
      title: 'Real-time Sync',
      description: 'Instant synchronization with Oracle EBS backend systems',
    },
    {
      icon: Feather.name.shield,
      title: 'Policy Compliance',
      description: 'Automated policy validation and compliance checking',
    },
    {
      icon: Feather.name.building,
      title: 'Enterprise Ready',
      description: 'Built for large-scale enterprise expense management',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={t('about.title', 'About')} 
        showBackButton={true}
        showThemeToggle={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.aboutCard,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          shadows.medium
        ]}>
          <View style={styles.titleContainer}>
            <Feather name="info" size={32} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>
              {t('about.appTitle', 'Oracle iExpense')}
            </Text>
          </View>
          
          <Text style={[styles.aboutTitle, { color: colors.text }]}>
            {t('about.subtitle', 'Enterprise Expense Management')}
          </Text>
          <Text style={[styles.aboutDescription, { color: colors.placeholder }]}>
            {t('about.description', 'Oracle EBS iExpense simplifies expense reporting, allowing employees to submit, track, and manage business expenses while ensuring compliance with corporate policies through seamless integration with Oracle E-Business Suite.')}
          </Text>
          
          <View style={[styles.versionContainer, { borderTopColor: colors.border }]}>
            <Text style={[styles.versionLabel, { color: colors.placeholder }]}>
              {t('about.version', 'Version')}
            </Text>
            <Text style={[styles.versionText, { color: colors.text }]}>1.0.0</Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('about.keyFeatures', 'Key Features')}
          </Text>
          {features.map((feature, index) => {
            const IconComponent = Feather;
            return (
              <View 
                key={index} 
                style={[
                  styles.featureCard,
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                  shadows.small
                ]}
              >
                <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + '15' }]}>
                  <IconComponent name={feature.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
                  <Text style={[styles.featureDescription, { color: colors.placeholder }]}>{feature.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('about.faq', 'Frequently Asked Questions')}
          </Text>
          <View style={[
            styles.faqContainer,
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            shadows.small
          ]}>
            {FAQ_DATA.map((item) => (
              <FaqAccordion
                key={item.id}
                item={item}
                isExpanded={expandedFaq === item.id}
                onToggle={() => toggleFaq(item.id)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.placeholder }]}>
            {t('about.copyright', '© 2025 Propel Apps . All rights reserved.')}
          </Text>
          <Text style={[styles.footerSubtext, { color: colors.placeholder }]}>
            {t('about.builtWith', 'Built with React Native & Expo')}
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
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  aboutCard: {
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
  },
  aboutTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: SIZES.font,
    lineHeight: 24,
    marginBottom: 20,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  versionLabel: {
    fontSize: SIZES.small,
  },
  versionText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: SIZES.small,
    lineHeight: 20,
  },
  faqSection: {
    marginBottom: 24,
  },
  faqContainer: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  faqIcon: {
    marginRight: 12,
  },
  faqQuestion: {
    fontSize: SIZES.font,
    fontWeight: '600',
    flex: 1,
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: SIZES.small,
    lineHeight: 22,
    paddingLeft: 32,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  footerText: {
    fontSize: SIZES.small,
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: SIZES.small,
    textAlign: 'center',
  },
});