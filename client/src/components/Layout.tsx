import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loader from "./Loader";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Shown while a lazy-loaded page is being fetched */}
        <Suspense fallback={<Loader text="Loading page..." />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
