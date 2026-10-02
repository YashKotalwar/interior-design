"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useUi } from "@/context/UiContext";
import { searchProjects } from "@/lib/api";
import type { SearchHit } from "@/lib/types";
import { Icon } from "./Icon";

export function SearchModal() {
  const { searchOpen, setSearchOpen } = useUi();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 40);
    else {
      setQ("");
      setHits([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!q.trim()) {
      setHits([]);
      return;
    }
    const t = setTimeout(() => {
      void searchProjects(q).then((res) => setHits(res.items));
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <AnimatePresence>
      {searchOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-xl overflow-hidden rounded-3xl bg-paper shadow-[var(--shadow-lift)]"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Icon name="search" className="h-5 w-5 text-stone" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search projects"
                className="h-14 flex-1 bg-transparent text-[16px] outline-none"
              />
            </div>
            <ul className="max-h-80 overflow-auto py-2">
              {hits.length === 0 && q.trim() ? (
                <li className="px-5 py-6 text-sm text-stone">No matches.</li>
              ) : null}
              {hits.map((hit) => (
                <li key={hit.slug}>
                  <Link
                    href={`/work/${hit.slug}`}
                    className="block px-5 py-3 hover:bg-mist"
                    onClick={() => setSearchOpen(false)}
                  >
                    <p className="text-[15px] font-medium">{hit.title}</p>
                    <p className="text-[13px] text-stone">
                      {hit.location} · {hit.category}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
