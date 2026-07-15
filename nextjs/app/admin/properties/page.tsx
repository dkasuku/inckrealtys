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
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImageField, GalleryField, preview } from "@/components/admin/media-picker";

const TYPES = ["Gated Estate", "Apartments", "Bungalows", "Maisonettes", "Luxury Villas", "Mixed-Use", "Holiday Homes"];
const STATUSES = ["Selling", "Ready", "Off-Plan", "Coming Soon"];

interface Property {
    id: number; slug: string; name: string; tagline: string; type: string; status: string;
    location: string; priceFrom: number | null; beds: string; baths: string; size: string; plot: string;
    featured: boolean; published: boolean; shortDesc: string;
    description: string[]; highlights: string[]; amenities: string[];
    heroImage: string; cardImage: string; gallery: string[];
}

const empty: Partial<Property> = {
    name: "", tagline: "", type: "Apartments", status: "Selling", location: "",
    priceFrom: null, beds: "", baths: "", size: "", plot: "", featured: false, published: true,
    shortDesc: "", description: [], highlights: [], amenities: [],
    heroImage: "", cardImage: "", gallery: [],
};

const kes = (v: number | null) =>
    v === null ? "On request" : `KES ${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;

export default function PropertiesAdminPage() {
    const [items, setItems] = useState<Property[]>([]);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<Partial<Property>>(empty);

    async function load() {
        try {
            setItems(await api<Property[]>("/api/admin/properties"));
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load");
        }
    }
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => { load(); }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    const set = <K extends keyof Property>(k: K, v: Property[K]) =>
        setForm((f) => ({ ...f, [k]: v }));

    function openNew() { setForm(empty); setOpen(true); }
    function openEdit(p: Property) { setForm(p); setOpen(true); }

    async function save() {
        if (!form.name?.trim()) { toast.error("Name is required"); return; }
        setSaving(true);
        try {
            const body = JSON.stringify(form);
            if (form.id) {
                await api(`/api/admin/properties/${form.id}`, { method: "PUT", body });
                toast.success("Property updated");
            } else {
                await api("/api/admin/properties", { method: "POST", body });
                toast.success("Property created");
            }
            setOpen(false);
            await load();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Save failed");
        } finally {
            setSaving(false);
        }
    }

    async function remove(p: Property) {
        if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
        try {
            await api(`/api/admin/properties/${p.id}`, { method: "DELETE" });
            toast.success("Property deleted");
            await load();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Delete failed");
        }
    }

    // textarea <-> string[] helpers
    const lines = (v?: string[]) => (v || []).join("\n");
    const toLines = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-navy">Properties</h1>
                    <p className="text-muted-foreground text-sm mt-1">{items.length} development{items.length === 1 ? "" : "s"}</p>
                </div>
                <Button onClick={openNew}><Plus className="size-4" /> New property</Button>
            </div>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>Visibility</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="size-11 rounded-md border bg-muted overflow-hidden shrink-0">
                                                {p.cardImage && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={preview(p.cardImage)} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-navy flex items-center gap-1.5">
                                                    {p.name}
                                                    {p.featured && <Star className="size-3.5 fill-gold text-gold" />}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">{p.location}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{p.type}</TableCell>
                                    <TableCell><Badge variant="secondary">{p.status}</Badge></TableCell>
                                    <TableCell className="text-navy">{kes(p.priceFrom)}</TableCell>
                                    <TableCell>
                                        <Badge variant={p.published ? "success" : "outline"}>
                                            {p.published ? "Published" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild>
                                                <a href={`/properties/${p.slug}`} target="_blank" rel="noreferrer"><ExternalLink className="size-4" /></a>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="size-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => remove(p)}><Trash2 className="size-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                                        No properties yet. Create your first development.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create / edit dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{form.id ? `Edit ${form.name}` : "New property"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name *</Label>
                                <Input value={form.name || ""} onChange={(e) => set("name", e.target.value)} placeholder="Savannah Ridge Estate" />
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input value={form.location || ""} onChange={(e) => set("location", e.target.value)} placeholder="Kiambu, Kenya" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Tagline</Label>
                            <Input value={form.tagline || ""} onChange={(e) => set("tagline", e.target.value)} placeholder="Modern gated living on the edge of the city" />
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={form.type} onValueChange={(v) => set("type", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Price from (KES)</Label>
                                <Input type="number" value={form.priceFrom ?? ""} placeholder="Blank = on request"
                                    onChange={(e) => set("priceFrom", e.target.value === "" ? null : Number(e.target.value))} />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-4 gap-4">
                            <div className="space-y-2"><Label>Beds</Label><Input value={form.beds || ""} onChange={(e) => set("beds", e.target.value)} placeholder="3 & 4 Bedroom" /></div>
                            <div className="space-y-2"><Label>Baths</Label><Input value={form.baths || ""} onChange={(e) => set("baths", e.target.value)} placeholder="2 - 4 Bath" /></div>
                            <div className="space-y-2"><Label>Size</Label><Input value={form.size || ""} onChange={(e) => set("size", e.target.value)} placeholder="148 - 210 m²" /></div>
                            <div className="space-y-2"><Label>Plot</Label><Input value={form.plot || ""} onChange={(e) => set("plot", e.target.value)} placeholder="1/8 acre" /></div>
                        </div>

                        <div className="space-y-2">
                            <Label>Short description (card)</Label>
                            <Textarea rows={2} value={form.shortDesc || ""} onChange={(e) => set("shortDesc", e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Description — one paragraph per line</Label>
                            <Textarea rows={4} value={lines(form.description)} onChange={(e) => set("description", toLines(e.target.value))} />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Highlights — one per line</Label>
                                <Textarea rows={4} value={lines(form.highlights)} onChange={(e) => set("highlights", toLines(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Amenities — one per line</Label>
                                <Textarea rows={4} value={lines(form.amenities)} onChange={(e) => set("amenities", toLines(e.target.value))} />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <ImageField label="Hero image" value={form.heroImage || ""} onChange={(v) => set("heroImage", v)} />
                            <ImageField label="Card image" value={form.cardImage || ""} onChange={(v) => set("cardImage", v)} />
                        </div>

                        <GalleryField label="Gallery" value={form.gallery || []} onChange={(v) => set("gallery", v)} />

                        <div className="flex items-center gap-8 pt-2">
                            <div className="flex items-center gap-2.5">
                                <Switch checked={!!form.featured} onCheckedChange={(v) => set("featured", v)} />
                                <Label>Featured on homepage</Label>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Switch checked={!!form.published} onCheckedChange={(v) => set("published", v)} />
                                <Label>Published</Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save property"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
