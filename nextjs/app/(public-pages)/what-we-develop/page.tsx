import type { Metadata } from "next";
import { WhatWeDevelop, whatWeDevelopDefaults, WhatWeDevelopContent } from "@/sections/what-we-develop";
import { getSections } from "@/lib/content";

export const metadata: Metadata = {
    title: "What We Develop — INCK Realty Ltd",
    description: "Explore the residential, commercial and mixed-use developments created by INCK Realty Ltd.",
};

export default async function WhatWeDevelopPage() {
    const sections = await getSections();
    const content = sections.what_we_develop && Object.keys(sections.what_we_develop).length
        ? ({ ...whatWeDevelopDefaults, ...sections.what_we_develop } as WhatWeDevelopContent)
        : whatWeDevelopDefaults;

    return (
        <main className="pt-24 md:pt-32">
            <WhatWeDevelop content={content} />
        </main>
    );
}
