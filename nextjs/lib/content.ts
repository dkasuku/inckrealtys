import { properties as staticProperties, Property } from "@/data/properties";
import { posts as staticPosts, Post } from "@/data/blog";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Revalidate content from the API every 30s (ISR). Falls back to the bundled
// static data whenever the backend is unavailable, so the public site never breaks.
const REVALIDATE = 30;

type Sections = Record<string, Record<string, unknown>>;

async function safeGet<T>(path: string, fallback: T): Promise<T> {
    try {
        const res = await fetch(`${API_URL}${path}`, {
            next: { revalidate: REVALIDATE },
        });
        if (!res.ok) return fallback;
        return (await res.json()) as T;
    } catch {
        return fallback;
    }
}

/** All editable site content, keyed by section. Empty object if API is down. */
export async function getSections(): Promise<Sections> {
    return safeGet<Sections>("/api/sections", {});
}

/** Content for one section, merged over the component's defaults. */
export async function getSection<T>(key: string, defaults: T): Promise<T> {
    const sections = await getSections();
    const content = sections[key];
    if (!content || Object.keys(content).length === 0) return defaults;
    return { ...defaults, ...(content as object) } as T;
}

export async function getProperties(): Promise<Property[]> {
    return safeGet<Property[]>("/api/properties", staticProperties);
}

export async function getFeaturedProperties(): Promise<Property[]> {
    const all = await getProperties();
    return all.filter((p) => p.featured);
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
    const all = await getProperties();
    return all.find((p) => p.slug === slug);
}

export async function getPosts(): Promise<Post[]> {
    return safeGet<Post[]>("/api/posts", staticPosts);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
    const all = await getPosts();
    return all.find((p) => p.slug === slug);
}
