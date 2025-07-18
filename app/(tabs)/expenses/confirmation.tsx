import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { SIZES } from '@/constants/theme';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Mock data for confirmation
  const reportId = 'EXP-' + Math.floor(100000 + Math.random() * 900000);
  const status = 'Submitted';
  
  const handleViewReport = () => {
    // In a real app, this would navigate to the report details
    router.push('/expenses');
  };
  
  const handleGoToDashboard = () => {
    router.push('/');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
          <Feather name="check-circle" size={64} color={colors.success} />
        </View>
        
        <Text style={[styles.title, { color: colors.text }]}>
          Success!
        </Text>
        
        <Text style={[styles.message, { color: colors.text }]}>
          Your expense report has been successfully submitted for approval.
        </Text>
        
        <View style={[styles.detailsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
              Report ID
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {reportId}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
              Status
            </Text>
            <Text style={[styles.detailValue, { color: colors.success }]}>
              {status}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.placeholder }]}>
              Submission Date
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.note, { color: colors.placeholder }]}>
          You will receive a notification when your report is approved or if additional information is required.
        </Text>
        
        <View style={styles.actionsContainer}>
          <Button
            title="View Report"
            onPress={handleViewReport}
            variant="outline"
            style={{ flex: 1 }}
          />
          <Button
            title="Go to Dashboard"
            onPress={handleGoToDashboard}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  detailsContainer: {
    width: '100%',
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: SIZES.font,
  },
  detailValue: {
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  note: {
    fontSize: SIZES.small,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
});