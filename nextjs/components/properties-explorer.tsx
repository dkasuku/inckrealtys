"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PropertyCard } from "@/components/property-card";
import { Property, propertyTypes, propertyStatuses, PropertyType, PropertyStatus } from "@/data/properties";

export function PropertiesExplorer({ properties }: { properties: Property[] }) {
    const [type, setType] = useState<PropertyType | "All">("All");
    const [status, setStatus] = useState<PropertyStatus | "All">("All");

    const filtered = useMemo(
        () =>
            properties.filter(
                (p) =>
                    (type === "All" || p.type === type) &&
                    (status === "All" || p.status === status)
            ),
        [properties, type, status]
    );

    const chip = (active: boolean) =>
        `px-4 py-2 rounded-full text-sm border transition-colors cursor-pointer ${
            active
                ? "bg-navy text-white border-navy"
                : "bg-white text-charcoal/70 border-zinc-200 hover:border-gold"
        }`;

    return (
        <section className="py-14 md:py-20 px-4 md:px-16 lg:px-24 xl:px-32 w-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xs uppercase tracking-wide text-charcoal/50 mr-1">Type</span>
                        <button className={chip(type === "All")} onClick={() => setType("All")}>All</button>
                        {propertyTypes.map((t) => (
                            <button key={t} className={chip(type === t)} onClick={() => setType(t)}>{t}</button>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xs uppercase tracking-wide text-charcoal/50 mr-1">Status</span>
                        <button className={chip(status === "All")} onClick={() => setStatus("All")}>All</button>
                        {propertyStatuses.map((s) => (
                            <button key={s} className={chip(status === s)} onClick={() => setStatus(s)}>{s}</button>
                        ))}
                    </div>
                </div>

                <p className="text-charcoal/60 text-sm mt-8">
                    Showing <span className="text-navy font-medium">{filtered.length}</span> development{filtered.length === 1 ? "" : "s"}
                </p>

                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {filtered.map((property, index) => (
                            <motion.div key={property.slug}
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: (index % 3) * 0.08, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                            >
                                <PropertyCard property={property} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 py-20 text-center border border-dashed border-zinc-200 rounded-2xl">
                        <p className="text-navy font-medium">No developments match these filters yet.</p>
                        <p className="text-charcoal/60 text-sm mt-1">Try a different type or status — or talk to our team about upcoming launches.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
