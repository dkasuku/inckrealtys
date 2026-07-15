"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { API_URL } from "@/lib/api";

export interface ContactContent {
    eyebrow: string;
    heading: string;
    buttonLabel: string;
    image: string;
    hoursTitle: string;
    hours: string[];
}

export const contactDefaults: ContactContent = {
    eyebrow: "CONTACT",
    heading: "Connect with us to get the best deal",
    buttonLabel: "GET STARTED",
    image: "/assets/house.png",
    hoursTitle: "KEY DETAILS",
    hours: ["Monday-Friday: 10 AM - 6 PM", "Saturday: 10 AM - 4 PM"],
};

const spring = { type: "spring" as const, stiffness: 320, damping: 70, mass: 1 };
const field = "w-full border border-zinc-200 rounded-sm px-4 py-2.5 text-xs text-navy placeholder-zinc-400 focus:outline-none focus:border-gold transition-colors";

export function Contact({
    content,
    propertySlug,
}: {
    content?: Partial<ContactContent>;
    propertySlug?: string;
}) {
    const c = { ...contactDefaults, ...content };

    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [error, setError] = useState("");

    const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");
        setError("");
        try {
            const res = await fetch(`${API_URL}/api/enquiries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, propertySlug: propertySlug || "" }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                const first = data?.errors ? Object.values(data.errors)[0] : data?.error;
                throw new Error(String(first || "Could not send your message"));
            }
            setStatus("sent");
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch (err) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
    }

    return (
        <section className="py-20 w-full flex items-center justify-center">
            <div className="max-w-5xl w-full mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="flex flex-col">
                    <motion.div className="flex items-center gap-1.5"
                        initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }} transition={{ delay: 0.2, ...spring }}
                    >
                        <span className="size-1.5 bg-gold"></span>
                        <span className="text-sm text-navy tracking-wide">{c.eyebrow}</span>
                    </motion.div>

                    <motion.h2 className="text-3xl md:text-[40px]/11 text-navy mt-5 leading-tight font-medium max-w-[400px]"
                        initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }} transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                    >
                        {c.heading}
                    </motion.h2>

                    {status === "sent" ? (
                        <div className="mt-10 rounded-lg border border-gold/40 bg-cream p-6">
                            <p className="text-navy font-medium">Thank you — your request has been received.</p>
                            <p className="text-charcoal/70 text-sm mt-1.5">Our team will get back to you shortly.</p>
                            <button onClick={() => setStatus("idle")} className="text-navy text-sm underline underline-offset-4 mt-4 cursor-pointer">
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form className="mt-15 flex flex-col gap-6" onSubmit={onSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm text-charcoal/70 mb-2">YOUR NAME</label>
                                    <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                                        type="text" placeholder="Michael Anderson" className={field} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm text-charcoal/70 mb-2">EMAIL ADDRESS</label>
                                    <input required value={form.email} onChange={(e) => set("email", e.target.value)}
                                        type="email" placeholder="michael@example.com" className={field} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm text-charcoal/70 mb-2">PHONE NUMBER</label>
                                    <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                                        type="tel" placeholder="E.g. +254 712 470 341" className={field} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm text-charcoal/70 mb-2">SUBJECT</label>
                                    <input value={form.subject} onChange={(e) => set("subject", e.target.value)}
                                        type="text" placeholder="E.g. Buying a home" className={field} />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm text-charcoal/70 mb-2">MESSAGE</label>
                                <textarea required rows={4} value={form.message} onChange={(e) => set("message", e.target.value)}
                                    placeholder="E.g. I would like to book a site visit" className={`${field} resize-none`} />
                            </div>

                            {status === "error" && <p className="text-sm text-red-600">{error}</p>}

                            <div className="mt-2">
                                <button type="submit" disabled={status === "sending"}
                                    className="bg-navy hover:bg-navy-light text-white text-xs px-6 py-3.5 rounded-full transition-colors duration-200 cursor-pointer disabled:opacity-60">
                                    {status === "sending" ? "SENDING…" : c.buttonLabel}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <motion.div className="relative overflow-hidden group flex justify-center"
                    initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }} transition={spring}
                >
                    <div className="relative w-[382px] h-[455px] overflow-hidden rounded-xl">
                        <Image src={c.image} alt="INCK Realty" width={382} height={455}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none brightness-80" />
                        <div className="absolute bottom-10 left-10 flex flex-col gap-2.5 z-10">
                            <span className="text-base text-white">{c.hoursTitle}</span>
                            <div className="flex flex-col gap-1 text-sm text-white">
                                {c.hours.map((h) => <p key={h}>{h}</p>)}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
