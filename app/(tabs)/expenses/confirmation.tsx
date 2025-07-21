import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { SIZES } from '@/constants/theme';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Animation values
  const spinValue = new Animated.Value(0);
  const scaleValue = new Animated.Value(0.8);
  
  // Mock data for confirmation
  const reportId = 'EXP-' + Math.floor(100000 + Math.random() * 900000);
  const status = 'Submitted';
  
  useEffect(() => {
    // Start loading animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    
    const scaleAnimation = Animated.timing(scaleValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    });
    
    spinAnimation.start();
    scaleAnimation.start();
    
    // Simulate API call with 5 second timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Stop spinning animation
      spinAnimation.stop();
      
      // Success animation
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 200,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      spinAnimation.stop();
    };
  }, []);
  
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const handleViewReport = () => {
    // In a real app, this would navigate to the report details
    router.push('/expenses');
  };
  
  const handleGoToDashboard = () => {
    router.push('/');
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.loaderContainer, 
              { 
                backgroundColor: colors.primary + '20',
                transform: [{ scale: scaleValue }]
              }
            ]}
          >
            <Animated.View
              style={{
                transform: [{ rotate: spin }],
              }}
            >
              <Feather name="loader" size={48} color={colors.primary} />
            </Animated.View>
          </Animated.View>
          
          <Text style={[styles.loadingTitle, { color: colors.text }]}>
            Submitting Expense Report
          </Text>
          
          <Text style={[styles.loadingMessage, { color: colors.placeholder }]}>
            Please wait while we process your expense report...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.iconContainer, 
            { 
              backgroundColor: colors.success + '20',
              transform: [{ scale: scaleValue }]
            }
          ]}
        >
          <Feather name="check-circle" size={64} color={colors.success} />
        </Animated.View>
        
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
  loaderContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingMessage: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
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