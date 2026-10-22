import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppStateProvider, useApp } from "../lib/app-state";
import { repo } from "../lib/repo";
import { space, useColors } from "../lib/theme";
import { Button, Card, ErrorNote, Input, Label, Muted } from "../components/ui";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="auto" />
        <Gate />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}

function Gate() {
  const { session, business } = useApp();
  const c = useColors();

  if (session === undefined || (session && business === undefined)) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: c.bg }}>
        <ActivityIndicator color={c.ink3} />
      </View>
    );
  }
  if (!session) return <Login />;
  if (!business) return <Onboarding />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

function Centered({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, justifyContent: "center", padding: space(5), backgroundColor: c.bg }}>
      {children}
    </KeyboardAvoidingView>
  );
}

function Login() {
  const c = useColors();
  const demo = repo.mode === "demo";
  const [email, setEmail] = useState(demo ? "demo@negocios.app" : "");
  const [password, setPassword] = useState(demo ? "demo1234" : "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await repo.signIn(email.trim(), password);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No pudimos entrar.");
      setBusy(false);
    }
  }

  return (
    <Centered>
      <Text style={{ fontSize: 30, fontWeight: "700", color: c.ink, marginBottom: space(1) }}>Negocios</Text>
      <Muted style={{ marginBottom: space(6) }}>Ventas, gastos, inventario y fiados en un solo lugar.</Muted>
      <Card style={{ gap: space(3) }}>
        {demo ? <Muted>Modo demostración: entra con cualquier correo y verás una tienda de ejemplo.</Muted> : null}
        <Label>Correo</Label>
        <Input value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" accessibilityLabel="Correo" />
        <Label>Contraseña</Label>
        <Input value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" accessibilityLabel="Contraseña" />
        {error ? <ErrorNote message={error} /> : null}
        <Button title="Entrar" onPress={() => void submit()} loading={busy} />
      </Card>
    </Centered>
  );
}

function Onboarding() {
  const c = useColors();
  const { reloadBusinesses } = useApp();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    try {
      await repo.createBusiness({ name: name.trim(), country: "CO", currency: "COP", timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
      await reloadBusinesses();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No pudimos crear el negocio.");
      setBusy(false);
    }
  }

  return (
    <Centered>
      <Text style={{ fontSize: 24, fontWeight: "700", color: c.ink, marginBottom: space(4) }}>Cuéntanos de tu negocio</Text>
      <Card style={{ gap: space(3) }}>
        <Label>Nombre del negocio</Label>
        <Input value={name} onChangeText={setName} placeholder="Ej.: Tienda La Esquina" accessibilityLabel="Nombre del negocio" />
        {error ? <ErrorNote message={error} /> : null}
        <Button title="Empezar" onPress={() => void submit()} disabled={!name.trim()} loading={busy} />
      </Card>
    </Centered>
  );
}
