import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LeadDialog, Notice } from "./components/LeadDialog";
import { Shell } from "./components/Shell";
import { Ads } from "./pages/Ads";
import { Flows } from "./pages/Flows";
import { Inbox } from "./pages/Inbox";
import { Integrations } from "./pages/Integrations";
import { Landing } from "./pages/Landing";
import { Pipeline } from "./pages/Pipeline";
import { Pulse } from "./pages/Pulse";
import { HubProvider } from "./store";

const Agency = lazy(() => import("./pages/Agency").then((module) => ({ default: module.Agency })));
const Academy = lazy(() => import("./pages/Academy").then((module) => ({ default: module.Academy })));
const Intel = lazy(() => import("./pages/Intel").then((module) => ({ default: module.Intel })));

export default function App() {
  return (
    <HubProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/agency" element={<Suspense fallback={<div className="min-h-screen bg-[#071428]" />}><Agency /></Suspense>} />
        <Route path="/academy" element={<Suspense fallback={<div className="min-h-screen bg-[#071428]" />}><Academy /></Suspense>} />
        <Route path="/hub" element={<Shell />}>
          <Route index element={<Pulse />} />
          <Route path="bandeja" element={<Inbox />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="ads" element={<Ads />} />
          <Route path="flujos" element={<Flows />} />
          <Route path="integraciones" element={<Integrations />} />
          <Route path="inteligencia" element={<Suspense fallback={null}><Intel /></Suspense>} />
        </Route>
      </Routes>
      <LeadDialog />
      <Notice />
    </HubProvider>
  );
}
