import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Maximize, ArrowUpRight } from "lucide-react";
import { Property, formatPrice } from "@/data/properties";

const statusStyles: Record<string, string> = {
    Selling: "bg-gold text-navy",
    Ready: "bg-emerald-600 text-white",
    "Off-Plan": "bg-navy text-white",
    "Coming Soon": "bg-charcoal text-white",
};

export function PropertyCard({ property }: { property: Property }) {
    return (
        <Link
            href={`/properties/${property.slug}`}
            className="group flex flex-col bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:shadow-[0_18px_50px_rgba(15,45,82,0.12)] hover:border-gold/40 transition-all duration-300"
        >
            <div className="relative h-60 overflow-hidden">
                <Image
                    src={property.cardImage}
                    alt={property.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className={`absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full ${statusStyles[property.status] ?? "bg-navy text-white"}`}>
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

            <div className="flex flex-col flex-1 p-6">
                <h3 className="text-navy text-xl font-medium">{property.name}</h3>
                <div className="flex items-center gap-1.5 text-charcoal/60 text-sm mt-1.5">
                    <MapPin className="size-4 text-gold" />
                    <span>{property.location}</span>
                </div>
                <p className="text-charcoal/65 text-sm mt-3 leading-relaxed flex-1">
                    {property.shortDesc}
                </p>

                <div className="flex items-center gap-4 mt-5 pt-5 border-t border-zinc-100 text-charcoal/70 text-xs">
                    <span className="flex items-center gap-1.5"><BedDouble className="size-4 text-navy" /> {property.beds}</span>
                    <span className="flex items-center gap-1.5"><Bath className="size-4 text-navy" /> {property.baths}</span>
                </div>
                <div className="flex items-center gap-1.5 text-charcoal/70 text-xs mt-3">
                    <Maximize className="size-4 text-navy" /> {property.size}
                </div>

                <span className="inline-flex items-center gap-1.5 text-navy text-sm font-medium mt-5 group-hover:text-gold-dark transition-colors">
                    View details
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
            </div>
        </Link>
    );
}
