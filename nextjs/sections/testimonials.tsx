"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export interface TestimonialsContent {
    eyebrow: string;
    heading: string;
    body: string;
    items: { name: string; location: string; avatar: string; text: string }[];
}

export const testimonialsDefaults: TestimonialsContent = {
    eyebrow: "REVIEWS",
    heading: "Trusted by Homebuyers. Proven by Results.",
    body: "Honest words from clients who trusted us with their space.",
    items: [
        { name: "James Mwangi", location: "Nairobi, Kenya", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=120&h=120&q=80", text: "INCK delivered our home exactly as promised. The craftsmanship and attention to detail are outstanding." },
        { name: "Amina Hassan", location: "Mombasa, Kenya", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=120&h=120&q=80", text: "Professional, transparent and truly customer-first. Buying into their gated estate was a seamless experience." },
        { name: "Grace Njeri", location: "Kiambu, Kenya", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=120&h=120&q=80", text: "From planning to handover, everything was handled professionally. A developer you can genuinely trust." },
        { name: "David Ochieng", location: "Kisumu, Kenya", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=120&h=120&q=80", text: "A strong investment with real long-term value. INCK's vision for African living is impressive." },
        { name: "Samuel Kariuki", location: "Nakuru, Kenya", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?fit=crop&w=120&h=120&q=80", text: "Modern design, quality build and sustainable communities. They deliver on every promise they make." },
        { name: "Fatuma Ali", location: "Nairobi, Kenya", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=120&h=120&q=80", text: "As a first-time homeowner, I felt supported throughout the entire journey. Highly recommended." },
    ],
};

export function Testimonials({ content }: { content?: Partial<TestimonialsContent> }) {
    const c = { ...testimonialsDefaults, ...content };
    const half = Math.ceil(c.items.length / 2);
    const col1 = c.items.slice(0, half);
    const col2 = c.items.slice(half);

    const renderCard = (item: TestimonialsContent["items"][0], index: number) => (
        <div key={item.name + index} className="bg-white p-6 rounded-xl flex flex-col gap-4 w-[280px] sm:w-[320px] select-none">
            <div className="flex items-center gap-3">
                <Image src={item.avatar} alt={item.name} className="size-11 rounded-full object-cover shrink-0" width={50} height={50} />
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-navy">{item.name}</span>
                    <span className="text-sm text-charcoal/60 mt-0.5">{item.location}</span>
                </div>
            </div>
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                ))}
            </div>
            <p className="text-sm/5.5 text-charcoal/70">{item.text}</p>
        </div>
    );

    return (
        <section className="py-20 md:py-40 px-4 md:px-16 lg:px-24 xl:px-32 w-full bg-cream overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-2 justify-start items-start">
                <div className="lg:col-span-5 flex flex-col items-start mt-20">
                    <motion.div className="flex items-center gap-1.5"
                        initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }} transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <span className="size-1.5 bg-gold"></span>
                        <span className="text-sm text-navy tracking-wide">{c.eyebrow}</span>
                    </motion.div>
                    <div className="w-[148px] h-[1.5px] bg-linear-to-r from-gold to-transparent mt-3.5"></div>
                    <motion.h2 className="text-3xl md:text-[34px]/12 text-navy mt-5 leading-tight font-medium max-w-[400px]"
                        initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }} transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                    >
                        {c.heading}
                    </motion.h2>
                    <motion.p className="text-charcoal/70 text-sm md:text-base mt-2.5 max-w-[340px]"
                        initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }} transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        {c.body}
                    </motion.p>
                </div>

                <div className="lg:col-span-7 relative h-[520px] md:h-[580px] overflow-hidden flex justify-center md:justify-start gap-5 mt-10 lg:mt-0">
                    <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.05)]"></div>
                    <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-cream to-transparent pointer-events-none z-10" />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-cream to-transparent pointer-events-none z-10" />

                    <div className="overflow-hidden h-full flex flex-col">
                        <div className="flex flex-col gap-5 animate-marquee-up py-2">
                            {col1.map((item, index) => renderCard(item, index))}
                            {col1.map((item, index) => renderCard(item, index + col1.length))}
                        </div>
                    </div>

                    <div className="overflow-hidden h-full hidden sm:flex flex-col">
                        <div className="flex flex-col gap-5 animate-marquee-down py-2">
                            {col2.map((item, index) => renderCard(item, index))}
                            {col2.map((item, index) => renderCard(item, index + col2.length))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
