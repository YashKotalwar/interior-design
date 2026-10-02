import { Hero } from "@/components/Hero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { getProjects } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroList, featured] = await Promise.all([
    getProjects({ hero: true }),
    getProjects({ featured: true }),
  ]);
  const hero = heroList[0];
  const selected = featured;

  return (
    <>
      <Hero featured={hero} />
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <p className="text-[12px] uppercase tracking-[0.18em] text-gold-deep">Selected</p>
            <h2 className="mt-3 max-w-[16ch] text-[36px] font-medium tracking-[-0.03em] sm:text-[48px]">
              Rooms we have finished.
            </h2>
          </Reveal>
          <div className="mt-14">
            <ProjectGrid projects={selected} empty="Projects will appear here when the studio uploads work." />
          </div>
          <div className="mt-12">
            <Button href="/work" variant="ghost">
              All work
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-paper px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[720px]">
          <Reveal>
            <p className="text-[12px] uppercase tracking-[0.18em] text-gold-deep">Approach</p>
            <h2 className="mt-3 text-[36px] font-medium tracking-[-0.03em] sm:text-[48px]">
              Light, material, and how the day is spent.
            </h2>
            <p className="mt-6 text-[18px] leading-relaxed text-stone">
              We draw rooms that hold a family, a kitchen, a desk. Finishes are chosen to age. Storage is built
              in so surfaces can stay clear. The work is slow on purpose.
            </p>
            <div className="mt-8">
              <Button href="/about" variant="ghost">
                About the studio
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="text-[36px] font-medium tracking-tight sm:text-[48px]">Start a conversation.</h2>
            <p className="mt-3 max-w-md text-[17px] text-stone">
              Share the house, the brief, or a photograph of the room as it is.
            </p>
          </div>
          <Button href="/contact">Write to us</Button>
        </div>
      </section>
    </>
  );
}
