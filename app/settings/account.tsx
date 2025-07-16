import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Shield, Globe } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { SIZES } from '@/constants/theme';

// Language options
const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
];

export default function AccountSettingsScreen() {
  const { colors, shadows } = useTheme();
  
  // Local state for account settings
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const handleChangePassword = () => {
    // TODO: Navigate to change password screen or show modal
    console.log('Change password pressed');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Account Settings" 
        showBackButton={true}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Security
          </Text>
          
          <View style={[
            styles.card, 
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            shadows.small
          ]}>
            <Button
              title="Change Password"
              onPress={handleChangePassword}
              variant="outline"
              leftIcon={<Lock size={18} color={colors.primary} />}
              style={{ marginBottom: 20 }}
            />
            
            <View style={styles.settingRow}>
              <View style={styles.settingRowLeft}>
                <Shield size={20} color={colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingRowText, { color: colors.text }]}>
                    SSO Login
                  </Text>
                  <Text style={[styles.settingRowSubtext, { color: colors.placeholder }]}>
                    Enable single sign-on authentication
                  </Text>
                </View>
              </View>
              <Switch
                value={ssoEnabled}
                onValueChange={setSsoEnabled}
                trackColor={{ false: colors.disabled, true: colors.primary + '80' }}
                thumbColor={ssoEnabled ? colors.primary : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Preferences
          </Text>
          
          <View style={[
            styles.card, 
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            shadows.small
          ]}>
            <View style={styles.languageContainer}>
              <View style={styles.languageHeader}>
                <Globe size={20} color={colors.primary} />
                <Text style={[styles.languageTitle, { color: colors.text }]}>
                  Language
                </Text>
              </View>
              
              <Dropdown
                placeholder="Select language"
                options={LANGUAGE_OPTIONS}
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                containerStyle={{ marginBottom: 0, marginTop: 12 }}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.noteContainer}>
          <Text style={[styles.noteText, { color: colors.placeholder }]}>
            Changes to security settings may require re-authentication. 
            Some settings are managed by your organization's IT policy.
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingRowText: {
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  settingRowSubtext: {
    fontSize: SIZES.small,
    marginTop: 2,
  },
  languageContainer: {
    paddingVertical: 4,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageTitle: {
    fontSize: SIZES.font,
    fontWeight: '500',
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