"use client";

import { useEffect, useState, type ReactNode } from "react";
import { adminMe } from "@/lib/api";
import { AdminBar } from "./AdminBar";
import { AdminLogin } from "./AdminLogin";

export function AdminGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"loading" | "in" | "out">("loading");

  function check() {
    adminMe()
      .then(() => setState("in"))
      .catch(() => setState("out"));
  }

  useEffect(() => {
    check();
  }, []);

  if (state === "loading") {
    return <p className="px-5 pt-32 text-center text-stone">Loading…</p>;
  }
  if (state === "out") {
    return <AdminLogin onSuccess={() => setState("in")} />;
  }
  return (
    <div className="pt-[52px]">
      <AdminBar />
      <div className="mx-auto max-w-[1240px] px-5 py-10 md:px-8">{children}</div>
    </div>
  );
}
