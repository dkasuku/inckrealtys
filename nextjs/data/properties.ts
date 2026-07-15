// INCK Realty Ltd — property / project dataset
// Images sourced from Unsplash (allowed in next.config.ts remotePatterns).

const img = (id: string, w = 1200) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export type PropertyType =
    | "Gated Estate"
    | "Apartments"
    | "Bungalows"
    | "Maisonettes"
    | "Luxury Villas"
    | "Mixed-Use"
    | "Holiday Homes";

export type PropertyStatus = "Selling" | "Ready" | "Off-Plan" | "Coming Soon";

export interface Property {
    slug: string;
    name: string;
    tagline: string;
    type: PropertyType;
    status: PropertyStatus;
    location: string;
    priceFrom: number | null; // KES; null => Price on request
    beds: string;
    baths: string;
    size: string;
    plot: string;
    featured: boolean;
    shortDesc: string;
    description: string[];
    highlights: string[];
    amenities: string[];
    heroImage: string;
    cardImage: string;
    gallery: string[];
}

export const properties: Property[] = [
    {
        slug: "savannah-ridge-estate",
        name: "Savannah Ridge Estate",
        tagline: "Modern gated living on the edge of the city",
        type: "Gated Estate",
        status: "Selling",
        location: "Kiambu, Kenya",
        priceFrom: 8900000,
        beds: "3 & 4 Bedroom",
        baths: "2 - 4 Bath",
        size: "148 - 210 m²",
        plot: "1/8 acre",
        featured: true,
        shortDesc:
            "A secure, thoughtfully planned community of contemporary maisonettes surrounded by green open space.",
        description: [
            "Savannah Ridge Estate is a masterplanned community of 96 contemporary maisonettes, designed for families who want the calm of the suburbs without losing the connection to Nairobi.",
            "Every home is built with quality craftsmanship and practical, light-filled layouts. Landscaped streets, a central park and a controlled single entry keep the estate secure, social and green.",
        ],
        highlights: [
            "96 homes across 12 landscaped acres",
            "Controlled single-entry access with 24/7 security",
            "Central park, jogging loop and children's play areas",
            "Solar water heating and borehole supply",
        ],
        amenities: [
            "24/7 manned security & CCTV",
            "Backup borehole water",
            "Solar water heating",
            "Landscaped parks",
            "Paved internal roads",
            "Perimeter wall & electric fence",
            "Kids' play area",
            "Ample visitor parking",
        ],
        heroImage: img("1600585154340-be6161a56a0c", 1600),
        cardImage: img("1600585154340-be6161a56a0c", 900),
        gallery: [
            img("1600585154526-990dced4db0d"),
            img("1600607687939-ce8a6c25118c"),
            img("1600566753086-00f18fb6b3ea"),
            img("1600210492486-724fe5c67fb0"),
        ],
    },
    {
        slug: "acacia-heights-apartments",
        name: "Acacia Heights",
        tagline: "Elevated apartment living in the heart of Kilimani",
        type: "Apartments",
        status: "Off-Plan",
        location: "Kilimani, Nairobi",
        priceFrom: 6500000,
        beds: "1, 2 & 3 Bedroom",
        baths: "1 - 3 Bath",
        size: "62 - 138 m²",
        plot: "N/A",
        featured: true,
        shortDesc:
            "Sleek off-plan apartments with a rooftop lounge, gym and skyline views over Nairobi.",
        description: [
            "Acacia Heights brings modern vertical living to one of Nairobi's most connected neighbourhoods. Choose from efficient one-bedroom homes to expansive three-bedroom residences.",
            "Residents enjoy a rooftop lounge, fully equipped gym, high-speed lifts and a landscaped podium deck — all within walking distance of the city's best cafés, offices and schools.",
        ],
        highlights: [
            "Rooftop residents' lounge with skyline views",
            "Fully-fitted gym and heated pool",
            "High-speed lifts and standby generator",
            "Flexible off-plan payment plans",
        ],
        amenities: [
            "Rooftop lounge & pool",
            "Fitness centre",
            "High-speed lifts",
            "Standby generator",
            "Secure basement parking",
            "24/7 concierge & security",
            "High-speed fibre ready",
            "Rainwater harvesting",
        ],
        heroImage: img("1545324418-cc1a3fa10c00", 1600),
        cardImage: img("1545324418-cc1a3fa10c00", 900),
        gallery: [
            img("1560448204-e02f11c3d0e2"),
            img("1502672260266-1c1ef2d93688"),
            img("1560185007-cde436f6a4d0"),
            img("1512453979798-5ea266f8880c"),
        ],
    },
    {
        slug: "baraka-gardens",
        name: "Baraka Gardens",
        tagline: "Quality affordable homes for growing families",
        type: "Bungalows",
        status: "Selling",
        location: "Athi River, Machakos",
        priceFrom: 3200000,
        beds: "2 & 3 Bedroom",
        baths: "1 - 2 Bath",
        size: "76 - 110 m²",
        plot: "50 x 100 ft",
        featured: true,
        shortDesc:
            "An affordable housing community proving that value and quality can live under the same roof.",
        description: [
            "Baraka Gardens is our answer to Kenya's housing gap — well-built, dignified homes at a genuinely accessible price. Each bungalow sits on its own plot with room to grow.",
            "The community is planned around shared green spaces, a local shopping node and reliable infrastructure, making it ideal for first-time buyers and young families.",
        ],
        highlights: [
            "Homes from KES 3.2M with flexible financing",
            "Individual title deeds per plot",
            "On-site shopping and community centre",
            "Tarmac access road and reliable utilities",
        ],
        amenities: [
            "Individual title deeds",
            "Piped water & sewer",
            "Community shopping node",
            "Green shared spaces",
            "Street lighting",
            "Gated perimeter",
            "Kids' play area",
            "Mortgage partner support",
        ],
        heroImage: img("1568605114967-8130f3a36994", 1600),
        cardImage: img("1568605114967-8130f3a36994", 900),
        gallery: [
            img("1570129477492-45c003edd2be"),
            img("1502005097973-6a7082348e28"),
            img("1449844908441-8829872d2607"),
            img("1600121848594-d8644e57abab"),
        ],
    },
    {
        slug: "mombasa-pearl-residences",
        name: "Mombasa Pearl Residences",
        tagline: "Coastal luxury villas moments from the ocean",
        type: "Luxury Villas",
        status: "Ready",
        location: "Nyali, Mombasa",
        priceFrom: 24000000,
        beds: "4 & 5 Bedroom",
        baths: "4 - 6 Bath",
        size: "320 - 460 m²",
        plot: "1/4 acre",
        featured: true,
        shortDesc:
            "A private enclave of ready-to-move-in villas with pools, ocean breezes and timeless finishes.",
        description: [
            "Mombasa Pearl Residences is a boutique collection of ten completed villas set within a lush, gated coastal enclave in Nyali. Each home is finished to an exceptional standard.",
            "Expect double-volume living spaces, private swimming pools, staff quarters and generous verandas designed for the coast's indoor-outdoor lifestyle.",
        ],
        highlights: [
            "Move-in ready with premium finishes",
            "Private pool and mature landscaped garden",
            "Double-height living and entertainment spaces",
            "Minutes from beaches, malls and schools",
        ],
        amenities: [
            "Private swimming pools",
            "Staff quarters (DSQ)",
            "Solar & backup power",
            "Borehole water",
            "Gated & guarded enclave",
            "Fitted designer kitchens",
            "Double garages",
            "Landscaped gardens",
        ],
        heroImage: img("1613490493576-7fde63acd811", 1600),
        cardImage: img("1613490493576-7fde63acd811", 900),
        gallery: [
            img("1600585152220-90363fe7e115"),
            img("1600566753190-17f0baa2a6c3"),
            img("1600047509807-ba8f99d2cdde"),
            img("1502005229762-cf1b2da7c5d6"),
        ],
    },
    {
        slug: "tatu-vale-bungalows",
        name: "Tatu Vale Bungalows",
        tagline: "Single-storey comfort in a connected new town",
        type: "Bungalows",
        status: "Selling",
        location: "Ruiru, Kiambu",
        priceFrom: 5400000,
        beds: "3 Bedroom",
        baths: "2 Bath",
        size: "120 m²",
        plot: "1/8 acre",
        featured: false,
        shortDesc:
            "Practical, modern bungalows within a thriving master-planned new town north of Nairobi.",
        description: [
            "Tatu Vale offers spacious three-bedroom bungalows for buyers who prefer single-level living. Homes are bright, efficient and built to last.",
            "Located within a fast-growing new town, residents benefit from schools, retail and expressway links right on their doorstep.",
        ],
        highlights: [
            "All-on-one-level 3 bedroom layout",
            "Master ensuite and private garden",
            "Within an established new town",
            "Quick expressway access to the CBD",
        ],
        amenities: [
            "Private gardens",
            "Master ensuite",
            "Piped water & sewer",
            "Fibre-ready",
            "Gated community",
            "Nearby schools & retail",
            "Street lighting",
            "Ample parking",
        ],
        heroImage: img("1584622650111-993a426fbf0a", 1600),
        cardImage: img("1584622650111-993a426fbf0a", 900),
        gallery: [
            img("1512917774080-9991f1c4c750"),
            img("1564013799919-ab600027ffc6"),
            img("1523217582562-09d0def993a6"),
            img("1600607687939-ce8a6c25118c"),
        ],
    },
    {
        slug: "riverside-business-park",
        name: "Riverside Business Park",
        tagline: "Where people live, work and connect",
        type: "Mixed-Use",
        status: "Coming Soon",
        location: "Westlands, Nairobi",
        priceFrom: null,
        beds: "Retail, Office & Live-Work",
        baths: "—",
        size: "Flexible units",
        plot: "2.4 acres",
        featured: false,
        shortDesc:
            "A landmark mixed-use development blending grade-A offices, curated retail and serviced residences.",
        description: [
            "Riverside Business Park reimagines the Westlands business district as a walkable, mixed-use destination. Grade-A office floors sit above a vibrant retail promenade and serviced apartments.",
            "Designed to international sustainability standards, the development creates a true live-work-play environment for Nairobi's modern professionals.",
        ],
        highlights: [
            "Grade-A offices above curated retail",
            "Serviced live-work residences",
            "Green-rated, energy-efficient design",
            "Structured parking and EV charging",
        ],
        amenities: [
            "Grade-A office space",
            "Retail promenade",
            "Serviced apartments",
            "EV charging",
            "Structured parking",
            "Rooftop gardens",
            "Smart building systems",
            "24/7 security",
        ],
        heroImage: img("1486406146926-c627a92ad1ab", 1600),
        cardImage: img("1486406146926-c627a92ad1ab", 900),
        gallery: [
            img("1497366216548-37526070297c"),
            img("1487958449943-2429e8be8625"),
            img("1564013799919-ab600027ffc6"),
            img("1512453979798-5ea266f8880c"),
        ],
    },
];

export const propertyTypes: PropertyType[] = [
    "Gated Estate",
    "Apartments",
    "Bungalows",
    "Maisonettes",
    "Luxury Villas",
    "Mixed-Use",
    "Holiday Homes",
];

export const propertyStatuses: PropertyStatus[] = [
    "Selling",
    "Ready",
    "Off-Plan",
    "Coming Soon",
];

export function getProperty(slug: string): Property | undefined {
    return properties.find((p) => p.slug === slug);
}

export function featuredProperties(): Property[] {
    return properties.filter((p) => p.featured);
}

export function formatPrice(value: number | null): string {
    if (value === null) return "Price on request";
    if (value >= 1_000_000) {
        const m = value / 1_000_000;
        return `From KES ${Number.isInteger(m) ? m : m.toFixed(1)}M`;
    }
    return `From KES ${value.toLocaleString()}`;
}
