"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Inbox, ImageIcon, Star, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Enquiry {
    id: number; name: string; email: string; subject: string;
    propertyName: string | null; status: string; createdAt: string;
}
interface Stats {
    properties: number; published: number; featured: number;
    enquiries: number; newEnquiries: number; media: number;
    recentEnquiries: Enquiry[];
}

const statusVariant: Record<string, "gold" | "success" | "secondary"> = {
    new: "gold", contacted: "secondary", closed: "success",
};

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api<Stats>("/api/admin/stats")
            .then(setStats)
            .catch((e) => setError(e.message));
    }, []);

    if (error) {
        return (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <p className="text-destructive font-medium">Could not reach the API</p>
                <p className="text-muted-foreground text-sm mt-1">{error}</p>
                <p className="text-muted-foreground text-sm mt-3">Make sure the Flask backend is running on port 5000.</p>
            </div>
        );
    }

    const cards = [
        { label: "Properties", value: stats?.properties, sub: `${stats?.published ?? 0} published`, icon: Building2, href: "/admin/properties" },
        { label: "Featured", value: stats?.featured, sub: "on the homepage", icon: Star, href: "/admin/properties" },
        { label: "Requests", value: stats?.enquiries, sub: `${stats?.newEnquiries ?? 0} new`, icon: Inbox, href: "/admin/enquiries" },
        { label: "Media", value: stats?.media, sub: "uploaded images", icon: ImageIcon, href: "/admin/media" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-navy">Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-1">Overview of your developments and enquiries.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <Link key={c.label} href={c.href}>
                            <Card className="hover:border-gold transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between pb-0">
                                    <CardTitle className="text-sm text-muted-foreground font-medium">{c.label}</CardTitle>
                                    <Icon className="size-4 text-gold" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-semibold text-navy">{c.value ?? "—"}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent requests</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/enquiries">View all <ArrowRight className="size-4" /></Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {stats && stats.recentEnquiries.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Interest</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.recentEnquiries.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell className="font-medium text-navy">{e.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{e.email}</TableCell>
                                        <TableCell className="text-muted-foreground">{e.propertyName || e.subject || "—"}</TableCell>
                                        <TableCell><Badge variant={statusVariant[e.status] ?? "secondary"}>{e.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-sm py-6 text-center">No requests yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
