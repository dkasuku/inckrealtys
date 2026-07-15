"use client";

import { motion } from "framer-motion";
import {
    Home, Building2, Building, Hotel, Warehouse, Store, LandPlot, TreePalm, Castle, PencilRuler,
} from "lucide-react";

const ICONS = [Building, Home, Building2, Castle, Hotel, LandPlot, Warehouse, Store, TreePalm, PencilRuler];

export interface WhatWeDevelopContent {
    eyebrow: string;
    heading: string;
    body: string;
    items: { title: string; desc: string }[];
}

export const whatWeDevelopDefaults: WhatWeDevelopContent = {
    eyebrow: "WHAT WE DEVELOP",
    heading: "A Portfolio Built for Every Stage of Life",
    body: "From affordable housing to premium residences and mixed-use developments, our projects meet the needs of today's homeowners and tomorrow's cities.",
    items: [
        { title: "Affordable Housing Communities", desc: "Quality homes designed to be accessible for today's families." },
        { title: "Modern Bungalows", desc: "Practical, contemporary single-storey living." },
        { title: "Maisonettes", desc: "Spacious multi-level homes for growing families." },
        { title: "Luxury Villas", desc: "Premium residences built with exceptional craftsmanship." },
        { title: "Apartment Developments", desc: "Modern apartments for urban, connected lifestyles." },
        { title: "Gated Estates", desc: "Secure, thoughtfully planned residential communities." },
        { title: "Mixed-Use Developments", desc: "Integrated spaces that blend living, work and leisure." },
        { title: "Commercial Properties", desc: "Retail and business spaces built for growth." },
        { title: "Holiday Homes & Resorts", desc: "Getaway and resort developments in prime locations." },
        { title: "Custom Residential Projects", desc: "Bespoke homes built around your specific vision." },
    ],
};

export function WhatWeDevelop({ content }: { content?: Partial<WhatWeDevelopContent> }) {
    const c = { ...whatWeDevelopDefaults, ...content };

    return (
        <section className="py-16 md:py-24 px-4 md:px-16 lg:px-24 xl:px-32 w-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-start max-w-2xl">
                    <motion.div className="flex items-center gap-1.5"
                        initial={{ y: -20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <span className="size-1.5 bg-gold"></span>
                        <span className="text-sm text-navy tracking-wide">{c.eyebrow}</span>
                    </motion.div>
                    <motion.h2 className="text-3xl md:text-[40px]/12 text-navy mt-4 leading-tight font-medium"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                    >
                        {c.heading}
                    </motion.h2>
                    <motion.p className="text-charcoal/70 text-sm md:text-base mt-3"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        {c.body}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12 md:mt-16">
                    {c.items.map((item, index) => {
                        const Icon = ICONS[index % ICONS.length];
                        return (
                            <motion.div key={item.title + index}
                                className="group bg-white border border-zinc-100 rounded-xl p-6 hover:border-gold hover:shadow-[0_10px_30px_rgba(15,45,82,0.08)] transition-all duration-300"
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index % 3) * 0.1, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                            >
                                <div className="flex items-center justify-center size-11 rounded-lg bg-navy/5 text-navy group-hover:bg-gold group-hover:text-navy transition-colors duration-300">
                                    <Icon className="size-5" />
                                </div>
                                <h3 className="text-navy font-medium mt-5">{item.title}</h3>
                                <p className="text-charcoal/65 text-sm mt-2 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
