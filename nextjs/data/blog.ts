// Static fallback used when the API is unavailable. The live content is
// served by the Flask backend and editable in the admin panel.

const img = (id: string, w = 1400) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export type BlockType = "paragraph" | "heading" | "quote" | "image";

export interface Block {
    type: BlockType;
    text?: string;
    src?: string;
    caption?: string;
}

export interface Post {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    readTime: string;
    coverImage: string;
    featured: boolean;
    published: boolean;
    tags: string[];
    body: Block[];
    publishedAt: string | null;
}

const P = (text: string): Block => ({ type: "paragraph", text });
const H = (text: string): Block => ({ type: "heading", text });
const Q = (text: string): Block => ({ type: "quote", text });
const IMG = (id: string, caption = ""): Block => ({ type: "image", src: img(id), caption });

export const posts: Post[] = [
    {
        slug: "kenya-affordable-housing-what-buyers-should-know",
        title: "Kenya's Affordable Housing Push: What Buyers Should Actually Know",
        excerpt: "Affordable housing is the phrase on every developer's lips. Here is what it really means for a first-time buyer in Kenya — and the questions worth asking before you commit.",
        category: "Market Insight", author: "INCK Realty", readTime: "6 min read",
        coverImage: img("1568605114967-8130f3a36994"), featured: true, published: true,
        tags: ["Affordable Housing", "First-time buyers", "Kenya"],
        publishedAt: "2026-06-18T09:00:00Z",
        body: [
            P("Kenya has a housing gap measured in the hundreds of thousands of units a year. That gap is not just a statistic — it is the reason a young family in Nairobi can spend a decade renting while saving for a deposit that keeps moving further away."),
            H("What 'affordable' actually means"),
            P("Affordable housing is not a synonym for cheap housing. It is housing priced so that a household spends a sustainable share of its income on shelter — typically around a third — without cutting into food, school fees and transport."),
            P("In practice, that means a developer has to engineer affordability into the project from day one: land acquired at the right basis, efficient unit layouts, standardised components, and infrastructure planned at scale rather than retrofitted."),
            Q("If affordability is not designed in from the first sketch, it cannot be discounted in at the end."),
            H("The questions worth asking"),
            P("Before you put money down on any affordable scheme, ask for three things. First, the title — is it a clean individual title, or a share of a mother title that will take years to subdivide? Second, the infrastructure plan — who pays for water, sewer and the access road, and when? Third, the delivery record — what has this developer actually completed and handed over?"),
            IMG("1570129477492-45c003edd2be", "Well-planned infrastructure is what separates a housing scheme from a community."),
            H("Why we build the way we build"),
            P("At INCK Realty, projects like Baraka Gardens start from a simple constraint: the home has to be genuinely reachable for a working family, and it still has to last thirty years. That constraint shapes everything — the plot sizes, the wall systems, the roofing, the phasing."),
            P("Affordability without quality is a false economy. A home that costs less today but fails in five years is the most expensive home you can buy."),
        ],
    },
    {
        slug: "off-plan-vs-ready-homes-kenya",
        title: "Off-Plan vs Ready Homes: Choosing With Your Eyes Open",
        excerpt: "Off-plan can stretch your budget further, but it trades certainty for time. A candid look at the real trade-offs — and how to protect yourself either way.",
        category: "Buying Guide", author: "INCK Realty", readTime: "5 min read",
        coverImage: img("1545324418-cc1a3fa10c00"), featured: false, published: true,
        tags: ["Off-plan", "Buying Guide", "Investment"],
        publishedAt: "2026-06-04T09:00:00Z",
        body: [
            P("Buying off-plan means committing to a home that does not exist yet. In exchange, you usually get a lower entry price, a staged payment plan and first pick of the units. Buying a ready home means you walk in, look around, and know exactly what you are getting."),
            H("The case for off-plan"),
            P("The price advantage is real. Off-plan pricing at launch typically sits below the completed value, and a staged payment plan spreads the cost across the construction period rather than demanding a full deposit up front."),
            H("The case for ready"),
            P("Certainty. There is no completion risk, no specification drift, no waiting. You can inspect the finishes, test the water pressure, meet the neighbours and move in."),
            IMG("1613490493576-7fde63acd811", "A completed villa removes the guesswork — what you see is what you own."),
            H("How to protect yourself off-plan"),
            P("Insist on a written specification schedule, not a glossy brochure. Tie payments to verified construction milestones rather than dates. Check that the developer's payments go through a project account."),
            Q("The best protection in an off-plan purchase is not a clause. It is a developer with something to lose."),
            P("Neither route is universally right. The honest answer depends on your timeline, your risk appetite and how much certainty you need to sleep at night."),
        ],
    },
    {
        slug: "anatomy-of-a-gated-community",
        title: "The Anatomy of a Gated Community That Actually Works",
        excerpt: "A wall and a guard do not make a community. What separates estates that thrive from estates that quietly decline over a decade.",
        category: "Design", author: "INCK Realty", readTime: "7 min read",
        coverImage: img("1600585154340-be6161a56a0c"), featured: false, published: true,
        tags: ["Gated Estates", "Design", "Community"],
        publishedAt: "2026-05-21T09:00:00Z",
        body: [
            P("Drive around the outskirts of any growing African city and you will pass dozens of gated estates. Some feel alive a decade after handover. Others feel tired within three years — potholed roads, dry taps, a dying hedge and a service charge nobody wants to pay."),
            P("The difference is rarely the architecture. It is almost always the planning underneath it."),
            H("Get the density right"),
            P("Too sparse and the shared infrastructure becomes unaffordable per household. Too dense and the open space that made the estate attractive disappears."),
            H("Design the in-between spaces"),
            P("Residents remember the walk from the gate to their door far more than they remember a cornice detail. Streets that are pleasant to walk, a park that people actually cross, lighting that makes an evening stroll feel safe — these are what turn neighbours into a community."),
            IMG("1600607687939-ce8a6c25118c", "The spaces between homes decide whether an estate feels like a community."),
            H("Plan the utilities honestly"),
            P("Boreholes run dry. Generators need fuel. Sewer systems need capacity for the estate at full occupancy, not at phase one."),
            Q("An estate is not finished at handover. It is finished when it still works ten years later."),
        ],
    },
    {
        slug: "building-sustainably-in-african-cities",
        title: "Building Sustainably in African Cities Isn't a Luxury",
        excerpt: "Solar, rainwater harvesting and passive cooling are often sold as premium extras. In much of Africa they are simply good engineering.",
        category: "Sustainability", author: "INCK Realty", readTime: "5 min read",
        coverImage: img("1487958449943-2429e8be8625"), featured: false, published: true,
        tags: ["Sustainability", "Design", "Africa"],
        publishedAt: "2026-05-07T09:00:00Z",
        body: [
            P("Sustainability in property marketing has a branding problem. It is usually presented as a premium add-on — a badge for buyers who can afford to care."),
            P("That framing gets it backwards. In a market with unreliable grid power, rising water stress and a warming climate, the sustainable choice is frequently the cheapest one to live in."),
            H("Passive first, technology second"),
            P("Before a single solar panel goes on a roof, orientation, cross-ventilation, shading and thermal mass do most of the work. A home designed to stay cool without air conditioning does not need the air conditioning it cannot afford to run."),
            IMG("1600566753086-00f18fb6b3ea", "Passive design does the heavy lifting long before technology is added."),
            H("Water is the real constraint"),
            P("Across much of Kenya, water security matters more than energy. Rainwater harvesting, borehole backup and greywater reuse are not green flourishes — they are what keeps taps running in a dry year."),
            Q("The most sustainable building is the one people can still afford to run in twenty years."),
        ],
    },
    {
        slug: "real-estate-investment-kenya-fundamentals",
        title: "Property Investment in Kenya: Back to Fundamentals",
        excerpt: "Yields, capital growth and liquidity behave differently here than the headlines suggest. A grounded look at what actually drives returns.",
        category: "Investment", author: "INCK Realty", readTime: "6 min read",
        coverImage: img("1486406146926-c627a92ad1ab"), featured: false, published: true,
        tags: ["Investment", "Yields", "Kenya"],
        publishedAt: "2026-04-23T09:00:00Z",
        body: [
            P("Property is often sold as a one-way bet. It is not. Like any asset, real estate rewards people who understand what they are buying and punishes people who bought a story."),
            H("Yield and growth pull in different directions"),
            P("High rental yields tend to show up where capital growth is modest, and vice versa. Decide which one you are actually buying before you sign."),
            H("Location is really infrastructure"),
            P("What people call 'location' is usually a proxy for infrastructure: a road that works, water that arrives, schools within reach, and power that stays on."),
            IMG("1512453979798-5ea266f8880c", "Value follows infrastructure — usually before the market prices it in."),
            H("Respect liquidity"),
            P("Property is illiquid. Selling a home in a slow market can take many months. Never invest money you may need back quickly."),
            Q("The two questions that matter: what is my income, and what is my exit?"),
        ],
    },
    {
        slug: "first-home-checklist-kenya",
        title: "Your First Home: A Practical Checklist Before You Sign",
        excerpt: "Ten things to verify before you commit to your first property in Kenya — from title searches to the questions nobody thinks to ask about service charges.",
        category: "Buying Guide", author: "INCK Realty", readTime: "8 min read",
        coverImage: img("1600585154526-990dced4db0d"), featured: false, published: true,
        tags: ["First-time buyers", "Checklist", "Buying Guide"],
        publishedAt: "2026-04-09T09:00:00Z",
        body: [
            P("Buying your first home is the largest financial decision most people ever make, and it is usually made under emotional pressure and time constraints."),
            H("Before you view"),
            P("Get your financing clarity first. Know what a lender will actually advance you, what the deposit needs to be, and what the monthly repayment looks like at a rate two points higher than today's."),
            H("At the property"),
            P("Visit twice — once in daylight and once in the evening. Check water pressure at the tap. Ask where the water actually comes from and what happens when it fails."),
            IMG("1600121848594-d8644e57abab", "Visit twice. A home shows you different things in the morning and the evening."),
            H("On paper"),
            P("Commission an independent title search — do not rely on a copy handed to you. Confirm the land rates and rent are clear."),
            Q("Every unpleasant surprise in a property purchase was documented somewhere nobody read."),
            H("Before you sign"),
            P("Use your own advocate, not the developer's. Confirm the payment account is a project account. Get the specification schedule in writing."),
        ],
    },
];

export const postCategories = ["Market Insight", "Buying Guide", "Design", "Sustainability", "Investment"];

export function formatDate(iso: string | null): string {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
