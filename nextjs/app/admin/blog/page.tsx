"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImageField, preview } from "@/components/admin/media-picker";

const CATEGORIES = ["Market Insight", "Buying Guide", "Design", "Sustainability", "Investment", "News"];

type Block = { type: string; text?: string; src?: string; caption?: string };

interface Post {
    id: number; slug: string; title: string; excerpt: string; category: string;
    author: string; readTime: string; coverImage: string;
    published: boolean; featured: boolean; tags: string[]; body: Block[];
    publishedAt: string | null;
}

const empty: Partial<Post> = {
    title: "", excerpt: "", category: "Market Insight", author: "INCK Realty",
    readTime: "5 min read", coverImage: "", published: true, featured: false,
    tags: [], body: [],
};

/**
 * The article body is edited as plain text. Prefix a line with "## " for a
 * heading, "> " for a pull-quote, or "!image-url | caption" for an image.
 */
function bodyToText(body: Block[] = []): string {
    return body
        .map((b) => {
            if (b.type === "heading") return `## ${b.text ?? ""}`;
            if (b.type === "quote") return `> ${b.text ?? ""}`;
            if (b.type === "image") return `!${b.src ?? ""}${b.caption ? ` | ${b.caption}` : ""}`;
            return b.text ?? "";
        })
        .join("\n\n");
}

function textToBody(text: string): Block[] {
    return text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
            if (line.startsWith("## ")) return { type: "heading", text: line.slice(3).trim() };
            if (line.startsWith("> ")) return { type: "quote", text: line.slice(2).trim() };
            if (line.startsWith("!")) {
                const [src, caption] = line.slice(1).split("|");
                return { type: "image", src: src.trim(), caption: (caption || "").trim() };
            }
            return { type: "paragraph", text: line };
        });
}

export default function BlogAdminPage() {
    const [items, setItems] = useState<Post[]>([]);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<Partial<Post>>(empty);
    const [bodyText, setBodyText] = useState("");

    async function load() {
        try {
            setItems(await api<Post[]>("/api/admin/posts"));
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load posts");
        }
    }
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => { load(); }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    const set = <K extends keyof Post>(k: K, v: Post[K]) => setForm((f) => ({ ...f, [k]: v }));

    function openNew() { setForm(empty); setBodyText(""); setOpen(true); }
    function openEdit(p: Post) { setForm(p); setBodyText(bodyToText(p.body)); setOpen(true); }

    async function save() {
        if (!form.title?.trim()) { toast.error("Title is required"); return; }
        setSaving(true);
        try {
            const payload = { ...form, body: textToBody(bodyText) };
            if (form.id) {
                await api(`/api/admin/posts/${form.id}`, { method: "PUT", body: JSON.stringify(payload) });
                toast.success("Article updated");
            } else {
                await api("/api/admin/posts", { method: "POST", body: JSON.stringify(payload) });
                toast.success("Article created");
            }
            setOpen(false);
            await load();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Save failed");
        } finally {
            setSaving(false);
        }
    }

    async function remove(p: Post) {
        if (!confirm(`Delete "${p.title}"?`)) return;
        try {
            await api(`/api/admin/posts/${p.id}`, { method: "DELETE" });
            toast.success("Article deleted");
            await load();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Delete failed");
        }
    }

    const fmt = (d: string | null) =>
        d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-navy">Blog</h1>
                    <p className="text-muted-foreground text-sm mt-1">{items.length} article{items.length === 1 ? "" : "s"}</p>
                </div>
                <Button onClick={openNew}><Plus className="size-4" /> New article</Button>
            </div>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Article</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Published</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-11 rounded-md border bg-muted overflow-hidden shrink-0">
                                                {p.coverImage && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={preview(p.coverImage)} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="min-w-0 max-w-md">
                                                <p className="font-medium text-navy flex items-center gap-1.5 truncate">
                                                    {p.title}
                                                    {p.featured && <Star className="size-3.5 fill-gold text-gold shrink-0" />}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">{p.readTime} · {p.author}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{p.category}</TableCell>
                                    <TableCell className="text-muted-foreground">{fmt(p.publishedAt)}</TableCell>
                                    <TableCell>
                                        <Badge variant={p.published ? "success" : "outline"}>
                                            {p.published ? "Published" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild>
                                                <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer"><ExternalLink className="size-4" /></a>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="size-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => remove(p)}><Trash2 className="size-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                                        No articles yet. Write your first one.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{form.id ? "Edit article" : "New article"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input value={form.title || ""} onChange={(e) => set("title", e.target.value)}
                                placeholder="Kenya's Affordable Housing Push" />
                        </div>

                        <div className="space-y-2">
                            <Label>Excerpt — shown on the blog cards</Label>
                            <Textarea rows={2} value={form.excerpt || ""} onChange={(e) => set("excerpt", e.target.value)} />
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Author</Label>
                                <Input value={form.author || ""} onChange={(e) => set("author", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Read time</Label>
                                <Input value={form.readTime || ""} onChange={(e) => set("readTime", e.target.value)} placeholder="5 min read" />
                            </div>
                        </div>

                        <ImageField label="Cover image" value={form.coverImage || ""} onChange={(v) => set("coverImage", v)} />

                        <div className="space-y-2">
                            <Label>Tags <span className="text-muted-foreground font-normal">— comma separated</span></Label>
                            <Input value={(form.tags || []).join(", ")}
                                onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                                placeholder="Investment, Kenya, Off-plan" />
                        </div>

                        <div className="space-y-2">
                            <Label>Article body</Label>
                            <p className="text-xs text-muted-foreground">
                                One block per line. Start a line with <code>## </code> for a heading,
                                <code> &gt; </code> for a pull-quote, or <code>!image-url | caption</code> for an image.
                                Everything else becomes a paragraph.
                            </p>
                            <Textarea rows={14} value={bodyText} onChange={(e) => setBodyText(e.target.value)}
                                placeholder={"Opening paragraph…\n\n## A heading\n\nAnother paragraph.\n\n> A pull quote worth remembering.\n\n!https://images.unsplash.com/photo-123 | Caption here"} />
                        </div>

                        <div className="flex items-center gap-8 pt-2">
                            <div className="flex items-center gap-2.5">
                                <Switch checked={!!form.featured} onCheckedChange={(v) => set("featured", v)} />
                                <Label>Featured on blog</Label>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Switch checked={!!form.published} onCheckedChange={(v) => set("published", v)} />
                                <Label>Published</Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save article"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
