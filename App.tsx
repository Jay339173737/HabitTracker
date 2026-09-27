import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "./src/theme";

export type RootStackParamList = {
  Tabs: undefined;
  Routines: undefined;
  CreateHabit: { routineId?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function CreateHabitScreen() {
  return (
    <View style={styles.homeScreen}>
      <Text style={styles.homeTitle}>Create Habit</Text>
    </View>
  );
}

function RoutinesScreen() {
  return (
    <View style={styles.homeScreen}>
      <Text style={styles.homeTitle}>Routines</Text>
    </View>
  );
}

function JournalScreen() {
  return (
    <View style={styles.homeScreen}>
      <Text style={styles.homeTitle}>Journal</Text>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={styles.homeScreen}>
      <Text style={styles.homeTitle}>Habit Tracker</Text>
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.cardBorder,
        },
      }}
    >
      <Tab.Screen
        name="Habit"
        component={HomeScreen}
        options={{ tabBarIcon: () => <Text>🏠</Text> }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{ tabBarIcon: () => <Text>📓</Text> }}
      />
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
          onPress={() => navigationRef.navigate("CreateHabit")}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeScreen: {
    flex: 1,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  homeTitle: { color: colors.primary, fontSize: 24, fontWeight: "600" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 32 },
});
