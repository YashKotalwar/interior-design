"use client";

import { Suspense, use } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminProjectEditor } from "@/components/admin/AdminProjectEditor";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AdminGate>
      <Suspense fallback={<p className="text-stone">Loading…</p>}>
        <AdminProjectEditor id={Number(id)} />
      </Suspense>
    </AdminGate>
  );
}
