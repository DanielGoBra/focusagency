import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { radius, space, useColors } from "../lib/theme";

export function Screen({
  title,
  subtitle,
  children,
  refreshing,
  onRefresh,
  right,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  right?: ReactNode;
}) {
  const c = useColors();
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: space(4), paddingBottom: space(10), gap: space(4) }}
        keyboardShouldPersistTaps="handled"
        refreshControl={onRefresh ? <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} tintColor={c.ink3} /> : undefined}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: space(3) }}>
          <View style={{ flexShrink: 1 }}>
            {subtitle ? <Label>{subtitle}</Label> : null}
            <Text style={{ fontSize: 30, fontWeight: "700", color: c.ink, letterSpacing: -0.5 }} accessibilityRole="header">
              {title}
            </Text>
          </View>
          {right}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const c = useColors();
  return (
    <View style={[{ backgroundColor: c.surface, borderColor: c.border, borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, padding: space(4), gap: space(2) }, style]}>
      {children}
    </View>
  );
}

export function Label({ children, style }: { children: ReactNode; style?: TextStyle }) {
  const c = useColors();
  return <Text style={[{ fontSize: 14, color: c.ink2, fontWeight: "500" }, style]}>{children}</Text>;
}

export function Muted({ children, style }: { children: ReactNode; style?: TextStyle }) {
  const c = useColors();
  return <Text style={[{ fontSize: 13, color: c.ink3 }, style]}>{children}</Text>;
}

export function Amount({ children, size = 22, tone }: { children: ReactNode; size?: number; tone?: "danger" }) {
  const c = useColors();
  return (
    <Text style={{ fontSize: size, fontWeight: "700", color: tone === "danger" ? c.danger : c.ink, fontVariant: ["tabular-nums"] }} numberOfLines={1} adjustsFontSizeToFit>
      {children}
    </Text>
  );
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
}) {
  const c = useColors();
  const primary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        minHeight: 52,
        borderRadius: radius.md,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: space(5),
        backgroundColor: primary ? c.brand : c.surface,
        borderWidth: primary ? 0 : 1,
        borderColor: c.border,
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
      })}
    >
      {loading ? <ActivityIndicator color={primary ? c.brandInk : c.ink} /> : <Text style={{ fontSize: 16, fontWeight: "600", color: primary ? c.brandInk : c.ink }}>{title}</Text>}
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        minHeight: 40,
        paddingHorizontal: space(4),
        borderRadius: 999,
        borderWidth: 1,
        justifyContent: "center",
        borderColor: selected ? c.brand : c.border,
        backgroundColor: selected ? c.brandSoft : c.surface,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: "600", color: selected ? c.brand : c.ink2 }}>{label}</Text>
    </Pressable>
  );
}

export function Chips<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (value: T) => void }) {
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: "row", flexWrap: "wrap", gap: space(2) }}>
      {options.map((option) => (
        <Chip key={option.value} label={option.label} selected={option.value === value} onPress={() => onChange(option.value)} />
      ))}
    </View>
  );
}

export function Input(props: TextInputProps & { large?: boolean }) {
  const c = useColors();
  const { large, style, ...rest } = props;
  return (
    <TextInput
      placeholderTextColor={c.ink3}
      style={[
        {
          minHeight: large ? 64 : 48,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: c.border,
          backgroundColor: c.surface,
          paddingHorizontal: space(4),
          fontSize: large ? 30 : 17,
          fontWeight: large ? "700" : "400",
          color: c.ink,
        },
        style,
      ]}
      {...rest}
    />
  );
}

export function ErrorNote({ message }: { message: string }) {
  const c = useColors();
  return (
    <View accessibilityRole="alert" style={{ backgroundColor: c.dangerSoft, borderRadius: radius.md, padding: space(3) }}>
      <Text style={{ color: c.danger, fontSize: 14 }}>{message}</Text>
    </View>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space(3) }, style]}>{children}</View>;
}
