"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, Phone, Building2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Enquiry {
    id: number; name: string; email: string; phone: string; subject: string; message: string;
    propertyName: string | null; propertySlug: string; status: string; createdAt: string;
}

const variant: Record<string, "gold" | "secondary" | "success"> = {
    new: "gold", contacted: "secondary", closed: "success",
};

export default function EnquiriesPage() {
    const [items, setItems] = useState<Enquiry[]>([]);
    const [filter, setFilter] = useState("all");
    const [active, setActive] = useState<Enquiry | null>(null);

    async function load(status = filter) {
        try {
            const q = status === "all" ? "" : `?status=${status}`;
            setItems(await api<Enquiry[]>(`/api/admin/enquiries${q}`));
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load");
        }
    }
    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    useEffect(() => { load(filter); }, [filter]);
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

    async function setStatus(e: Enquiry, status: string) {
        try {
            await api(`/api/admin/enquiries/${e.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
            toast.success(`Marked as ${status}`);
            await load();
            setActive((a) => (a && a.id === e.id ? { ...a, status } : a));
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Update failed");
        }
    }

    async function remove(e: Enquiry) {
        if (!confirm(`Delete request from ${e.name}?`)) return;
        try {
            await api(`/api/admin/enquiries/${e.id}`, { method: "DELETE" });
            toast.success("Request deleted");
            await load();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Delete failed");
        }
    }

    const fmt = (d: string) => new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-navy">Requests</h1>
                    <p className="text-muted-foreground text-sm mt-1">Enquiries submitted from the website.</p>
                </div>
                <Tabs value={filter} onValueChange={setFilter}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="new">New</TabsTrigger>
                        <TabsTrigger value="contacted">Contacted</TabsTrigger>
                        <TabsTrigger value="closed">Closed</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>From</TableHead>
                                <TableHead>Interest</TableHead>
                                <TableHead>Received</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((e) => (
                                <TableRow key={e.id} className="cursor-pointer" onClick={() => setActive(e)}>
                                    <TableCell>
                                        <p className="font-medium text-navy">{e.name}</p>
                                        <p className="text-xs text-muted-foreground">{e.email}</p>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {e.propertyName || e.subject || "General enquiry"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{fmt(e.createdAt)}</TableCell>
                                    <TableCell><Badge variant={variant[e.status] ?? "secondary"}>{e.status}</Badge></TableCell>
                                    <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-2">
                                            <Select value={e.status} onValueChange={(v) => setStatus(e, v)}>
                                                <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="new">New</SelectItem>
                                                    <SelectItem value="contacted">Contacted</SelectItem>
                                                    <SelectItem value="closed">Closed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button variant="ghost" size="icon" onClick={() => remove(e)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                                        No requests {filter !== "all" && `with status "${filter}"`} yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detail dialog */}
            <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
                <DialogContent>
                    {active && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    {active.name}
                                    <Badge variant={variant[active.status] ?? "secondary"}>{active.status}</Badge>
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="size-4 text-gold" />
                                    <a href={`mailto:${active.email}`} className="hover:text-navy underline-offset-2 hover:underline">{active.email}</a>
                                </div>
                                {active.phone && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="size-4 text-gold" />
                                        <a href={`tel:${active.phone}`} className="hover:text-navy">{active.phone}</a>
                                    </div>
                                )}
                                {active.propertyName && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="size-4 text-gold" /> {active.propertyName}
                                    </div>
                                )}
                                {active.subject && (
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Subject</p>
                                        <p className="text-navy mt-1">{active.subject}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Message</p>
                                    <p className="text-charcoal/80 mt-1 whitespace-pre-wrap leading-relaxed">{active.message}</p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button size="sm" variant="outline" onClick={() => setStatus(active, "contacted")}>Mark contacted</Button>
                                    <Button size="sm" variant="outline" onClick={() => setStatus(active, "closed")}>Mark closed</Button>
                                    <Button size="sm" asChild><a href={`mailto:${active.email}`}>Reply by email</a></Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
