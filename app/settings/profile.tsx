import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/Input';
import { SIZES } from '@/constants/theme';

// Mock user data
const MOCK_USER_DATA = {
  fullName: 'John Smith',
  employeeId: 'EMP001234',
  email: 'john.smith@oracle.com',
  phone: '+1 (555) 123-4567',
  businessUnit: 'Sales',
  department: 'Enterprise Sales',
};

export default function ProfileScreen() {
  const { colors, shadows } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Profile" 
        showBackButton={true}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            User Information
          </Text>
          
          <View style={[
            styles.card, 
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            shadows.small
          ]}>
            <Input
              label="Full Name"
              value={MOCK_USER_DATA.fullName}
              editable={false}
              inputStyle={{ backgroundColor: colors.disabled, color: colors.placeholder }}
              containerStyle={{ marginBottom: 16 }}
            />
            
            <Input
              label="Employee ID"
              value={MOCK_USER_DATA.employeeId}
              editable={false}
              inputStyle={{ backgroundColor: colors.disabled, color: colors.placeholder }}
              containerStyle={{ marginBottom: 16 }}
            />
            
            <Input
              label="Email"
              value={MOCK_USER_DATA.email}
              editable={false}
              inputStyle={{ backgroundColor: colors.disabled, color: colors.placeholder }}
              containerStyle={{ marginBottom: 16 }}
            />
            
            <Input
              label="Phone"
              value={MOCK_USER_DATA.phone}
              editable={false}
              inputStyle={{ backgroundColor: colors.disabled, color: colors.placeholder }}
              containerStyle={{ marginBottom: 16 }}
            />
            
            <Input
              label="Business Unit"
              value={MOCK_USER_DATA.businessUnit}
              editable={false}
              inputStyle={{ backgroundColor: colors.disabled, color: colors.placeholder }}
              containerStyle={{ marginBottom: 16 }}
            />
            
            <Input
              label="Department"
              value={MOCK_USER_DATA.department}
              editable={false}
              inputStyle={{ backgroundColor: colors.disabled, color: colors.placeholder }}
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
        </View>
        
        <View style={styles.noteContainer}>
          <Text style={[styles.noteText, { color: colors.placeholder }]}>
            Profile information is managed by your system administrator. 
            Contact HR for any changes to your personal details.
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    borderRadius: SIZES.radius,
    padding: 20,
    borderWidth: 1,
  },
  noteContainer: {
    // Removed paddingHorizontal since scrollContent handles it
  },
  noteText: {
    fontSize: SIZES.small,
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});