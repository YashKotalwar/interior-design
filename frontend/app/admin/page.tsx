"use client";

import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminProjects } from "@/components/admin/AdminProjects";

export default function AdminPage() {
  return (
    <AdminGate>
      <Suspense fallback={<p className="text-stone">Loading…</p>}>
        <AdminProjects />
      </Suspense>
    </AdminGate>
  );
}
