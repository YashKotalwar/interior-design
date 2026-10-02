"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { Button } from "./Button";
import { ProjectCover } from "./ProjectCover";

export function Hero({ featured }: { featured?: Project }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-[52px]">
      <div className="absolute inset-0">
        {featured ? (
          <ProjectCover project={featured} className="h-full min-h-[100svh] w-full" />
        ) : (
          <div className="mesh mesh-drift absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/10" />
      </div>
      <div className="relative mx-auto flex min-h-[calc(100svh-52px)] max-w-[1240px] flex-col justify-end px-5 pb-16 md:px-8 md:pb-24">
        <motion.p
          className="text-[12px] uppercase tracking-[0.2em] text-gold"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Kotalwar Interiors
        </motion.p>
        <motion.h1
          className="mt-4 max-w-[14ch] text-[42px] font-medium leading-[1.05] tracking-[-0.035em] text-mist sm:text-[64px] lg:text-[80px]"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Rooms, considered.
        </motion.h1>
        <motion.p
          className="mt-5 max-w-[38ch] text-[18px] leading-relaxed text-mist/80"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.7 }}
        >
          Interior design for houses that are meant to be lived in.
        </motion.p>
        <motion.div
          className="mt-8 flex flex-wrap gap-3"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
        >
          <Button href="/work" variant="light">
            See the work
          </Button>
          <Button href="/contact" variant="lightGhost">
            Start a project
          </Button>
        </motion.div>
        {featured ? (
          <Link
            href={`/work/${featured.slug}`}
            className="mt-10 text-[13px] text-mist/70 hover:text-mist"
          >
            Featured · {featured.title}, {featured.location}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
