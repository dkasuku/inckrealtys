import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { HeroSection } from "@/sections/hero-sections";
import { Contact, contactDefaults, ContactContent } from "@/sections/contact";
import { getSections } from "@/lib/content";

export const metadata: Metadata = {
    title: "Contact — INCK Realty Ltd",
    description: "Get in touch with INCK Realty Ltd to enquire about homes, book a site visit or explore investment opportunities across Kenya.",
};

const heroDefaults = {
    eyebrow: "CONTACT",
    heading: "Let's Talk",
    body: "Connect with our team to get the best deal, book a site visit or discuss an investment.",
    backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    phone: "+254 712 470 341",
    email: "info@inckrealty.com",
    address: "Westlands, Nairobi, Kenya",
    hours: "Mon–Fri 10–6 · Sat 10–4",
};

export default async function ContactPage() {
    const sections = await getSections();
    const merge = <T,>(key: string, defaults: T): T =>
        sections[key] && Object.keys(sections[key]).length
            ? ({ ...defaults, ...sections[key] } as T)
            : defaults;

    const rawHero = merge("contact_hero", heroDefaults);
    const hero = {
        ...rawHero,
        phone: rawHero.phone === "+254 700 000 000" ? heroDefaults.phone : rawHero.phone,
        email: rawHero.email === "hello@inckrealty.co.ke" ? heroDefaults.email : rawHero.email,
    };

    const info = [
        { icon: Phone, label: "Call us", value: hero.phone, href: `tel:${hero.phone.replace(/\s/g, "")}` },
        { icon: Mail, label: "Email us", value: hero.email, href: `mailto:${hero.email}` },
        { icon: MapPin, label: "Visit us", value: hero.address, href: null },
        { icon: Clock, label: "Office hours", value: hero.hours, href: null },
    ];

    return (
        <main>
            <HeroSection content={hero} variant="compact" align="center" heightClass="h-[42vh] min-h-[420px]" />

            <section className="px-4 md:px-16 lg:px-24 xl:px-32 -mt-10 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {info.map((item) => {
                        const Icon = item.icon;
                        const inner = (
                            <>
                                <div className="flex items-center justify-center size-11 rounded-lg bg-gold/15 text-gold-dark"><Icon className="size-5" /></div>
                                <p className="text-charcoal/50 text-xs mt-4">{item.label}</p>
                                <p className="text-navy font-medium mt-1">{item.value}</p>
                            </>
                        );
                        return item.href ? (
                            <a key={item.label} href={item.href} className="bg-white border border-zinc-100 rounded-2xl p-6 hover:border-gold transition-colors block">{inner}</a>
                        ) : (
                            <div key={item.label} className="bg-white border border-zinc-100 rounded-2xl p-6">{inner}</div>
                        );
                    })}
                </div>
            </section>

            <Contact content={merge<ContactContent>("contact", contactDefaults)} />
        </main>
    );
}
