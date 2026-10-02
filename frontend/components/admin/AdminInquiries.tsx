"use client";

import { useEffect, useState } from "react";
import { adminInquiries } from "@/lib/api";
import type { Inquiry } from "@/lib/types";

export function AdminInquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);

  useEffect(() => {
    void adminInquiries().then((d) => setItems(d.items));
  }, []);

  return (
    <div>
      <h1 className="text-[32px] font-medium tracking-tight">Inquiries</h1>
      <p className="mt-1 text-[15px] text-stone">Messages from the contact form.</p>
      <ul className="mt-10 space-y-4">
        {!items.length ? <li className="text-stone">None yet.</li> : null}
        {items.map((item) => (
          <li key={item.id} className="rounded-[20px] border border-line bg-paper p-6">
            <p className="font-medium">{item.name}</p>
            <p className="text-[13px] text-stone">
              {item.email}
              {item.phone ? ` · ${item.phone}` : ""} · {item.created_at}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed">{item.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
