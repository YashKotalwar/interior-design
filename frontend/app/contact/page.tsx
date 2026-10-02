import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { STUDIO } from "@/lib/types";

export const metadata: Metadata = {
  title: "Contact",
  description: "Write to Kotalwar Interiors about a house, kitchen, or working room.",
};

export default function ContactPage() {
  return (
    <div className="px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-32">
      <div className="mx-auto grid max-w-[1240px] gap-16 lg:grid-cols-2">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-gold-deep">Contact</p>
          <h1 className="mt-3 text-[40px] font-medium tracking-[-0.03em] sm:text-[52px]">
            Tell us about the room.
          </h1>
          <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-stone">
            Share a brief, a plan, or a photograph. We reply with whether the studio is the right fit
            and what a first visit would look like.
          </p>
          <p className="mt-8 text-[15px] text-stone">
            {STUDIO.email}
            <br />
            {STUDIO.phone}
            <br />
            {STUDIO.city}
          </p>
        </div>
        <InquiryForm />
      </div>
      <div className="mx-auto mt-16 max-w-[1240px] overflow-hidden rounded-[28px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/samples/about-1.jpg"
          alt="A living room by the studio"
          className="max-h-[520px] w-full object-cover"
        />
      </div>
    </div>
  );
}
