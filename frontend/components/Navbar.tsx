"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUi } from "@/context/UiContext";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { setSearchOpen } = useUi();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? "nav-glass hairline" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[52px] max-w-[1240px] items-center justify-between px-5 md:px-8" aria-label="Primary">
        <div className="flex flex-1 items-center md:hidden">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 justify-center md:flex-none md:justify-start">
          <Logo />
        </div>
        <ul className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-[13px] text-ink/80 transition-colors hover:text-ink">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-1 justify-end">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full"
            aria-label="Search projects"
            onClick={() => setSearchOpen(true)}
          >
            <Icon name="search" className="h-5 w-5" />
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="nav-glass border-t border-ink/5 md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col px-6 py-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-3 text-2xl font-medium tracking-tight"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
