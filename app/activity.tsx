import { useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, RefreshControl, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withDelay,
  withSequence,
  Easing
} from "react-native-reanimated";

import ActivityCard from "@/components/ActivityCard";
import { useTheme } from "@/hooks/useTheme";
import { SIZES } from "@/constants/theme";
import { Header } from "@/components/Header";
import { 
  Zap, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  Activity,
  Shield,
  Database,
  Bell,
  Building2,
  FileText,
  TrendingUp,
  Rocket
} from "lucide-react-native";

import { ApiState } from "@/@types/api";
import { useApiSequence } from "@/hooks/useApiSquence";

const { width } = Dimensions.get('window');

export default function ActivityScreen() {
  const { colors, shadows } = useTheme();
  const { state, retryApi, resetSequence, apiSequence } = useApiSequence();
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  const progressOpacity = useSharedValue(0);
  const progressScale = useSharedValue(0.8);
  const statsOpacity = useSharedValue(0);
  const statsTranslateY = useSharedValue(20);
  
  // Reset the sequence when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      resetSequence();
      
      // Animate header
      headerOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
      headerTranslateY.value = withDelay(200, withTiming(0, { duration: 600 }));
      
      // Animate progress
      progressOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
      progressScale.value = withDelay(400, withTiming(1, { duration: 500 }));
      
      // Animate stats
      statsOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
      statsTranslateY.value = withDelay(600, withTiming(0, { duration: 500 }));
      
      return () => {};
    }, [resetSequence])
  );

  const getApiState = (apiId: string): ApiState => {
    const apiStates = {
      currencies: state.currencies,
      departments: state.departments,
      notifications: state.notifications,
      organizations: state.organizations,
      expenseItems: state.expenseItems,
    };
    
    return apiStates[apiId as keyof typeof apiStates] || { status: "idle" };
  };

  const completedCount = apiSequence.filter(api => getApiState(api.id).status === "success").length;
  const totalCount = apiSequence.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isComplete = state.isComplete;

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
    transform: [{ scale: progressScale.value }],
  }));

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
    transform: [{ translateY: statsTranslateY.value }],
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Activity" 
        showThemeToggle={true}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={resetSequence}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header Section */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.headerContent}>
            <View style={[styles.headerIcon, { backgroundColor: colors.primary + '15' }]}>
              <Rocket size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              {isComplete ? 'System Ready!' : 'Initializing System'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.placeholder }]}>
              {isComplete 
                ? 'All systems are operational and ready for use'
                : 'Setting up your experience and configuring services'
              }
            </Text>
          </View>
        </Animated.View>

        {/* Progress Section */}
        <Animated.View style={[styles.progressSection, progressAnimatedStyle]}>
          <View style={[
            styles.progressCard,
            { backgroundColor: colors.card, borderColor: colors.border },
            shadows.medium
          ]}>
            <View style={styles.progressHeader}>
              <View style={styles.progressTitleSection}>
                <Activity size={24} color={colors.primary} />
                <Text style={[styles.progressTitle, { color: colors.text }]}>
                  System Progress
                </Text>
              </View>
              <View style={[
                styles.progressBadge,
                { backgroundColor: isComplete ? colors.success + '15' : colors.warning + '15' }
              ]}>
                <Text style={[
                  styles.progressBadgeText,
                  { color: isComplete ? colors.success : colors.warning }
                ]}>
                  {isComplete ? 'Complete' : 'In Progress'}
                </Text>
              </View>
            </View>
            
            <View style={styles.progressContent}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${progressPercentage}%`,
                      backgroundColor: isComplete ? colors.success : colors.primary
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: colors.placeholder }]}>
                {completedCount} of {totalCount} services initialized
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View style={[styles.statsSection, statsAnimatedStyle]}>
          <View style={styles.statsGrid}>
            <View style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadows.small
            ]}>
              <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
                <CheckCircle size={20} color={colors.success} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {completedCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.placeholder }]}>
                Completed
              </Text>
            </View>

            <View style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadows.small
            ]}>
              <View style={[styles.statIcon, { backgroundColor: colors.warning + '15' }]}>
                <Clock size={20} color={colors.warning} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {apiSequence.filter(api => getApiState(api.id).status === "loading").length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.placeholder }]}>
                Loading
              </Text>
            </View>

            <View style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadows.small
            ]}>
              <View style={[styles.statIcon, { backgroundColor: colors.error + '15' }]}>
                <AlertCircle size={20} color={colors.error} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {apiSequence.filter(api => getApiState(api.id).status === "error").length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.placeholder }]}>
                Errors
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <View style={styles.servicesHeader}>
            <Text style={[styles.servicesTitle, { color: colors.text }]}>
              Service Status
            </Text>
            <Text style={[styles.servicesSubtitle, { color: colors.placeholder }]}>
              Real-time initialization progress
            </Text>
          </View>
          
          {apiSequence.map((api, index) => (
            <ActivityCard
              key={api.id}
              apiInfo={api}
              state={getApiState(api.id)}
              index={index}
              onRetry={() => retryApi(api.id)}
            />
          ))}
        </View>

        {/* Completion Section */}
        {isComplete && (
          <View style={[
            styles.completeContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
            shadows.medium
          ]}>
            <View style={[styles.completeIcon, { backgroundColor: colors.success + '15' }]}>
              <CheckCircle size={48} color={colors.success} />
            </View>
            <Text style={[styles.completeTitle, { color: colors.text }]}>
              All Systems Operational!
            </Text>
            <Text style={[styles.completeText, { color: colors.placeholder }]}>
              Your expense management system is fully initialized and ready for use. You'll be redirected to the dashboard shortly.
            </Text>
            <View style={styles.completeFeatures}>
              <View style={styles.completeFeature}>
                <Shield size={16} color={colors.success} />
                <Text style={[styles.completeFeatureText, { color: colors.placeholder }]}>
                  Secure authentication
                </Text>
              </View>
              <View style={styles.completeFeature}>
                <Database size={16} color={colors.success} />
                <Text style={[styles.completeFeatureText, { color: colors.placeholder }]}>
                  Data synchronization
                </Text>
              </View>
              <View style={styles.completeFeature}>
                <Bell size={16} color={colors.success} />
                <Text style={[styles.completeFeatureText, { color: colors.placeholder }]}>
                  Notification system
                </Text>
              </View>
            </View>
          </View>
        )}
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
  headerContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    lineHeight: 22,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressCard: {
    borderRadius: SIZES.radius,
    padding: 20,
    borderWidth: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  progressBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBadgeText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  progressContent: {
    gap: 12,
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
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  servicesSection: {
    marginBottom: 24,
  },
  servicesHeader: {
    marginBottom: 16,
  },
  servicesTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 4,
  },
  servicesSubtitle: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  completeContainer: {
    borderRadius: SIZES.radius,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  completeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  completeTitle: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  completeText: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  completeFeatures: {
    gap: 12,
  },
  completeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completeFeatureText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
});