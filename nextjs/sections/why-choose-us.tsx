"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Minus, Lightbulb, Building2, ShieldCheck, Leaf, Handshake } from "lucide-react";

const ICONS = [Lightbulb, Building2, ShieldCheck, Leaf, Handshake];

export interface WhyChooseUsContent {
    eyebrow: string;
    heading: string;
    body: string;
    items: { title: string; description: string; image: string }[];
}

export const whyChooseUsDefaults: WhyChooseUsContent = {
    eyebrow: "WHY INCK REALTY",
    heading: "Developing With Purpose, Quality & Vision",
    body: "We don't just construct buildings—we create communities, unlock investment opportunities and contribute to Africa's urban transformation.",
    items: [
        { title: "Innovative Property Developments", description: "We blend innovative architecture, quality craftsmanship and practical living to deliver modern homes designed for today's homeowners and tomorrow's cities.", image: "/assets/house.png" },
        { title: "Modern Architectural Designs", description: "From affordable housing to premium residences and gated communities, our designs reflect international standards while embracing local culture.", image: "/assets/galleryImage1.png" },
        { title: "Quality, Durability & Transparency", description: "We are committed to quality and durability with transparent, professional project delivery you can trust at every stage.", image: "/assets/galleryImage2.png" },
        { title: "Sustainable Development Practices", description: "Sustainability sits at the core of every project, creating communities that support economic growth and improve quality of life.", image: "/assets/galleryImage3.png" },
        { title: "Strong Investment Opportunities", description: "With a customer-first approach and a long-term vision for Africa's growth, we unlock lasting value for homeowners and investors alike.", image: "/assets/galleryImage4.png" },
    ],
};

export function WhyChooseUs({ content }: { content?: Partial<WhyChooseUsContent> }) {
    const c = { ...whyChooseUsDefaults, ...content };
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const heroImage = c.items[0]?.image || "/assets/house.png";

    return (
        <section className="py-16 mt-28 px-4 md:px-16 lg:px-24 xl:px-32 w-full bg-cream">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
                <div className="flex flex-col">
                    <motion.div className="flex items-center gap-1.5"
                        initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }} transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <span className="size-1.5 bg-gold"></span>
                        <span className="text-sm text-navy tracking-wide">{c.eyebrow}</span>
                    </motion.div>
                    <motion.h2 className="text-3xl md:text-[40px]/12 text-navy mt-4 leading-tight font-medium max-w-100"
                        initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }} transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                    >
                        {c.heading}
                    </motion.h2>

                    <div className="flex flex-col gap-4 mt-12 md:mt-16 w-full">
                        {c.items.map((item, index) => {
                            const isOpen = openIndex === index;
                            const Icon = ICONS[index % ICONS.length];
                            return (
                                <motion.div key={item.title + index} className="bg-white rounded-sm border border-zinc-100/50 overflow-hidden"
                                    initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }} transition={{ delay: index * 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                                >
                                    <button onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full flex items-center justify-between p-4 md:py-4 md:px-6 text-left hover:bg-zinc-50/30 transition cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <Icon className="size-5 text-gold" />
                                            <span className="text-sm md:text-base text-navy font-medium">{item.title}</span>
                                        </div>
                                        {isOpen ? <Minus className="size-4 text-gold" /> : <Plus className="size-4 text-gold" />}
                                    </button>

                                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                        <div className="overflow-hidden">
                                            <p className="p-4 md:px-10 pt-0 text-xs md:text-sm text-charcoal/70 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <motion.p className="text-charcoal/70 text-sm md:text-base max-w-115 md:mt-20 mb-8"
                        initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }} transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        {c.body}
                    </motion.p>

                    <motion.div className="relative w-121.5 h-102.75 rounded-xl overflow-hidden shadow-sm bg-zinc-100 max-w-full"
                        initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }} transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <Image src={heroImage} alt="INCK Realty development" width={486} height={411}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${openIndex === null ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                        />
                        {c.items.map((item, index) => (
                            <Image key={item.title + index} src={item.image} alt={item.title} width={486} height={411}
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${openIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
