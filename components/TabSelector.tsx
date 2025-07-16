import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  Easing
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';
import { SIZES } from '@/constants/theme';

interface TabSelectorProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export default function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const tabWidth = 100; // Fixed width for each tab

  React.useEffect(() => {
    translateX.value = withTiming(activeTab * tabWidth, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeTab]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        <Animated.View style={[
          styles.activeIndicator,
          { width: tabWidth, backgroundColor: colors.primary },
          animatedStyle
        ]} />
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, { width: tabWidth }]}
            onPress={() => onTabChange(index)}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === index ? colors.text : colors.placeholder }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Removed paddingHorizontal since container handles it
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    height: '100%',
    borderRadius: 8,
    top: 4,
    left: 4,
  },
  tab: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: SIZES.font,
    fontWeight: '600',
  },
});