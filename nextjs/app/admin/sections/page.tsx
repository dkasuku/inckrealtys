"use client";

import { useEffect, useMemo, useState } from "react";
import { Save, Plus, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ImageField, GalleryField } from "@/components/admin/media-picker";
import { cn } from "@/lib/utils";

interface Section {
    id: number; key: string; label: string; page: string;
    content: Record<string, unknown>;
}

const IMAGE_KEY = /(image|avatar|photo|background|logo|icon)/i;
const GALLERY_KEY = /(images|gallery|photos)/i;
const LONG_KEY = /(body|desc|description|message|paragraph|blurb|text|tagline)/i;

const title = (k: string) =>
    k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();

/** Renders the right control for a single field based on its key + value type. */
function Field({
    fieldKey, value, onChange,
}: {
    fieldKey: string;
    value: unknown;
    onChange: (v: unknown) => void;
}) {
    // Image list (gallery / images / photos)
    if (Array.isArray(value) && GALLERY_KEY.test(fieldKey) && value.every((v) => typeof v === "string")) {
        return <GalleryField label={title(fieldKey)} value={value as string[]} onChange={(v) => onChange(v)} />;
    }

    // List of objects -> repeatable cards
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
        const rows = value as Record<string, unknown>[];
        const template = Object.fromEntries(Object.keys(rows[0]).map((k) => [k, typeof rows[0][k] === "number" ? 0 : ""]));
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>{title(fieldKey)}</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => onChange([...rows, template])}>
                        <Plus className="size-4" /> Add item
                    </Button>
                </div>
                <div className="space-y-3">
                    {rows.map((row, i) => (
                        <div key={i} className="rounded-lg border p-4 space-y-3 bg-muted/30">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-medium">Item {i + 1}</span>
                                <Button type="button" variant="ghost" size="icon"
                                    onClick={() => onChange(rows.filter((_, idx) => idx !== i))}>
                                    <Trash2 className="size-4 text-destructive" />
                                </Button>
                            </div>
                            {Object.entries(row).map(([k, v]) => (
                                <Field
                                    key={k}
                                    fieldKey={k}
                                    value={v}
                                    onChange={(nv) => {
                                        const next = [...rows];
                                        next[i] = { ...next[i], [k]: nv };
                                        onChange(next);
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // List of plain strings -> one per line
    if (Array.isArray(value)) {
        return (
            <div className="space-y-2">
                <Label>{title(fieldKey)} <span className="text-muted-foreground font-normal">— one per line</span></Label>
                <Textarea
                    rows={3}
                    value={(value as string[]).join("\n")}
                    onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
                />
            </div>
        );
    }

    // Single image
    if (typeof value === "string" && IMAGE_KEY.test(fieldKey)) {
        return <ImageField label={title(fieldKey)} value={value} onChange={(v) => onChange(v)} />;
    }

    if (typeof value === "number") {
        return (
            <div className="space-y-2">
                <Label>{title(fieldKey)}</Label>
                <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
            </div>
        );
    }

    // Long text
    if (typeof value === "string" && (LONG_KEY.test(fieldKey) || value.length > 90)) {
        return (
            <div className="space-y-2">
                <Label>{title(fieldKey)}</Label>
                <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Label>{title(fieldKey)}</Label>
            <Input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}

function SectionCard({ section, onSaved }: { section: Section; onSaved: () => void }) {
    const [content, setContent] = useState(section.content);
    const [saving, setSaving] = useState(false);
    const [open, setOpen] = useState(false);
    const dirty = JSON.stringify(content) !== JSON.stringify(section.content);

    async function save() {
        setSaving(true);
        try {
            await api(`/api/admin/sections/${section.key}`, {
                method: "PUT",
                body: JSON.stringify({ content }),
            });
            toast.success(`${section.label} saved`);
            onSaved();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Save failed");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Card>
            <CardHeader
                className="flex flex-row items-center justify-between cursor-pointer"
                onClick={() => setOpen((o) => !o)}
            >
                <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{section.label}</CardTitle>
                    <Badge variant="outline" className="font-mono text-[10px]">{section.key}</Badge>
                    {dirty && <Badge variant="gold">unsaved</Badge>}
                </div>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
            </CardHeader>

            {open && (
                <CardContent className="space-y-5">
                    <Separator />
                    {Object.entries(content).map(([k, v]) => (
                        <Field
                            key={k}
                            fieldKey={k}
                            value={v}
                            onChange={(nv) => setContent((c) => ({ ...c, [k]: nv }))}
                        />
                    ))}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setContent(section.content)} disabled={!dirty}>
                            Reset
                        </Button>
                        <Button onClick={save} disabled={saving || !dirty}>
                            <Save className="size-4" /> {saving ? "Saving…" : "Save section"}
                        </Button>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

export default function SectionsPage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [page, setPage] = useState("all");

    async function load() {
        try {
            setSections(await api<Section[]>("/api/admin/sections"));
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load sections");
        }
    }
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => { load(); }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    const pages = useMemo(
        () => ["all", ...Array.from(new Set(sections.map((s) => s.page)))],
        [sections]
    );
    const visible = page === "all" ? sections : sections.filter((s) => s.page === page);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-navy">Site Sections</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Edit the text and images of every section on the site. Changes appear within ~30 seconds.
                    </p>
                </div>
                <Tabs value={page} onValueChange={setPage}>
                    <TabsList>
                        {pages.map((p) => (
                            <TabsTrigger key={p} value={p} className="capitalize">{p}</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            <div className="space-y-3">
                {visible.map((s) => (
                    <SectionCard key={s.key} section={s} onSaved={load} />
                ))}
                {sections.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-10">
                        No sections found. Run <code>python seed.py</code> in the backend.
                    </p>
                )}
            </div>
        </div>
    );
}
