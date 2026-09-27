import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import RoutinesScreen from './src/screens/RoutinesScreen';
import CreateHabitScreen from './src/screens/CreateHabitScreen';
import JournalScreen from './src/screens/JournalScreen';
import { colors } from './src/theme';

export type RootStackParamList = {
  Tabs: undefined;
  Routines: undefined;
  CreateHabit: { routineId?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.cardBorder },
      }}
    >
      <Tab.Screen name="Habit" component={HomeScreen} options={{ tabBarIcon: () => <Text>🏠</Text> }} />
      <Tab.Screen name="Journal" component={JournalScreen} options={{ tabBarIcon: () => <Text>📓</Text> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <View style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="Routines" component={RoutinesScreen} />
          <Stack.Screen name="CreateHabit" component={CreateHabitScreen} />
        </Stack.Navigator>

        {/* Floating + button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigationRef.navigate('CreateHabit')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
