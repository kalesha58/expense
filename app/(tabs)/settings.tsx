import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Moon, 
  LogOut, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info,
  ChevronRight,
  Lock,
  Settings as SettingsIcon
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import '../i18n';
import { useTranslation } from 'react-i18next';

import { SIZES } from '@/constants/theme';
import { Header } from '@/components/Header';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { colors, isDark, setTheme, theme } = useTheme();
  const { t } = useTranslation();
  
  const handleLogout = async () => {
    await logout();
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleNavigateToProfile = () => {
    router.push('/settings/profile');
  };
  
  const handleNavigateToAccountSettings = () => {
    router.push('/settings/account');
  };
  
  const handleNavigateToAbout = () => {
    router.push('/about');
  };
  
  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode
  ) => {
    return (
      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomColor: colors.border }]}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.settingItemLeft}>
          {icon}
          <Text style={[styles.settingItemText, { color: colors.text }]}>
            {title}
          </Text>
        </View>
        
        {rightComponent || (
          onPress && <ChevronRight size={20} color={colors.placeholder} />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('settings.title')} />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.account')}
          </Text>
          
          {renderSettingItem(
            <User size={22} color={colors.primary} />,
            t('settings.profile'),
            handleNavigateToProfile
          )}
          
          {renderSettingItem(
            <SettingsIcon size={22} color={colors.primary} />,
            t('settings.accountSettings'),
            handleNavigateToAccountSettings
          )}
          
          {renderSettingItem(
            <LogOut size={22} color={colors.error} />,
            t('settings.logout'),
            handleLogout
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.preferences')}
          </Text>
          
          {renderSettingItem(
            <Moon size={22} color={colors.primary} />,
            t('settings.darkMode'),
            undefined,
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.disabled, true: colors.primary + '80' }}
              thumbColor={isDark ? colors.primary : '#f4f3f4'}
            />
          )}
          
          {renderSettingItem(
            <Bell size={22} color={colors.primary} />,
            t('settings.notifications'),
            () => {}
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.support')}
          </Text>
          
          {renderSettingItem(
            <HelpCircle size={22} color={colors.primary} />,
            t('settings.help'),
            () => {}
          )}
          
          {renderSettingItem(
            <Info size={22} color={colors.primary} />,
            t('settings.about'),
            handleNavigateToAbout
          )}
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.placeholder }]}>
            {t('settings.version')} 1.0.0
          </Text>
          <Text style={[styles.copyrightText, { color: colors.placeholder }]}>
            {t('settings.copyright')}
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
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingItemText: {
    fontSize: SIZES.font,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    fontSize: SIZES.small,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: SIZES.small,
  },
});