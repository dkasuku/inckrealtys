"use client";

import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export interface CtaContent {
    heading: string;
    body: string;
    buttonLabel: string;
    buttonHref: string;
    images: string[];
}

export const ctaDefaults: CtaContent = {
    heading: "Find the Perfect Home for Your Lifestyle",
    body: "Explore modern bungalows, maisonettes, luxury villas, apartments and gated estates in Kenya's most promising locations.",
    buttonLabel: "Browse Developments",
    buttonHref: "/properties",
    images: ["/assets/galleryImage1.png", "/assets/galleryImage2.png", "/assets/galleryImage3.png"],
};

export function CallToAction({ content }: { content?: Partial<CtaContent> }) {
  const c = { ...ctaDefaults, ...content };
  const [left, center, right] = [c.images[0], c.images[1], c.images[2]];

  return (
    <section className="py-36 px-4 md:px-16 lg:px-24 xl:px-32 w-full flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="relative w-full max-w-sm overflow-hidden md:max-w-[600px] h-[200px] md:h-[220px] mb-12 flex justify-center items-center md:overflow-visible group/cta-images select-none">
          {left && <Image height={139} width={251} src={left} alt="Development 1" className="absolute w-[200px] md:w-[251px] h-[100px] md:h-[139px] object-cover rounded-[10px] transition-all duration-500 ease-out z-0 origin-bottom-right -rotate-12 translate-x-[-115px] translate-y-4 group-hover/cta-images:translate-x-[-155px] group-hover/cta-images:rotate-[-16deg] group-hover/cta-images:translate-y-2" />}
          {right && <Image height={139} width={251} src={right} alt="Development 3" className="absolute w-[200px] md:w-[251px] h-[100px] md:h-[139px] object-cover rounded-[10px] transition-all duration-500 ease-out z-0 origin-bottom-left rotate-12 translate-x-[115px] translate-y-4 group-hover/cta-images:translate-x-[155px] group-hover/cta-images:rotate-16 group-hover/cta-images:translate-y-2" />}
          {center && <Image height={139} width={251} src={center} alt="Development 2" className="absolute w-[200px] md:w-[251px] h-[100px] md:h-[139px] object-cover rounded-[10px] transition-all duration-500 ease-out z-10 translate-y-[-10px] group-hover/cta-images:translate-y-[-22px] group-hover/cta-images:scale-105" />}
        </div>

        <motion.h2 className="text-3xl md:text-[40px] text-navy tracking-tight max-w-[560px] mb-3"
          initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
        >
          {c.heading}
        </motion.h2>

        <motion.p className="text-charcoal/70 text-sm max-w-[420px] mb-7"
          initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          {c.body}
        </motion.p>

        <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          <Link href={c.buttonHref} className="bg-navy hover:bg-navy-light text-white text-sm px-5 py-3.5 rounded-lg transition-all duration-200 flex items-center gap-2 group cursor-pointer">
            <span>{c.buttonLabel}</span>
            <MoveRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
