import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, Calendar, User } from "lucide-react";
import { Block, formatDate } from "@/data/blog";
import { getPosts, getPostBySlug } from "@/lib/content";

export const dynamicParams = true;
export const revalidate = 30;

export async function generateStaticParams() {
    const posts = await getPosts();
    return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Article not found — INCK Realty Ltd" };
    return {
        title: `${post.title} | INCK Realty Ltd`,
        description: post.excerpt,
    };
}

function Content({ block, index }: { block: Block; index: number }) {
    switch (block.type) {
        case "heading":
            return <h2 className="text-2xl md:text-3xl text-navy font-medium mt-12 mb-4">{block.text}</h2>;
        case "quote":
            return (
                <blockquote className="my-10 border-l-4 border-gold pl-6 py-1">
                    <p className="text-xl md:text-2xl text-navy font-medium leading-relaxed italic">
                        &ldquo;{block.text}&rdquo;
                    </p>
                </blockquote>
            );
        case "image":
            return (
                <figure className="my-10">
                    <div className="relative h-[280px] md:h-[440px] rounded-2xl overflow-hidden">
                        <Image src={block.src || ""} alt={block.caption || ""} fill sizes="(max-width:768px) 100vw, 800px" className="object-cover" />
                    </div>
                    {block.caption && (
                        <figcaption className="text-center text-charcoal/55 text-sm mt-3">{block.caption}</figcaption>
                    )}
                </figure>
            );
        default:
            return (
                <p key={index} className="text-charcoal/80 leading-[1.85] text-[17px] mt-5">
                    {block.text}
                </p>
            );
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) notFound();

    const all = await getPosts();
    const more = all.filter((p) => p.slug !== post.slug).slice(0, 3);

    return (
        <main>
            {/* Cover */}
            <section className="relative h-[58vh] min-h-[400px] w-full overflow-hidden">
                <Image src={post.coverImage} alt={post.title} fill priority sizes="100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/92 via-navy/45 to-navy/25" />
                <div className="absolute inset-x-0 bottom-0 px-4 md:px-16 lg:px-24 xl:px-32 pb-12">
                    <div className="max-w-3xl mx-auto">
                        <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/70 hover:text-gold text-sm transition-colors mb-5">
                            <ArrowLeft className="size-4" /> All insights
                        </Link>
                        <span className="block text-gold text-sm font-medium mb-3">{post.category}</span>
                        <h1 className="text-3xl md:text-5xl text-white font-medium leading-tight">{post.title}</h1>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-white/75 text-sm">
                            <span className="flex items-center gap-1.5"><User className="size-4 text-gold" /> {post.author}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="size-4 text-gold" /> {formatDate(post.publishedAt)}</span>
                            <span className="flex items-center gap-1.5"><Clock className="size-4 text-gold" /> {post.readTime}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article body */}
            <article className="px-4 md:px-16 lg:px-24 xl:px-32 py-14 md:py-20">
                <div className="max-w-3xl mx-auto">
                    <p className="text-xl md:text-[22px] text-navy leading-relaxed font-medium border-b border-zinc-100 pb-8">
                        {post.excerpt}
                    </p>

                    {post.body.map((block, i) => (
                        <Content key={i} block={block} index={i} />
                    ))}

                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-14 pt-8 border-t border-zinc-100">
                            {post.tags.map((tag) => (
                                <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-cream text-navy border border-zinc-100">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* CTA */}
                    <div className="mt-14 bg-navy rounded-2xl p-8 md:p-10 relative overflow-hidden">
                        <span className="pointer-events-none select-none absolute -bottom-6 right-2 text-[120px] font-semibold leading-none text-white/[0.04]">IR</span>
                        <div className="relative">
                            <h3 className="text-2xl text-white font-medium">Looking for your next home?</h3>
                            <p className="text-white/70 text-sm mt-2 max-w-md">
                                Explore our developments across Kenya — from affordable communities to premium residences.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-6">
                                <Link href="/properties" className="bg-gold hover:bg-gold-dark text-navy font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                                    Browse developments
                                </Link>
                                <Link href="/contact" className="border border-white/25 hover:border-gold text-white px-5 py-2.5 rounded-lg text-sm transition-colors">
                                    Talk to our team
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* More reading */}
            {more.length > 0 && (
                <section className="px-4 md:px-16 lg:px-24 xl:px-32 pb-20 bg-cream pt-16">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl md:text-3xl text-navy font-medium">More insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {more.map((p) => (
                                <Link key={p.slug} href={`/blog/${p.slug}`}
                                    className="group flex flex-col bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:border-gold/40 transition-all duration-300"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <Image src={p.coverImage} alt={p.title} fill sizes="33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <span className="text-xs text-gold-dark font-medium">{p.category}</span>
                                        <h3 className="text-navy font-medium mt-2 leading-snug flex-1">{p.title}</h3>
                                        <span className="inline-flex items-center gap-1.5 text-navy text-sm font-medium mt-4 group-hover:text-gold-dark transition-colors">
                                            Read <ArrowUpRight className="size-4" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
