import { Stack } from "expo-router";
import React from "react";
import { useTheme } from "@/hooks/useTheme";

export default function ExpensesLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="add-line-item" />
      <Stack.Screen name="review" />
      <Stack.Screen name="confirmation" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}