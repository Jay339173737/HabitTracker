import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { colors } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.cardBorder },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Habit', tabBarIcon: () => <Text>🏠</Text> }}
      />
      <Tabs.Screen
        name="journal"
        options={{ title: 'Journal', tabBarIcon: () => <Text>📓</Text> }}
      />
    </Tabs>
  );
}
