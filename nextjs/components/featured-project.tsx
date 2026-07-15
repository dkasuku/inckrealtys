import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Check, MapPin, Maximize } from "lucide-react";
import { Property, formatPrice } from "@/data/properties";

const statusStyles: Record<string, string> = {
    Selling: "bg-gold text-navy",
    Ready: "bg-emerald-600 text-white",
    "Off-Plan": "bg-navy text-white",
    "Coming Soon": "bg-charcoal text-white",
};

export function FeaturedProject({ property }: { property: Property }) {
    return (
        <Link
            href={`/properties/${property.slug}`}
            className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-2xl"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:shadow-[0_18px_50px_rgba(15,45,82,0.12)] hover:border-gold/40 transition-all duration-300">
                <div className="relative h-80 lg:h-[500px] overflow-hidden">
                    <Image
                        src={property.cardImage}
                        alt={property.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <span
                        className={`absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full ${statusStyles[property.status] ?? "bg-navy text-white"}`}
                    >
                        {property.status}
                    </span>
                    <span className="absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full bg-white/85 backdrop-blur text-navy">
                        {property.type}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-4 left-4 text-white text-lg font-medium">
                        {formatPrice(property.priceFrom)}
                    </span>
                </div>

                <div className="flex flex-col p-8 lg:p-12">
                    <h3 className="text-2xl lg:text-3xl text-navy font-medium leading-tight">
                        {property.name}
                    </h3>
                    <p className="text-navy/60 text-base lg:text-lg font-medium mt-1">
                        {property.tagline}
                    </p>
                    <div className="flex items-center gap-1.5 text-charcoal/60 text-sm mt-4">
                        <MapPin className="size-4 text-gold" />
                        <span>{property.location}</span>
                    </div>
                    <p className="text-charcoal/70 text-sm lg:text-base mt-4 leading-relaxed">
                        {property.shortDesc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                        {property.highlights.map((highlight) => (
                            <div key={highlight} className="flex items-start gap-2 bg-cream rounded-xl p-3">
                                <Check className="size-4 text-gold-dark shrink-0 mt-0.5" />
                                <span className="text-charcoal/80 text-sm leading-snug">{highlight}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-zinc-100 text-charcoal/70 text-sm">
                        <span className="flex items-center gap-1.5">
                            <BedDouble className="size-4 text-navy" /> {property.beds}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Bath className="size-4 text-navy" /> {property.baths}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Maximize className="size-4 text-navy" /> {property.size}
                        </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark text-navy font-medium px-5 py-2.5 rounded-full text-sm mt-8 w-fit transition-colors">
                        View project details
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
