"""Seed the database with the admin user, properties and all site sections.

Usage:  python seed.py           (idempotent - updates existing rows)
        python seed.py --reset   (drops and recreates all tables first)
"""

import sys

from app import create_app
from extensions import db
from models import AdminUser, BlogPost, Property, SiteSection


def U(pid: str, w: int = 1200) -> str:
    return f"https://images.unsplash.com/photo-{pid}?auto=format&fit=crop&w={w}&q=80"


PROPERTIES = [
    dict(
        slug="savannah-ridge-estate", name="Savannah Ridge Estate",
        tagline="Modern gated living on the edge of the city",
        type="Gated Estate", status="Selling", location="Kiambu, Kenya",
        price_from=8900000, beds="3 & 4 Bedroom", baths="2 - 4 Bath",
        size="148 - 210 m²", plot="1/8 acre", featured=True,
        short_desc="A secure, thoughtfully planned community of contemporary maisonettes surrounded by green open space.",
        description=[
            "Savannah Ridge Estate is a masterplanned community of 96 contemporary maisonettes, designed for families who want the calm of the suburbs without losing the connection to Nairobi.",
            "Every home is built with quality craftsmanship and practical, light-filled layouts. Landscaped streets, a central park and a controlled single entry keep the estate secure, social and green.",
        ],
        highlights=[
            "96 homes across 12 landscaped acres",
            "Controlled single-entry access with 24/7 security",
            "Central park, jogging loop and children's play areas",
            "Solar water heating and borehole supply",
        ],
        amenities=[
            "24/7 manned security & CCTV", "Backup borehole water", "Solar water heating",
            "Landscaped parks", "Paved internal roads", "Perimeter wall & electric fence",
            "Kids' play area", "Ample visitor parking",
        ],
        hero_image=U("1600585154340-be6161a56a0c", 1600), card_image=U("1600585154340-be6161a56a0c", 900),
        gallery=[U("1600585154526-990dced4db0d"), U("1600607687939-ce8a6c25118c"),
                 U("1600566753086-00f18fb6b3ea"), U("1600210492486-724fe5c67fb0")],
    ),
    dict(
        slug="acacia-heights-apartments", name="Acacia Heights",
        tagline="Elevated apartment living in the heart of Kilimani",
        type="Apartments", status="Off-Plan", location="Kilimani, Nairobi",
        price_from=6500000, beds="1, 2 & 3 Bedroom", baths="1 - 3 Bath",
        size="62 - 138 m²", plot="N/A", featured=True,
        short_desc="Sleek off-plan apartments with a rooftop lounge, gym and skyline views over Nairobi.",
        description=[
            "Acacia Heights brings modern vertical living to one of Nairobi's most connected neighbourhoods. Choose from efficient one-bedroom homes to expansive three-bedroom residences.",
            "Residents enjoy a rooftop lounge, fully equipped gym, high-speed lifts and a landscaped podium deck — all within walking distance of the city's best cafés, offices and schools.",
        ],
        highlights=[
            "Rooftop residents' lounge with skyline views",
            "Fully-fitted gym and heated pool",
            "High-speed lifts and standby generator",
            "Flexible off-plan payment plans",
        ],
        amenities=[
            "Rooftop lounge & pool", "Fitness centre", "High-speed lifts", "Standby generator",
            "Secure basement parking", "24/7 concierge & security", "High-speed fibre ready",
            "Rainwater harvesting",
        ],
        hero_image=U("1545324418-cc1a3fa10c00", 1600), card_image=U("1545324418-cc1a3fa10c00", 900),
        gallery=[U("1560448204-e02f11c3d0e2"), U("1502672260266-1c1ef2d93688"),
                 U("1560185007-cde436f6a4d0"), U("1512453979798-5ea266f8880c")],
    ),
    dict(
        slug="baraka-gardens", name="Baraka Gardens",
        tagline="Quality affordable homes for growing families",
        type="Bungalows", status="Selling", location="Athi River, Machakos",
        price_from=3200000, beds="2 & 3 Bedroom", baths="1 - 2 Bath",
        size="76 - 110 m²", plot="50 x 100 ft", featured=True,
        short_desc="An affordable housing community proving that value and quality can live under the same roof.",
        description=[
            "Baraka Gardens is our answer to Kenya's housing gap — well-built, dignified homes at a genuinely accessible price. Each bungalow sits on its own plot with room to grow.",
            "The community is planned around shared green spaces, a local shopping node and reliable infrastructure, making it ideal for first-time buyers and young families.",
        ],
        highlights=[
            "Homes from KES 3.2M with flexible financing",
            "Individual title deeds per plot",
            "On-site shopping and community centre",
            "Tarmac access road and reliable utilities",
        ],
        amenities=[
            "Individual title deeds", "Piped water & sewer", "Community shopping node",
            "Green shared spaces", "Street lighting", "Gated perimeter", "Kids' play area",
            "Mortgage partner support",
        ],
        hero_image=U("1568605114967-8130f3a36994", 1600), card_image=U("1568605114967-8130f3a36994", 900),
        gallery=[U("1570129477492-45c003edd2be"), U("1502005097973-6a7082348e28"),
                 U("1449844908441-8829872d2607"), U("1600121848594-d8644e57abab")],
    ),
    dict(
        slug="mombasa-pearl-residences", name="Mombasa Pearl Residences",
        tagline="Coastal luxury villas moments from the ocean",
        type="Luxury Villas", status="Ready", location="Nyali, Mombasa",
        price_from=24000000, beds="4 & 5 Bedroom", baths="4 - 6 Bath",
        size="320 - 460 m²", plot="1/4 acre", featured=True,
        short_desc="A private enclave of ready-to-move-in villas with pools, ocean breezes and timeless finishes.",
        description=[
            "Mombasa Pearl Residences is a boutique collection of ten completed villas set within a lush, gated coastal enclave in Nyali. Each home is finished to an exceptional standard.",
            "Expect double-volume living spaces, private swimming pools, staff quarters and generous verandas designed for the coast's indoor-outdoor lifestyle.",
        ],
        highlights=[
            "Move-in ready with premium finishes",
            "Private pool and mature landscaped garden",
            "Double-height living and entertainment spaces",
            "Minutes from beaches, malls and schools",
        ],
        amenities=[
            "Private swimming pools", "Staff quarters (DSQ)", "Solar & backup power",
            "Borehole water", "Gated & guarded enclave", "Fitted designer kitchens",
            "Double garages", "Landscaped gardens",
        ],
        hero_image=U("1613490493576-7fde63acd811", 1600), card_image=U("1613490493576-7fde63acd811", 900),
        gallery=[U("1600585152220-90363fe7e115"), U("1600566753190-17f0baa2a6c3"),
                 U("1600047509807-ba8f99d2cdde"), U("1502005229762-cf1b2da7c5d6")],
    ),
    dict(
        slug="tatu-vale-bungalows", name="Tatu Vale Bungalows",
        tagline="Single-storey comfort in a connected new town",
        type="Bungalows", status="Selling", location="Ruiru, Kiambu",
        price_from=5400000, beds="3 Bedroom", baths="2 Bath",
        size="120 m²", plot="1/8 acre", featured=False,
        short_desc="Practical, modern bungalows within a thriving master-planned new town north of Nairobi.",
        description=[
            "Tatu Vale offers spacious three-bedroom bungalows for buyers who prefer single-level living. Homes are bright, efficient and built to last.",
            "Located within a fast-growing new town, residents benefit from schools, retail and expressway links right on their doorstep.",
        ],
        highlights=[
            "All-on-one-level 3 bedroom layout", "Master ensuite and private garden",
            "Within an established new town", "Quick expressway access to the CBD",
        ],
        amenities=[
            "Private gardens", "Master ensuite", "Piped water & sewer", "Fibre-ready",
            "Gated community", "Nearby schools & retail", "Street lighting", "Ample parking",
        ],
        hero_image=U("1584622650111-993a426fbf0a", 1600), card_image=U("1584622650111-993a426fbf0a", 900),
        gallery=[U("1512917774080-9991f1c4c750"), U("1564013799919-ab600027ffc6"),
                 U("1523217582562-09d0def993a6"), U("1600607687939-ce8a6c25118c")],
    ),
    dict(
        slug="riverside-business-park", name="Riverside Business Park",
        tagline="Where people live, work and connect",
        type="Mixed-Use", status="Coming Soon", location="Westlands, Nairobi",
        price_from=None, beds="Retail, Office & Live-Work", baths="—",
        size="Flexible units", plot="2.4 acres", featured=False,
        short_desc="A landmark mixed-use development blending grade-A offices, curated retail and serviced residences.",
        description=[
            "Riverside Business Park reimagines the Westlands business district as a walkable, mixed-use destination. Grade-A office floors sit above a vibrant retail promenade and serviced apartments.",
            "Designed to international sustainability standards, the development creates a true live-work-play environment for Nairobi's modern professionals.",
        ],
        highlights=[
            "Grade-A offices above curated retail", "Serviced live-work residences",
            "Green-rated, energy-efficient design", "Structured parking and EV charging",
        ],
        amenities=[
            "Grade-A office space", "Retail promenade", "Serviced apartments", "EV charging",
            "Structured parking", "Rooftop gardens", "Smart building systems", "24/7 security",
        ],
        hero_image=U("1486406146926-c627a92ad1ab", 1600), card_image=U("1486406146926-c627a92ad1ab", 900),
        gallery=[U("1497366216548-37526070297c"), U("1487958449943-2429e8be8625"),
                 U("1564013799919-ab600027ffc6"), U("1512453979798-5ea266f8880c")],
    ),
]


