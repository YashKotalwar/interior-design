import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Kotalwar Interiors — a studio practice for residential and working rooms.",
};

export default function AboutPage() {
  return (
    <div className="px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-32">
      <div className="mx-auto max-w-[760px]">
        <p className="text-[12px] uppercase tracking-[0.18em] text-gold-deep">About</p>
        <h1 className="mt-3 text-[40px] font-medium tracking-[-0.03em] sm:text-[56px]">
          A practice of rooms.
        </h1>
        <p className="mt-6 text-[18px] leading-relaxed text-stone">
          Kotalwar Interiors is a family studio. We draw houses, kitchens, and working rooms with attention
          to light and how people actually use a space. The work is measured, not decorated for a photograph.
        </p>
        <p className="mt-5 text-[18px] leading-relaxed text-stone">
          Materials are chosen to last: plaster, stone, wood, linen. Storage is built in. Colour stays quiet
          unless the room asks for it.
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-[1240px] gap-6 md:grid-cols-3">
        {[
          { src: "/samples/about-1.jpg", title: "Listen first", body: "We begin with how the house is lived in now — meals, work, guests, quiet hours — before we draw." },
          { src: "/samples/about-2.jpg", title: "Build in", body: "Cupboards, benches, and desks are part of the architecture so the room can stay uncluttered." },
          { src: "/samples/about-3.jpg", title: "Stay for the finish", body: "We remain through site and detailing. The last millimetre is the room you keep." },
        ].map((item) => (
          <article key={item.title} className="overflow-hidden rounded-[24px] border border-line bg-paper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-8">
              <h2 className="text-[22px] font-medium">{item.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-stone">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
