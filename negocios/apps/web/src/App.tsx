import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useApp } from "./lib/app-state";
import { AppShell } from "./components/AppShell";
import { Skeleton } from "./components/ui";
import { Login } from "./pages/Login";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { Sales } from "./pages/Sales";
import { Expenses } from "./pages/Expenses";
import { Products } from "./pages/Products";
import { Debts } from "./pages/Debts";

export function App() {
  const { session, businesses, business } = useApp();

  if (session === undefined || (session && businesses === undefined)) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-8" aria-busy>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40" />
      </div>
    );
  }
  if (!session) return <Login />;
  if (!business) return <Onboarding />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="ventas" element={<Sales />} />
          <Route path="gastos" element={<Expenses />} />
          <Route path="inventario" element={<Products />} />
          <Route path="fiados" element={<Debts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
