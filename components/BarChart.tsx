import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';
import { SIZES } from '@/constants/theme';
import { ChartData } from '@/constants/statistics';

interface BarChartProps {
  data: ChartData[];
  height?: number;
  showContainer?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const CHART_WIDTH = screenWidth - 48; // Account for padding
const BAR_WIDTH = Math.min(24, (CHART_WIDTH / 7) / 2 - 2); // Responsive bar width

export default function BarChart({ data, height = 200, showContainer = true }: BarChartProps) {
  const { colors } = useTheme();
  const maxValue = Math.max(...data.flatMap(d => [d.withinPolicy, d.overPolicy]));
  const chartHeight = height - 60; // Account for labels and legend

  const renderBar = (value: number, color: string, index: number, isWithinPolicy: boolean) => {
    const barHeight = useSharedValue(0);
    const animatedHeight = (value / maxValue) * chartHeight;

    React.useEffect(() => {
      barHeight.value = withDelay(
        index * 100 + (isWithinPolicy ? 0 : 50),
        withTiming(animatedHeight, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        })
      );
    }, [animatedHeight, index, isWithinPolicy]);

    const animatedStyle = useAnimatedStyle(() => ({
      height: barHeight.value,
    }));

    return (
      <Animated.View
        style={[
          styles.bar,
          { backgroundColor: color, width: BAR_WIDTH },
          animatedStyle,
        ]}
      />
    );
  };

  const availableWidth = CHART_WIDTH;
  const barGroupWidth = Math.max(availableWidth / data.length, BAR_WIDTH * 2 + 8); // Ensure minimum spacing

  const chartContent = (
    <>
      <View style={[styles.chartContainer, { height }]}> 
        <View style={styles.barsContainer}>
          {data.map((item, index) => (
            <View key={item.label} style={[styles.barGroup, { width: barGroupWidth }]}> 
              <View style={styles.barPair}>
                {renderBar(item.withinPolicy, colors.success, index, true)}
                <View style={{ width: 6 }} />
                {renderBar(item.overPolicy, colors.error, index, false)}
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.labelsContainer}>
          {data.map((item) => (
            <View key={item.label} style={[styles.labelContainer, { width: barGroupWidth }]}> 
              <Text style={[styles.label, { color: colors.placeholder }]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Within Policy</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.error }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Over Policy</Text>
        </View>
      </View>
    </>
  );

  if (!showContainer) {
    return chartContent;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}> 
      {chartContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 1.25,
    borderWidth: 1,
  },
  chartContainer: {
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: SIZES.large * 1.5,
    paddingHorizontal: 8,
  },
  barGroup: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  barPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bar: {
    borderRadius: 4,
    minHeight: 4,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  labelContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: SIZES.large,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: SIZES.font,
    fontWeight: '500',
  },
});