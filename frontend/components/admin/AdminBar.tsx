"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/lib/api";

export function AdminBar() {
  const pathname = usePathname();
  const router = useRouter();
  const links = [
    { href: "/admin", label: "Projects" },
    { href: "/admin/projects/new", label: "New" },
    { href: "/admin/inquiries", label: "Inquiries" },
  ];

  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-8">
        <p className="text-[12px] uppercase tracking-[0.16em] text-stone">Studio</p>
        <div className="flex flex-wrap items-center gap-4 text-[14px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "text-ink" : "text-stone hover:text-ink"}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/" className="text-stone hover:text-ink">
            Public site
          </Link>
          <button
            type="button"
            className="text-stone hover:text-ink"
            onClick={async () => {
              await adminLogout();
              router.replace("/admin");
              router.refresh();
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
