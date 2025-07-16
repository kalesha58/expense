import { Stack } from "expo-router";
import React from "react";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="profile" />
      <Stack.Screen name="account" />
    </Stack>
  );
}