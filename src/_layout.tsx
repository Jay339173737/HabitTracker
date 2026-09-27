import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useStore } from "./store";
import { colors } from "./theme";

export default function RootLayout() {
  const router = useRouter();
  const load = useStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="routines" />
        <Stack.Screen name="create" />
        <Stack.Screen name="routine-detail" />
      </Stack>

      {/* Floating + button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/create")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
