import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import SearchBar from '@/components/ui/SearchBar';
import DepartmentListItem from '@/components/DepartmentListItem';
import useDepartments from '@/hooks/useDepartments';
import { Feather } from '@expo/vector-icons';

interface Department {
  DepartmentCode: string;
  DepartmentName: string;
}

export default function SelectDepartmentScreen() {
  const { colors, shadows } = useTheme();
  const router = useRouter();
  const { departments, loading, error } = useDepartments();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Department | null>(null);

  const filteredDepartments = useMemo(() => {
    if (!search.trim()) return departments as Department[];
    return (departments as Department[]).filter(dep =>
      dep.DepartmentName.toLowerCase().includes(search.toLowerCase()) ||
      dep.DepartmentCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  const handleContinue = () => {
    if (selected) {
      // You can pass the selected department as a param if needed
      router.replace({ pathname: '/activity' as const });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Header title="Select Department" showBackButton showThemeToggle />
        {/* Welcome Section */}
        <View style={[styles.welcomeSection, { backgroundColor: colors.card, borderColor: colors.primary + '33' }, shadows.medium]}>
          <View style={[styles.welcomeIcon, { backgroundColor: colors.primary + '15' }]}> 
            <Feather name="users" size={32} color={colors.primary} />
          </View>
          <View style={styles.welcomeContent}>
            <Text style={[styles.welcomeTitle, { color: colors.primary }]}>Select Your Department</Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.text }]}>To personalize your experience, please choose your department from the list below.</Text>
          </View>
        </View>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or code"
          style={styles.searchBar}
        />
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={[styles.error, { color: colors.error }]}>Failed to load departments.</Text>
        ) : filteredDepartments.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Feather name="search" size={48} color={colors.placeholder} style={{ marginBottom: 8 }} />
            <Text style={[styles.noResultsText, { color: colors.placeholder }]}>No departments found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredDepartments}
            keyExtractor={(item: Department) => item.DepartmentCode}
            renderItem={({ item }: { item: Department }) => (
              <DepartmentListItem
                department={item}
                selected={selected?.DepartmentCode === item.DepartmentCode}
                onPress={() => setSelected(item)}
              />
            )}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />
        )}
        <View style={[styles.footer, { backgroundColor: colors.background }]}> 
          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: selected ? colors.primary : colors.disabled }]}
            disabled={!selected}
            onPress={handleContinue}
            activeOpacity={selected ? 0.7 : 1}
          >
            <Text style={[styles.continueText, { color: '#fff' }]}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  searchBar: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  continueBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
  },
  welcomeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.85,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8,
  },
}); 