def P(text):
    return {"type": "paragraph", "text": text}


def H(text):
    return {"type": "heading", "text": text}


def Q(text):
    return {"type": "quote", "text": text}


def IMG(pid, caption=""):
    return {"type": "image", "src": U(pid, 1400), "caption": caption}


POSTS = [
    dict(
        slug="kenya-affordable-housing-what-buyers-should-know",
        title="Kenya's Affordable Housing Push: What Buyers Should Actually Know",
        excerpt="Affordable housing is the phrase on every developer's lips. Here is what it really means for a first-time buyer in Kenya — and the questions worth asking before you commit.",
        category="Market Insight", author="INCK Realty", read_time="6 min read",
        cover_image=U("1568605114967-8130f3a36994", 1400), featured=True, published=True,
        tags=["Affordable Housing", "First-time buyers", "Kenya"],
        body=[
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
    ),
    dict(
        slug="off-plan-vs-ready-homes-kenya",
        title="Off-Plan vs Ready Homes: Choosing With Your Eyes Open",
        excerpt="Off-plan can stretch your budget further, but it trades certainty for time. A candid look at the real trade-offs — and how to protect yourself either way.",
        category="Buying Guide", author="INCK Realty", read_time="5 min read",
        cover_image=U("1545324418-cc1a3fa10c00", 1400), featured=False, published=True,
        tags=["Off-plan", "Buying Guide", "Investment"],
        body=[
            P("Buying off-plan means committing to a home that does not exist yet. In exchange, you usually get a lower entry price, a staged payment plan and first pick of the units. Buying a ready home means you walk in, look around, and know exactly what you are getting."),
            H("The case for off-plan"),
            P("The price advantage is real. Off-plan pricing at launch typically sits below the completed value, and a staged payment plan spreads the cost across the construction period rather than demanding a full deposit up front. For buyers with steady income but limited savings, this can be the difference between owning and continuing to rent."),
            H("The case for ready"),
            P("Certainty. There is no completion risk, no specification drift, no waiting. You can inspect the finishes, test the water pressure, meet the neighbours and move in. For buyers who need a home now — or investors who want rental income immediately — ready stock is worth the premium."),
            IMG("1613490493576-7fde63acd811", "A completed villa removes the guesswork — what you see is what you own."),
            H("How to protect yourself off-plan"),
            P("Insist on a written specification schedule, not a glossy brochure. Tie payments to verified construction milestones rather than dates. Check that the developer's payments go through a project account. And look hard at the delivery track record — a developer who has handed over before is far more likely to hand over again."),
            Q("The best protection in an off-plan purchase is not a clause. It is a developer with something to lose."),
            P("Neither route is universally right. The honest answer depends on your timeline, your risk appetite and how much certainty you need to sleep at night."),
        ],
    ),
    dict(
        slug="anatomy-of-a-gated-community",
        title="The Anatomy of a Gated Community That Actually Works",
        excerpt="A wall and a guard do not make a community. What separates estates that thrive from estates that quietly decline over a decade.",
        category="Design", author="INCK Realty", read_time="7 min read",
        cover_image=U("1600585154340-be6161a56a0c", 1400), featured=False, published=True,
        tags=["Gated Estates", "Design", "Community"],
        body=[
            P("Drive around the outskirts of any growing African city and you will pass dozens of gated estates. Some feel alive a decade after handover. Others feel tired within three years — potholed roads, dry taps, a dying hedge and a service charge nobody wants to pay."),
            P("The difference is rarely the architecture. It is almost always the planning underneath it."),
            H("Get the density right"),
            P("Too sparse and the shared infrastructure becomes unaffordable per household. Too dense and the open space that made the estate attractive disappears. There is a narrow band where a service charge stays reasonable and the place still feels generous."),
            H("Design the in-between spaces"),
            P("Residents remember the walk from the gate to their door far more than they remember a cornice detail. Streets that are pleasant to walk, a park that people actually cross, lighting that makes an evening stroll feel safe — these are what turn neighbours into a community."),
            IMG("1600607687939-ce8a6c25118c", "The spaces between homes decide whether an estate feels like a community."),
            H("Plan the utilities honestly"),
            P("Boreholes run dry. Generators need fuel. Sewer systems need capacity for the estate at full occupancy, not at phase one. An estate that quietly under-specifies its utilities is handing residents a bill they will discover in year four."),
            Q("An estate is not finished at handover. It is finished when it still works ten years later."),
            H("Hand over the management well"),
            P("The most overlooked moment in an estate's life is the handover to the residents' association. A developer who leaves behind clear records, a funded sinking fund and a realistic service charge is giving the community a chance. One who does not is walking away from the mess."),
        ],
    ),
    dict(
        slug="building-sustainably-in-african-cities",
        title="Building Sustainably in African Cities Isn't a Luxury",
        excerpt="Solar, rainwater harvesting and passive cooling are often sold as premium extras. In much of Africa they are simply good engineering.",
        category="Sustainability", author="INCK Realty", read_time="5 min read",
        cover_image=U("1487958449943-2429e8be8625", 1400), featured=False, published=True,
        tags=["Sustainability", "Design", "Africa"],
        body=[
            P("Sustainability in property marketing has a branding problem. It is usually presented as a premium add-on — a badge for buyers who can afford to care."),
            P("That framing gets it backwards. In a market with unreliable grid power, rising water stress and a warming climate, the sustainable choice is frequently the cheapest one to live in."),
            H("Passive first, technology second"),
            P("Before a single solar panel goes on a roof, orientation, cross-ventilation, shading and thermal mass do most of the work. A home designed to stay cool without air conditioning does not need the air conditioning it cannot afford to run."),
            IMG("1600566753086-00f18fb6b3ea", "Passive design does the heavy lifting long before technology is added."),
            H("Water is the real constraint"),
            P("Across much of Kenya, water security matters more than energy. Rainwater harvesting, borehole backup and greywater reuse are not green flourishes — they are what keeps taps running in a dry year."),
            Q("The most sustainable building is the one people can still afford to run in twenty years."),
            H("Sustainability compounds"),
            P("A solar water heater saves a household money every month for its entire life. Multiply that across an estate and across a decade, and the case makes itself. We build this way not because it photographs well, but because the arithmetic works."),
        ],
    ),
    dict(
        slug="real-estate-investment-kenya-fundamentals",
        title="Property Investment in Kenya: Back to Fundamentals",
        excerpt="Yields, capital growth and liquidity behave differently here than the headlines suggest. A grounded look at what actually drives returns.",
        category="Investment", author="INCK Realty", read_time="6 min read",
        cover_image=U("1486406146926-c627a92ad1ab", 1400), featured=False, published=True,
        tags=["Investment", "Yields", "Kenya"],
        body=[
            P("Property is often sold as a one-way bet. It is not. Like any asset, real estate rewards people who understand what they are buying and punishes people who bought a story."),
            H("Yield and growth pull in different directions"),
            P("High rental yields tend to show up where capital growth is modest, and vice versa. A well-located apartment in an established suburb may yield less but appreciate steadily. A unit in an emerging satellite town may rent at a strong yield while its capital value waits for infrastructure to catch up."),
            P("Decide which one you are actually buying before you sign."),
            H("Location is really infrastructure"),
            P("What people call 'location' is usually a proxy for infrastructure: a road that works, water that arrives, schools within reach, and power that stays on. When new infrastructure lands, the value follows it — often before the market notices."),
            IMG("1512453979798-5ea266f8880c", "Value follows infrastructure — usually before the market prices it in."),
            H("Respect liquidity"),
            P("Property is illiquid. Selling a home in a slow market can take many months, and the price you get is the price a buyer will pay that quarter, not the one in your spreadsheet. Never invest money you may need back quickly."),
            Q("The two questions that matter: what is my income, and what is my exit?"),
            H("Buy the developer, not just the building"),
            P("In an off-plan or early-phase purchase, you are underwriting a promise. The quality of the counterparty is part of the asset. Track record, transparency and financial discipline are not soft factors — they are the investment."),
        ],
    ),
    dict(
        slug="first-home-checklist-kenya",
        title="Your First Home: A Practical Checklist Before You Sign",
        excerpt="Ten things to verify before you commit to your first property in Kenya — from title searches to the questions nobody thinks to ask about service charges.",
        category="Buying Guide", author="INCK Realty", read_time="8 min read",
        cover_image=U("1600585154526-990dced4db0d", 1400), featured=False, published=True,
        tags=["First-time buyers", "Checklist", "Buying Guide"],
        body=[
            P("Buying your first home is the largest financial decision most people ever make, and it is usually made under emotional pressure and time constraints. A checklist will not remove the emotion, but it will stop you skipping the things that matter."),
            H("Before you view"),
            P("Get your financing clarity first. Know what a lender will actually advance you, what the deposit needs to be, and what the monthly repayment looks like at a rate two points higher than today's. If that number frightens you, adjust your budget, not your assumptions."),
            H("At the property"),
            P("Visit twice — once in daylight and once in the evening. Check water pressure at the tap. Ask where the water actually comes from and what happens when it fails. Look at the roofline, the drainage and the walls near ground level for damp."),
            IMG("1600121848594-d8644e57abab", "Visit twice. A home shows you different things in the morning and the evening."),
            H("On paper"),
            P("Commission an independent title search — do not rely on a copy handed to you. Confirm the land rates and rent are clear. If it is a scheme, read the sale agreement's completion and default clauses properly, and ask what the service charge covers and how it is set."),
            Q("Every unpleasant surprise in a property purchase was documented somewhere nobody read."),
            H("Before you sign"),
            P("Use your own advocate, not the developer's. Confirm the payment account is a project account. Get the specification schedule in writing. And make sure the handover conditions — what 'complete' means — are defined in the contract rather than in a conversation."),
            P("None of this is glamorous. All of it is cheaper than the alternative."),
        ],
    ),
]


SECTIONS = [
    ("hero", "Homepage — Hero", "home", {
        "badge": "Developing the Future of African Living",
        "headingLead": "Building Modern Homes &",
        "headingAccent": "Communities",
        "headingTail": "Across Africa",
        "body": "INCK Realty Ltd creates high-quality, affordable and sustainable residential communities that blend innovative architecture with practical living.",
        "primaryLabel": "Explore Developments",
        "primaryHref": "/properties",
        "secondaryLabel": "Book a Call",
        "secondaryHref": "/contact",
        "backgroundImages": [
            "/hero-image.png",
            U("1600585154340-be6161a56a0c", 1920),
            U("1613490493576-7fde63acd811", 1920),
            U("1545324418-cc1a3fa10c00", 1920),
        ],
        "intervalMs": 6000,
    }),
    ("stats", "Homepage — Who We Are", "home", {
        "eyebrow": "WHO WE ARE",
        "heading": "Redefining Property Development Across Africa",
        "body": "We bring together expertise in planning, design, construction and project management to deliver developments that create long-term value for homeowners, investors and communities.",
        "ctaLabel": "Explore Developments",
        "ctaHref": "/properties",
        "image": U("1600880292203-757bb62b4baf"),
        "imageAlt": "The INCK Realty team in Nairobi, Kenya",
        "stats": [
            {"value": 10, "suffix": "+", "label": "HOMES DELIVERED"},
            {"value": 10, "suffix": "+", "label": "COMMUNITIES DEVELOPED"},
            {"value": 98, "suffix": "%", "label": "CLIENT SATISFACTION RATE"},
        ],
    }),
    ("what_we_develop", "Homepage — What We Develop", "home", {
        "eyebrow": "WHAT WE DEVELOP",
        "heading": "A Portfolio Built for Every Stage of Life",
        "body": "From affordable housing to premium residences and mixed-use developments, our projects meet the needs of today's homeowners and tomorrow's cities.",
        "items": [
            {"title": "Affordable Housing Communities", "desc": "Quality homes designed to be accessible for today's families."},
            {"title": "Modern Bungalows", "desc": "Practical, contemporary single-storey living."},
            {"title": "Maisonettes", "desc": "Spacious multi-level homes for growing families."},
            {"title": "Luxury Villas", "desc": "Premium residences built with exceptional craftsmanship."},
            {"title": "Apartment Developments", "desc": "Modern apartments for urban, connected lifestyles."},
            {"title": "Gated Estates", "desc": "Secure, thoughtfully planned residential communities."},
            {"title": "Mixed-Use Developments", "desc": "Integrated spaces that blend living, work and leisure."},
            {"title": "Commercial Properties", "desc": "Retail and business spaces built for growth."},
            {"title": "Holiday Homes & Resorts", "desc": "Getaway and resort developments in prime locations."},
            {"title": "Custom Residential Projects", "desc": "Bespoke homes built around your specific vision."},
        ],
    }),
    ("projects", "Homepage — Our Projects", "home", {
        "eyebrow": "OUR PROJECTS",
        "heading": "Developments Shaping Communities",
        "body": "A snapshot of the residential and mixed-use projects we are proud to be building across Kenya.",
        "ctaLabel": "View all developments",
        "ctaHref": "/properties",
    }),
    ("gallery", "Homepage — Gallery Strip", "home", {
        "images": [
            "/assets/galleryImage1.png", "/assets/galleryImage2.png",
            "/assets/galleryImage3.png", "/assets/galleryImage4.png",
        ],
    }),
    ("why_choose_us", "Homepage — Why INCK Realty", "home", {
        "eyebrow": "WHY INCK REALTY",
        "heading": "Developing With Purpose, Quality & Vision",
        "body": "We don't just construct buildings—we create communities, unlock investment opportunities and contribute to Africa's urban transformation.",
        "items": [
            {"title": "Innovative Property Developments", "description": "We blend innovative architecture, quality craftsmanship and practical living to deliver modern homes designed for today's homeowners and tomorrow's cities.", "image": "/assets/house.png"},
            {"title": "Modern Architectural Designs", "description": "From affordable housing to premium residences and gated communities, our designs reflect international standards while embracing local culture.", "image": "/assets/galleryImage1.png"},
            {"title": "Quality, Durability & Transparency", "description": "We are committed to quality and durability with transparent, professional project delivery you can trust at every stage.", "image": "/assets/galleryImage2.png"},
            {"title": "Sustainable Development Practices", "description": "Sustainability sits at the core of every project, creating communities that support economic growth and improve quality of life.", "image": "/assets/galleryImage3.png"},
            {"title": "Strong Investment Opportunities", "description": "With a customer-first approach and a long-term vision for Africa's growth, we unlock lasting value for homeowners and investors alike.", "image": "/assets/galleryImage4.png"},
        ],
    }),
    ("vision_mission", "Homepage — Vision & Mission", "home", {
        "eyebrow": "OUR PURPOSE",
        "visionTitle": "Our Vision",
        "visionBody": "To become Africa's leading real estate developer, transforming communities through innovative, sustainable and affordable developments that improve lives and inspire future generations.",
        "missionTitle": "Our Mission",
        "missionBody": "To develop world-class residential and commercial projects that combine exceptional design, quality construction, affordability and sustainable development while creating lasting value for homeowners, investors and communities across Africa.",
        "africaTitle": "OUR VISION FOR AFRICA",
        "africaBody": "Africa is experiencing one of the fastest urban transformations in the world. Beginning in Kenya, our ambition is to expand into major cities across the continent—delivering developments that reflect international standards while embracing local culture, innovation and sustainability.",
    }),
    ("core_values", "Homepage — Core Values", "home", {
        "eyebrow": "OUR CORE VALUES",
        "heading": "The Principles That Guide Us",
        "body": "Everything we build is grounded in a clear set of values that shape how we work with communities, investors and each other.",
        "items": [
            {"title": "Integrity", "desc": "We do what is right, with honesty and transparency at every step."},
            {"title": "Excellence", "desc": "We hold ourselves to the highest standards of quality and craft."},
            {"title": "Innovation", "desc": "We embrace modern design and forward-thinking solutions."},
            {"title": "Sustainability", "desc": "We build responsibly for people and the environment."},
            {"title": "Customer Commitment", "desc": "We put homeowners and investors at the centre of all we do."},
            {"title": "Accountability", "desc": "We take ownership and deliver on every promise we make."},
            {"title": "Collaboration", "desc": "We build lasting communities through strong partnerships."},
        ],
    }),
    ("testimonials", "Homepage — Testimonials", "home", {
        "eyebrow": "REVIEWS",
        "heading": "Trusted by Homebuyers. Proven by Results.",
        "body": "Honest words from clients who trusted us with their space.",
        "items": [
            {"name": "James Mwangi", "location": "Nairobi, Kenya", "avatar": U("1507003211169-0a1dd7228f2d", 120), "text": "INCK delivered our home exactly as promised. The craftsmanship and attention to detail are outstanding."},
            {"name": "Amina Hassan", "location": "Mombasa, Kenya", "avatar": U("1494790108377-be9c29b29330", 120), "text": "Professional, transparent and truly customer-first. Buying into their gated estate was a seamless experience."},
            {"name": "Grace Njeri", "location": "Kiambu, Kenya", "avatar": U("1438761681033-6461ffad8d80", 120), "text": "From planning to handover, everything was handled professionally. A developer you can genuinely trust."},
            {"name": "David Ochieng", "location": "Kisumu, Kenya", "avatar": U("1500648767791-00dcc994a43e", 120), "text": "A strong investment with real long-term value. INCK's vision for African living is impressive."},
            {"name": "Samuel Kariuki", "location": "Nakuru, Kenya", "avatar": U("1539571696357-5a69c17a67c6", 120), "text": "Modern design, quality build and sustainable communities. They deliver on every promise they make."},
            {"name": "Fatuma Ali", "location": "Nairobi, Kenya", "avatar": U("1519085360753-af0119f7cbe7", 120), "text": "As a first-time homeowner, I felt supported throughout the entire journey. Highly recommended."},
        ],
    }),
    ("cta", "Homepage — Call To Action", "home", {
        "heading": "Find the Perfect Home for Your Lifestyle",
        "body": "Explore modern bungalows, maisonettes, luxury villas, apartments and gated estates in Kenya's most promising locations.",
        "buttonLabel": "Browse Developments",
        "buttonHref": "/properties",
        "images": ["/assets/galleryImage1.png", "/assets/galleryImage2.png", "/assets/galleryImage3.png"],
    }),
    ("contact", "Contact Form Block", "home", {
        "eyebrow": "CONTACT",
        "heading": "Connect with us to get the best deal",
        "buttonLabel": "GET STARTED",
        "image": "/assets/house.png",
        "hoursTitle": "KEY DETAILS",
        "hours": ["Monday-Friday: 10 AM - 6 PM", "Saturday: 10 AM - 4 PM"],
    }),
    ("about_hero", "About — Hero", "about", {
        "eyebrow": "WHO WE ARE",
        "headingLead": "Developing the Future of",
        "headingAccent": "African Living",
        "body": "A forward-thinking Kenyan real estate developer committed to high-quality, affordable and sustainable communities across Kenya and, ultimately, across Africa.",
        "backgroundImage": U("1487958449943-2429e8be8625", 1600),
    }),
    ("about_story", "About — Our Story", "about", {
        "eyebrow": "OUR STORY",
        "heading": "More Than Buildings — We Create Communities",
        "paragraphs": [
            "INCK Realty Ltd brings together expertise in planning, design, construction and project management to deliver developments that create long-term value for homeowners, investors and communities.",
            "We develop modern homes that blend innovative architecture, quality craftsmanship and practical living — from affordable housing and gated communities to premium residences and mixed-use landmarks.",
            "As we grow, our goal is to become one of Africa's most trusted property development companies, contributing to the continent's urban transformation.",
        ],
        "image": U("1600585154340-be6161a56a0c"),
        "ctaLabel": "Explore our developments",
        "ctaHref": "/properties",
        "stats": [
            {"value": "12+", "label": "Communities in development"},
            {"value": "5,000+", "label": "Homes envisioned"},
            {"value": "1 → Africa", "label": "From Kenya, across the continent"},
        ],
    }),
    ("properties_hero", "Properties — Hero", "properties", {
        "eyebrow": "OUR PORTFOLIO",
        "headingLead": "Developments Across",
        "headingAccent": "Kenya",
        "headingTail": "Across Africa",
        "body": "From affordable homes to premium residences and mixed-use landmarks — find the development that fits your life or portfolio.",
        "backgroundImage": U("1512453979798-5ea266f8880c", 1600),
    }),
    ("contact_hero", "Contact — Hero & Details", "contact", {
        "eyebrow": "CONTACT",
        "heading": "Let's Talk",
        "body": "Connect with our team to get the best deal, book a site visit or discuss an investment.",
        "backgroundImage": U("1497366216548-37526070297c", 1600),
        "phone": "+254 712 470 341",
        "email": "info@inckrealty.com",
        "address": "Westlands, Nairobi, Kenya",
        "hours": "Mon–Fri 10–6 · Sat 10–4",
    }),
    ("blog_hero", "Blog — Hero", "blog", {
        "eyebrow": "INSIGHTS",
        "headingLead": "Notes on Building",
        "headingAccent": "Africa's Future",
        "body": "Market insight, buying guides and the thinking behind how we design and deliver communities across Kenya.",
        "backgroundImage": U("1486406146926-c627a92ad1ab", 1600),
    }),
    ("footer", "Global — Footer", "global", {
        "blurb": "A forward-thinking Kenyan real estate developer creating high-quality, affordable and sustainable residential communities across Kenya and, ultimately, across Africa.",
        "tagline": "Building Communities. Creating Opportunities. Shaping Africa's Future.",
    }),
]


def seed(reset: bool = False):
    app = create_app()
    with app.app_context():
        if reset:
            db.drop_all()
            db.create_all()
            print("· tables reset")

        # --- admin user ---
        email = app.config["ADMIN_EMAIL"].lower()
        user = AdminUser.query.filter_by(email=email).first()
        if not user:
            user = AdminUser(email=email, name="Administrator")
            user.set_password(app.config["ADMIN_PASSWORD"])
            db.session.add(user)
            print(f"· admin created: {email}")
        else:
            print(f"· admin exists:  {email}")

        # --- properties ---
        for data in PROPERTIES:
            prop = Property.query.filter_by(slug=data["slug"]).first()
            if not prop:
                prop = Property(**data)
                db.session.add(prop)
                print(f"· property added:   {data['name']}")
            else:
                for k, v in data.items():
                    setattr(prop, k, v)
                print(f"· property updated: {data['name']}")

        # --- blog posts ---
        for data in POSTS:
            post = BlogPost.query.filter_by(slug=data["slug"]).first()
            if not post:
                db.session.add(BlogPost(**data))
                print(f"· post added:      {data['title'][:44]}")
            else:
                for k, v in data.items():
                    setattr(post, k, v)
                print(f"· post updated:    {data['title'][:44]}")

        # --- site sections ---
        for key, label, page, content in SECTIONS:
            section = SiteSection.query.filter_by(key=key).first()
            if not section:
                db.session.add(SiteSection(key=key, label=label, page=page, content=content))
                print(f"· section added:   {key}")
            else:
                section.label, section.page = label, page
                if not section.content:
                    section.content = content
                else:
                    # Merge seed content so updated defaults (e.g. phone numbers) propagate
                    # while preserving any CMS keys that are not present in the seed.
                    section.content = {**section.content, **content}
                    # Remove hero CTA keys that were dropped from the seed so buttons stay off non-home pages.
                    for stale in ("primaryLabel", "primaryHref", "secondaryLabel", "secondaryHref"):
                        section.content.pop(stale, None)
                print(f"· section updated:  {key}")

        db.session.commit()
        print("\nSeed complete.")
        print(f"Login at /admin with: {email}")


if __name__ == "__main__":
    seed(reset="--reset" in sys.argv)
