"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Upload, X, Check } from "lucide-react";
import { toast } from "sonner";
import { api, API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface MediaAsset {
    id: number; url: string; filename: string; originalName: string; alt: string;
}

/** Uploaded (/uploads/…), public (/assets/…) and remote (https://…) all resolve as-is. */
export function preview(src: string) {
    return src || "";
}

export function MediaLibrary({
    onSelect,
    selectedUrl,
}: {
    onSelect?: (asset: MediaAsset) => void;
    selectedUrl?: string;
}) {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [uploading, setUploading] = useState(false);

    async function load() {
        try {
            setAssets(await api<MediaAsset[]>("/api/admin/media"));
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not load media");
        }
    }
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => { load(); }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    async function upload(files: FileList | null) {
        if (!files?.length) return;
        setUploading(true);
        try {
            for (const file of Array.from(files)) {
                const fd = new FormData();
                fd.append("file", file);
                await api<MediaAsset>("/api/admin/media", { method: "POST", body: fd });
            }
            toast.success(`Uploaded ${files.length} image${files.length > 1 ? "s" : ""}`);
            await load();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    }

    async function remove(id: number) {
        try {
            await api(`/api/admin/media/${id}`, { method: "DELETE" });
            setAssets((a) => a.filter((x) => x.id !== id));
            toast.success("Image deleted");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Delete failed");
        }
    }

    return (
        <div className="space-y-4">
            <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 cursor-pointer hover:border-gold transition-colors">
                <Upload className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    {uploading ? "Uploading…" : "Click to upload images (PNG, JPG, WEBP, SVG)"}
                </span>
                <input type="file" accept="image/*" multiple hidden
                    onChange={(e) => upload(e.target.files)} disabled={uploading} />
            </label>

            {assets.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No images uploaded yet.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto">
                    {assets.map((asset) => {
                        const isSelected = selectedUrl === asset.url;
                        return (
                            <div key={asset.id}
                                className={cn(
                                    "group relative rounded-lg overflow-hidden border bg-muted aspect-[4/3]",
                                    onSelect && "cursor-pointer hover:border-gold",
                                    isSelected && "border-gold ring-2 ring-gold"
                                )}
                                onClick={() => onSelect?.(asset)}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={preview(asset.url)} alt={asset.alt || asset.originalName}
                                    className="w-full h-full object-cover" />
                                {isSelected && (
                                    <span className="absolute top-1.5 left-1.5 bg-gold text-navy rounded-full p-1">
                                        <Check className="size-3" />
                                    </span>
                                )}
                                <button type="button"
                                    onClick={(e) => { e.stopPropagation(); remove(asset.id); }}
                                    className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-destructive"
                                >
                                    <X className="size-3" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            <p className="text-xs text-muted-foreground">
                Uploads save to <code>public/uploads</code> and serve at <code>/uploads/…</code> · API: {API_URL}
            </p>
        </div>
    );
}

/** Single-image field: preview + pick/upload from the library, or paste a URL. */
export function ImageField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (url: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex gap-3 items-start">
                <div className="size-20 shrink-0 rounded-lg border bg-muted overflow-hidden grid place-items-center">
                    {value ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview(value)} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="size-5 text-muted-foreground" />
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <Input value={value} onChange={(e) => onChange(e.target.value)}
                        placeholder="/uploads/… or https://…" />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="sm">
                                <ImageIcon className="size-4" /> Choose from library
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader><DialogTitle>Media library</DialogTitle></DialogHeader>
                            <MediaLibrary
                                selectedUrl={value}
                                onSelect={(asset) => { onChange(asset.url); setOpen(false); }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

/** Multi-image field (galleries): list of images with add/remove. */
export function GalleryField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string[];
    onChange: (urls: string[]) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex flex-wrap gap-2">
                {value.map((url, i) => (
                    <div key={`${url}-${i}`} className="relative size-20 rounded-lg border overflow-hidden group bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview(url)} alt="" className="w-full h-full object-cover" />
                        <button type="button"
                            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-destructive"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                ))}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button type="button" className="size-20 rounded-lg border-2 border-dashed grid place-items-center text-muted-foreground hover:border-gold cursor-pointer">
                            <ImageIcon className="size-5" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader><DialogTitle>Add image to gallery</DialogTitle></DialogHeader>
                        <MediaLibrary onSelect={(asset) => { onChange([...value, asset.url]); setOpen(false); }} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
