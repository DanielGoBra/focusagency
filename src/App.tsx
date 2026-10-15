import { Route, Routes } from "react-router-dom";
import { LeadDialog, Notice } from "./components/LeadDialog";
import { Shell } from "./components/Shell";
import { Academy } from "./pages/Academy";
import { Ads } from "./pages/Ads";
import { Agency } from "./pages/Agency";
import { Flows } from "./pages/Flows";
import { Inbox } from "./pages/Inbox";
import { Integrations } from "./pages/Integrations";
import { Intel } from "./pages/Intel";
import { Landing } from "./pages/Landing";
import { Pipeline } from "./pages/Pipeline";
import { Pulse } from "./pages/Pulse";
import { HubProvider } from "./store";

export default function App() {
  return (
    <HubProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/agency" element={<Agency />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/hub" element={<Shell />}>
          <Route index element={<Pulse />} />
          <Route path="bandeja" element={<Inbox />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="ads" element={<Ads />} />
          <Route path="flujos" element={<Flows />} />
          <Route path="integraciones" element={<Integrations />} />
          <Route path="inteligencia" element={<Intel />} />
        </Route>
      </Routes>
      <LeadDialog />
      <Notice />
    </HubProvider>
  );
}
