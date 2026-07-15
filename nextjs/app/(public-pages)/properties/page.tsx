import type { Metadata } from "next";
import { HeroSection } from "@/sections/hero-sections";
import { PropertiesExplorer } from "@/components/properties-explorer";
import { getProperties, getSection } from "@/lib/content";

export const metadata: Metadata = {
    title: "Developments & Properties — INCK Realty Ltd",
    description:
        "Explore INCK Realty's portfolio of affordable homes, gated estates, apartments, luxury villas and mixed-use developments across Kenya.",
};

const heroDefaults = {
    eyebrow: "OUR PORTFOLIO",
    headingLead: "Developments Across",
    headingAccent: "Kenya",
    headingTail: "Across Africa",
    body: "From affordable homes to premium residences and mixed-use landmarks — find the development that fits your life or portfolio.",
    backgroundImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
};

export default async function PropertiesPage() {
    const [properties, hero] = await Promise.all([
        getProperties(),
        getSection("properties_hero", heroDefaults),
    ]);

    return (
        <main>
            <HeroSection content={hero} variant="compact" align="center" />

            <PropertiesExplorer properties={properties} />
        </main>
    );
}
