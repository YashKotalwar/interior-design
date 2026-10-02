"use client";

import { AdminGate } from "@/components/admin/AdminGate";
import { AdminInquiries } from "@/components/admin/AdminInquiries";

export default function InquiriesPage() {
  return (
    <AdminGate>
      <AdminInquiries />
    </AdminGate>
  );
}
