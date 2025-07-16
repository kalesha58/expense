import { CheckCircle, ChevronDown, ChevronUp, XCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withSequence,
  withDelay,
  Easing
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { SIZES } from "@/constants/theme";
import { ApiInfo, ApiState } from "@/@types/api";


interface ActivityCardProps {
  apiInfo: ApiInfo;
  state: ApiState;
  index: number;
  onRetry: () => void;
}

export default function ActivityCard({ apiInfo, state, index, onRetry }: ActivityCardProps) {
  const { colors, shadows } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const translateX = useSharedValue(-300);
  const opacity = useSharedValue(0);
  const errorHeight = useSharedValue(0);

  useEffect(() => {
    // Stagger the animations based on index
    translateX.value = withDelay(
      index * 200, 
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    opacity.value = withDelay(
      index * 200 + 200, 
      withTiming(1, { duration: 300 })
    );
  }, [index]);

  useEffect(() => {
    if (state.status === "success") {
      // Add a little bounce effect on success
      translateX.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  }, [state.status]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    errorHeight.value = withTiming(expanded ? 0 : 80, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  const errorAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: errorHeight.value,
      opacity: errorHeight.value > 0 ? withTiming(1) : withTiming(0),
      overflow: "hidden",
    };
  });

  const renderStatusIcon = () => {
    switch (state.status) {
      case "loading":
        return <ActivityIndicator size="small" color={colors.primary} />;
      case "success":
        return <CheckCircle size={24} color={colors.success} />;
      case "error":
        return <XCircle size={24} color={colors.error} />;
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, shadows.small]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>{apiInfo.name}</Text>
            <Text style={[styles.description, { color: colors.placeholder }]}>{apiInfo.description}</Text>
          </View>
          <View style={styles.statusContainer}>
            {renderStatusIcon()}
          </View>
        </View>

        {state.status === "error" && (
          <>
            <Pressable onPress={toggleExpanded} style={styles.errorToggle}>
              <Text style={[styles.errorText, { color: colors.error }]}>Error details</Text>
              {expanded ? (
                <ChevronUp size={16} color={colors.error} />
              ) : (
                <ChevronDown size={16} color={colors.error} />
              )}
            </Pressable>
            <Animated.View style={[styles.errorDetails, errorAnimatedStyle]}>
              <Text style={[styles.errorMessage, { color: colors.error }]}>{state.error}</Text>
              <Pressable onPress={onRetry} style={[styles.retryButton, { backgroundColor: colors.error }]}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </Animated.View>
          </>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.base * 1.5,
  },
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: SIZES.font,
  },
  statusContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  errorToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.07)",
  },
  errorText: {
    fontSize: SIZES.font,
    marginRight: 8,
  },
  errorDetails: {
    marginTop: 8,
  },
  errorMessage: {
    fontSize: SIZES.font,
    lineHeight: 20,
    marginBottom: 12,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: SIZES.font,
  },
});