import Link from "next/link";
import { Logo } from "./Logo";
import { STUDIO } from "@/lib/types";

const columns = [
  {
    title: "Studio",
    links: [
      { href: "/work", label: "Work" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Rooms",
    links: [
      { href: "/work?category=residence", label: "Residences" },
      { href: "/work?category=kitchen", label: "Kitchens" },
      { href: "/work?category=living", label: "Living" },
      { href: "/work?category=workplace", label: "Workplaces" },
    ],
  },
  {
    title: "Visit",
    links: [
      { href: "/contact", label: "Start a project" },
      { href: `mailto:${STUDIO.email}`, label: "Email" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-mist">
      <div className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-stone">
              Interior design for houses that are meant to be lived in.
            </p>
          </div>
          <p className="text-[14px] text-stone">
            {STUDIO.city}
            <br />
            {STUDIO.email}
            <br />
            {STUDIO.phone}
          </p>
        </div>
        <div className="mt-14 hidden grid-cols-3 gap-8 md:grid">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-stone">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[14px] text-ink/80 hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 border-t border-line pt-8 text-[13px] text-stone">
          © {new Date().getFullYear()} Kotalwar Interiors. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
