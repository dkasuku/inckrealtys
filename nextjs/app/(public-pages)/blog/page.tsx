import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { HeroSection } from "@/sections/hero-sections";
import { formatDate } from "@/data/blog";
import { getPosts, getSection } from "@/lib/content";

export const metadata: Metadata = {
    title: "Insights & Blog — INCK Realty Ltd",
    description:
        "Market insight, buying guides and design thinking from INCK Realty — building homes and communities across Kenya and Africa.",
};

export const revalidate = 30;

const heroDefaults = {
    eyebrow: "INSIGHTS",
    headingLead: "Notes on Building",
    headingAccent: "Africa's Future",
    body: "Market insight, buying guides and the thinking behind how we design and deliver communities across Kenya.",
    backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
};

export default async function BlogPage() {
    const [posts, hero] = await Promise.all([getPosts(), getSection("blog_hero", heroDefaults)]);

    const featured = posts.find((p) => p.featured) ?? posts[0];
    const rest = posts.filter((p) => p.slug !== featured?.slug);

    return (
        <main>
            {/* Hero */}
            <HeroSection content={hero} variant="compact" align="center" />

            <section className="px-4 md:px-16 lg:px-24 xl:px-32 py-16 md:py-20">
                <div className="max-w-7xl mx-auto">
                    {/* Featured post */}
                    {featured && (
                        <Link href={`/blog/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 md:mb-20">
                            <div className="relative h-[280px] md:h-[420px] rounded-2xl overflow-hidden">
                                <Image src={featured.coverImage} alt={featured.title} fill sizes="(max-width:1024px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                <span className="absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full bg-gold text-navy">
                                    Featured
                                </span>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-xs text-charcoal/60">
                                    <span className="text-gold-dark font-medium">{featured.category}</span>
                                    <span className="flex items-center gap-1"><Calendar className="size-3.5" /> {formatDate(featured.publishedAt)}</span>
                                    <span className="flex items-center gap-1"><Clock className="size-3.5" /> {featured.readTime}</span>
                                </div>
                                <h2 className="text-3xl md:text-[40px]/12 text-navy font-medium mt-4 group-hover:text-navy-light transition-colors">
                                    {featured.title}
                                </h2>
                                <p className="text-charcoal/70 mt-4 leading-relaxed">{featured.excerpt}</p>
                                <span className="inline-flex items-center gap-1.5 text-navy font-medium mt-6 group-hover:text-gold-dark transition-colors">
                                    Read article
                                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rest.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`}
                                className="group flex flex-col bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:shadow-[0_18px_50px_rgba(15,45,82,0.10)] hover:border-gold/40 transition-all duration-300"
                            >
                                <div className="relative h-52 overflow-hidden">
                                    <Image src={post.coverImage} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <span className="absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full bg-white/90 backdrop-blur text-navy">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="flex flex-col flex-1 p-6">
                                    <div className="flex items-center gap-3 text-xs text-charcoal/55">
                                        <span>{formatDate(post.publishedAt)}</span>
                                        <span className="flex items-center gap-1"><Clock className="size-3.5" /> {post.readTime}</span>
                                    </div>
                                    <h3 className="text-navy text-lg font-medium mt-3 leading-snug">{post.title}</h3>
                                    <p className="text-charcoal/65 text-sm mt-2.5 leading-relaxed flex-1">{post.excerpt}</p>
                                    <span className="inline-flex items-center gap-1.5 text-navy text-sm font-medium mt-5 group-hover:text-gold-dark transition-colors">
                                        Read article
                                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <p className="text-center text-charcoal/60 py-20">No articles published yet.</p>
                    )}
                </div>
            </section>
        </main>
    );
}
