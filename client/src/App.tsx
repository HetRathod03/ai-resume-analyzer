import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

// Each page is loaded on demand (code splitting); Layout's Suspense shows a loader meanwhile
const Home = lazy(() => import("./pages/Home"));
const Result = lazy(() => import("./pages/Result"));
const History = lazy(() => import("./pages/History"));
const HistoryDetail = lazy(() => import("./pages/HistoryDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<HistoryDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
