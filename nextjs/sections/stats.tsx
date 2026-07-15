"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import CountUp from "@/components/count-number";

export interface StatsContent {
    eyebrow: string;
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    image: string;
    imageAlt: string;
    stats: { value: number; suffix: string; label: string }[];
}

export const statsDefaults: StatsContent = {
    eyebrow: "WHO WE ARE",
    heading: "Redefining Property Development Across Africa",
    body: "We bring together expertise in planning, design, construction and project management to deliver developments that create long-term value for homeowners, investors and communities.",
    ctaLabel: "Explore Developments",
    ctaHref: "/properties",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "The INCK Realty team in Nairobi, Kenya",
    stats: [
        { value: 10, suffix: "+", label: "HOMES DELIVERED" },
        { value: 10, suffix: "+", label: "COMMUNITIES DEVELOPED" },
        { value: 98, suffix: "%", label: "CLIENT SATISFACTION RATE" },
    ],
};

export function Stats({ content = statsDefaults }: { content?: StatsContent }) {
    const c = { ...statsDefaults, ...content };

    return (
        <section className="py-16 md:py-25 px-4 md:px-16 lg:px-24 xl:px-32 w-full">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: copy */}
                <div className="flex flex-col items-start">
                    <motion.div className="flex items-center gap-1.5"
                        initial={{ y: -20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <span className="size-1.5 bg-gold"></span>
                        <span className="text-sm text-navy tracking-wide">{c.eyebrow}</span>
                    </motion.div>

                    <motion.h2 className="text-4xl md:text-5xl text-navy mt-6 leading-tight"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                    >
                        {c.heading}
                    </motion.h2>

                    <motion.p className="text-charcoal/70 text-sm md:text-base mt-4 max-w-[520px]"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        {c.body}
                    </motion.p>

                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <Link href={c.ctaHref} className="inline-block mt-7 bg-navy hover:bg-navy-light text-white px-7 py-3 rounded-full text-sm transition cursor-pointer">
                            {c.ctaLabel}
                        </Link>
                    </motion.div>
                </div>

                {/* Right: team image */}
                <motion.div className="relative h-[380px] md:h-[460px] rounded-2xl overflow-hidden"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <Image
                        src={c.image}
                        alt={c.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/45 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-white/90 text-sm font-medium">Our people</p>
                        <p className="text-white/70 text-xs mt-1">Planners, designers and builders delivering across Kenya.</p>
                    </div>
                </motion.div>
            </div>

            {/* Stats row */}
            <div className="max-w-7xl mx-auto flex max-lg:flex-col max-lg:gap-10 justify-between mt-16 md:mt-20 pt-12 border-t border-zinc-100">
                {c.stats.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-8">
                        <div className="flex flex-col justify-center">
                            <span className="text-4xl md:text-5xl text-navy">
                                <CountUp from={0} to={s.value} />{s.suffix}
                            </span>
                            <span className="text-sm text-charcoal/70 mt-4">{s.label}</span>
                        </div>
                        {i < c.stats.length - 1 && <div className="max-lg:hidden h-20 w-px bg-zinc-200 ml-8"></div>}
                    </div>
                ))}
            </div>
        </section>
    );
}
