"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { FeaturedProject } from "@/components/featured-project";
import { PropertyCard } from "@/components/property-card";
import { Property } from "@/data/properties";

export interface ProjectsContent {
    eyebrow: string;
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
}

export const projectsDefaults: ProjectsContent = {
    eyebrow: "OUR PROJECTS",
    heading: "Developments Shaping Communities",
    body: "A snapshot of the residential and mixed-use projects we are proud to be building across Kenya.",
    ctaLabel: "View all developments",
    ctaHref: "/properties",
};

export function Projects({
    content,
    properties = [],
}: {
    content?: Partial<ProjectsContent>;
    properties?: Property[];
}) {
    const c = { ...projectsDefaults, ...content };
    const [primary, ...rest] = properties;

    return (
        <section className="py-16 md:py-24 px-4 md:px-16 lg:px-24 xl:px-32 w-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div className="max-w-2xl">
                        <motion.div className="flex items-center gap-1.5"
                            initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }} transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            <span className="size-1.5 bg-gold"></span>
                            <span className="text-sm text-navy tracking-wide">{c.eyebrow}</span>
                        </motion.div>
                        <motion.h2 className="text-3xl md:text-[40px]/12 text-navy mt-4 leading-tight font-medium"
                            initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }} transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                        >
                            {c.heading}
                        </motion.h2>
                        <motion.p className="text-charcoal/70 text-sm md:text-base mt-3"
                            initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }} transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            {c.body}
                        </motion.p>
                    </div>

                    <Link href={c.ctaHref} className="hidden md:inline-flex items-center gap-2 text-navy hover:text-gold-dark font-medium text-sm shrink-0 transition-colors">
                        {c.ctaLabel} <MoveRight size={16} />
                    </Link>
                </div>

                {primary ? (
                    <div className="mt-12 md:mt-16">
                        <motion.div
                            initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            <FeaturedProject property={primary} />
                        </motion.div>

                        {rest.length > 0 && (
                            <div className="mt-16">
                                <motion.h3 className="text-xl md:text-2xl text-navy font-medium"
                                    initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }} transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                                >
                                    More developments
                                </motion.h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                    {rest.map((property, index) => (
                                        <motion.div key={property.slug}
                                            initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: (index % 3) * 0.1, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                                        >
                                            <PropertyCard property={property} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <motion.div className="mt-12 md:mt-16 text-center py-16 bg-cream rounded-2xl"
                        initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }} transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <p className="text-charcoal/70 text-sm md:text-base">No featured projects right now. Check back soon for new developments.</p>
                        <Link href={c.ctaHref} className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white px-6 py-3 rounded-full text-sm mt-6 transition-colors">
                            {c.ctaLabel} <MoveRight size={16} />
                        </Link>
                    </motion.div>
                )}

                <div className="flex md:hidden justify-center mt-10">
                    <Link href={c.ctaHref} className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white px-6 py-3 rounded-full text-sm transition-colors">
                        {c.ctaLabel} <MoveRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
