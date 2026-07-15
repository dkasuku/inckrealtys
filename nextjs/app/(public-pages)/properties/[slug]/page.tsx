import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    MapPin, BedDouble, Bath, Maximize, LandPlot, Building2, BadgeCheck, Check, ArrowUpRight, Phone,
} from "lucide-react";
import { formatPrice } from "@/data/properties";
import { getProperties, getPropertyBySlug } from "@/lib/content";
import { PropertyCard } from "@/components/property-card";
import { Contact } from "@/sections/contact";

// New properties added in the admin render on demand.
export const dynamicParams = true;
export const revalidate = 30;

export async function generateStaticParams() {
    const properties = await getProperties();
    return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const property = await getPropertyBySlug(slug);
    if (!property) return { title: "Development not found — INCK Realty Ltd" };
    return {
        title: `${property.name} — ${property.location} | INCK Realty Ltd`,
        description: property.shortDesc,
    };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const property = await getPropertyBySlug(slug);
    if (!property) notFound();

    const all = await getProperties();
    const more = all.filter((p) => p.slug !== property.slug).slice(0, 3);

    const facts = [
        { icon: BedDouble, label: "Bedrooms", value: property.beds },
        { icon: Bath, label: "Bathrooms", value: property.baths },
        { icon: Maximize, label: "Built-up area", value: property.size },
        { icon: LandPlot, label: "Plot size", value: property.plot },
        { icon: Building2, label: "Type", value: property.type },
        { icon: BadgeCheck, label: "Status", value: property.status },
    ];

    return (
        <main>
            {/* Hero */}
            <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
                {property.heroImage && (
                    <Image src={property.heroImage} alt={property.name} fill priority sizes="100vw" className="object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-navy/20" />
                <div className="absolute inset-x-0 bottom-0 px-4 md:px-16 lg:px-24 xl:px-32 pb-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gold text-navy">{property.status}</span>
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/15 backdrop-blur text-white border border-white/20">{property.type}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl text-white font-medium max-w-4xl leading-tight">{property.name}</h1>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-white/85">
                            <span className="flex items-center gap-2"><MapPin className="size-4 text-gold" /> {property.location}</span>
                            <span className="text-gold text-lg font-medium">{formatPrice(property.priceFrom)}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick facts */}
            <section className="px-4 md:px-16 lg:px-24 xl:px-32 -mt-8 relative z-10">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_18px_50px_rgba(15,45,82,0.12)] border border-zinc-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-zinc-100">
                    {facts.slice(0, 4).map((f) => {
                        const Icon = f.icon;
                        return (
                            <div key={f.label} className="p-5 flex items-center gap-3">
                                <div className="flex items-center justify-center size-10 rounded-lg bg-navy/5 text-navy shrink-0"><Icon className="size-5" /></div>
                                <div>
                                    <p className="text-charcoal/50 text-xs">{f.label}</p>
                                    <p className="text-navy text-sm font-medium">{f.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Body */}
            <section className="px-4 md:px-16 lg:px-24 xl:px-32 py-16 md:py-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-1.5">
                            <span className="size-1.5 bg-gold"></span>
                            <span className="text-sm text-navy tracking-wide">OVERVIEW</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl text-navy font-medium mt-4 max-w-xl">{property.tagline}</h2>
                        {property.description.map((para, i) => (
                            <p key={i} className="text-charcoal/70 leading-relaxed mt-4">{para}</p>
                        ))}

                        {property.highlights.length > 0 && (
                            <div className="grid sm:grid-cols-2 gap-3 mt-8">
                                {property.highlights.map((h) => (
                                    <div key={h} className="flex items-start gap-3 bg-cream rounded-xl p-4">
                                        <Check className="size-5 text-gold-dark shrink-0 mt-0.5" />
                                        <span className="text-charcoal/80 text-sm">{h}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {property.gallery.length > 0 && (
                            <>
                                <h3 className="text-xl text-navy font-medium mt-12">Gallery</h3>
                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    {property.gallery.map((src, i) => (
                                        <div key={i} className={`relative overflow-hidden rounded-xl ${i === 0 ? "col-span-2 h-72" : "h-48"}`}>
                                            <Image src={src} alt={`${property.name} view ${i + 1}`} fill sizes="(max-width:768px) 100vw, 66vw"
                                                className="object-cover hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {property.amenities.length > 0 && (
                            <>
                                <h3 className="text-xl text-navy font-medium mt-12">Features &amp; Amenities</h3>
                                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mt-5">
                                    {property.amenities.map((a) => (
                                        <div key={a} className="flex items-center gap-3 py-2 border-b border-zinc-100">
                                            <div className="flex items-center justify-center size-7 rounded-md bg-gold/15 text-gold-dark shrink-0"><Check className="size-4" /></div>
                                            <span className="text-charcoal/75 text-sm">{a}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sticky enquiry card */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky lg:top-28 flex flex-col gap-5">
                            <div className="bg-navy rounded-2xl p-7 text-white">
                                <p className="text-white/60 text-sm">Starting from</p>
                                <p className="text-3xl font-medium text-gold mt-1">{formatPrice(property.priceFrom)}</p>
                                <div className="h-px bg-white/10 my-6" />
                                <div className="flex flex-col gap-4">
                                    {facts.map((f) => {
                                        const Icon = f.icon;
                                        return (
                                            <div key={f.label} className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2 text-white/60"><Icon className="size-4 text-gold" /> {f.label}</span>
                                                <span className="text-white text-right">{f.value}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Link href="#enquire" className="mt-7 flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy font-medium py-3.5 rounded-xl transition-colors">
                                    Enquire about this home <ArrowUpRight className="size-4" />
                                </Link>
                                <a href="tel:+254712470341" className="mt-3 flex items-center justify-center gap-2 border border-white/20 hover:border-gold text-white py-3 rounded-xl text-sm transition-colors">
                                    <Phone className="size-4" /> Call our sales team
                                </a>
                            </div>

                            <div className="bg-cream rounded-2xl p-6">
                                <div className="flex items-center gap-2 text-navy font-medium"><MapPin className="size-4 text-gold-dark" /> Location</div>
                                <p className="text-charcoal/70 text-sm mt-2">{property.location}</p>
                                <p className="text-charcoal/60 text-sm mt-2 leading-relaxed">Well connected to schools, retail and major transport links. Book a site visit to experience the neighbourhood.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Enquiry form tied to this property */}
            <div id="enquire" className="bg-cream">
                <Contact
                    propertySlug={property.slug}
                    content={{
                        eyebrow: "ENQUIRE",
                        heading: `Interested in ${property.name}?`,
                        image: property.cardImage || property.heroImage,
                    }}
                />
            </div>

            {/* More developments */}
            {more.length > 0 && (
                <section className="px-4 md:px-16 lg:px-24 xl:px-32 py-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-end justify-between">
                            <h2 className="text-2xl md:text-3xl text-navy font-medium">More developments</h2>
                            <Link href="/properties" className="text-navy hover:text-gold-dark text-sm font-medium">View all</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {more.map((p) => <PropertyCard key={p.slug} property={p} />)}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
