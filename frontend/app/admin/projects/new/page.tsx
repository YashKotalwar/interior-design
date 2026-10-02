"use client";

import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminProjectEditor } from "@/components/admin/AdminProjectEditor";

export default function NewProjectPage() {
  return (
    <AdminGate>
      <Suspense fallback={<p className="text-stone">Loading…</p>}>
        <AdminProjectEditor />
      </Suspense>
    </AdminGate>
  );
}
