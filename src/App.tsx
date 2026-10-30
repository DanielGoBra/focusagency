import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, type Location } from "react-router-dom";
import { PageFade } from "./components/PageFade";
import { Landing } from "./pages/Landing";
import { Terms } from "./pages/Terms";
import { ScrollToTop } from "./components/ScrollToTop";

const Agency = lazy(() => import("./pages/Agency").then((module) => ({ default: module.Agency })));
const Academy = lazy(() => import("./pages/Academy").then((module) => ({ default: module.Academy })));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <PageFade>
        {(location: Location) => (
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/terminos" element={<Terms />} />
            <Route path="/agency" element={<Suspense fallback={<div className="min-h-screen bg-[#071428]" />}><Agency /></Suspense>} />
            <Route path="/academy" element={<Suspense fallback={<div className="min-h-screen bg-[#071428]" />}><Academy /></Suspense>} />
            <Route path="/hub/*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </PageFade>
    </>
  );
}
