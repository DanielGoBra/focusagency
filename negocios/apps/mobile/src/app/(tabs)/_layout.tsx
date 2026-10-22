import type { ColorValue } from "react-native";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColors } from "../../lib/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const icon =
  (name: IconName) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} color={typeof color === "string" ? color : undefined} size={size} />
  );

export default function TabsLayout() {
  const c = useColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.brand,
        tabBarInactiveTintColor: c.ink3,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border },
        tabBarLabelStyle: { fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio", tabBarIcon: icon("stats-chart") }} />
      <Tabs.Screen name="vender" options={{ title: "Vender", tabBarIcon: icon("add-circle") }} />
      <Tabs.Screen name="gastos" options={{ title: "Gastos", tabBarIcon: icon("receipt-outline") }} />
      <Tabs.Screen name="fiados" options={{ title: "Fiados", tabBarIcon: icon("people-outline") }} />
    </Tabs>
  );
}
