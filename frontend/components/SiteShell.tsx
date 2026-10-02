"use client";

import type { ReactNode } from "react";
import { UiProvider } from "@/context/UiContext";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { SearchModal } from "./SearchModal";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <UiProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <SearchModal />
    </UiProvider>
  );
}
