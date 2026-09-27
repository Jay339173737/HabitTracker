import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "../components/Icon";
import { useStore } from "../store";
import { colors } from "../theme";

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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/create")}
        activeOpacity={0.85}
      >
        <Icon name="＋" size={26} color="#fff" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
});
