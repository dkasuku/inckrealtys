"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, Lightbulb, Leaf, Heart, CheckCircle2, Users } from "lucide-react";

const ICONS = [ShieldCheck, Award, Lightbulb, Leaf, Heart, CheckCircle2, Users];

export interface CoreValuesContent {
    eyebrow: string;
    heading: string;
    body: string;
    items: { title: string; desc: string }[];
}

export const coreValuesDefaults: CoreValuesContent = {
    eyebrow: "OUR CORE VALUES",
    heading: "The Principles That Guide Us",
    body: "Everything we build is grounded in a clear set of values that shape how we work with communities, investors and each other.",
    items: [
        { title: "Integrity", desc: "We do what is right, with honesty and transparency at every step." },
        { title: "Excellence", desc: "We hold ourselves to the highest standards of quality and craft." },
        { title: "Innovation", desc: "We embrace modern design and forward-thinking solutions." },
        { title: "Sustainability", desc: "We build responsibly for people and the environment." },
        { title: "Customer Commitment", desc: "We put homeowners and investors at the centre of all we do." },
        { title: "Accountability", desc: "We take ownership and deliver on every promise we make." },
        { title: "Collaboration", desc: "We build lasting communities through strong partnerships." },
    ],
};

export function CoreValues({ content }: { content?: Partial<CoreValuesContent> }) {
    const c = { ...coreValuesDefaults, ...content };

    return (
        <section className="py-16 md:py-24 px-4 md:px-16 lg:px-24 xl:px-32 w-full bg-cream mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
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
                                className="flex items-start gap-4 bg-white border border-zinc-100 rounded-xl p-6 hover:border-gold transition-colors duration-300"
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index % 3) * 0.1, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                            >
                                <div className="flex items-center justify-center size-11 shrink-0 rounded-lg bg-gold/15 text-gold-dark">
                                    <Icon className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-navy font-medium">{item.title}</h3>
                                    <p className="text-charcoal/65 text-sm mt-1.5 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
