"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";
import {
    LayoutDashboard, Building2, Inbox, ImageIcon, LayoutTemplate, LogOut, ExternalLink, Newspaper,
} from "lucide-react";
import { clearToken, getToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/properties", label: "Properties", icon: Building2 },
    { href: "/admin/enquiries", label: "Requests", icon: Inbox },
    { href: "/admin/blog", label: "Blog", icon: Newspaper },
    { href: "/admin/media", label: "Media", icon: ImageIcon },
    { href: "/admin/sections", label: "Site Sections", icon: LayoutTemplate },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLogin = pathname === "/admin/login";
    const [ready, setReady] = useState(false);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (isLogin) {
            setReady(true);
            return;
        }
        if (!getToken()) {
            router.replace("/admin/login");
            return;
        }
        setReady(true);
    }, [isLogin, pathname, router]);
    /* eslint-enable react-hooks/set-state-in-effect */

    if (isLogin) {
        return (
            <>
                {children}
                <Toaster richColors position="top-right" />
            </>
        );
    }

    if (!ready) {
        return <div className="min-h-screen grid place-items-center text-muted-foreground text-sm">Loading…</div>;
    }

    return (
        <div className="min-h-screen flex bg-muted/40">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 bg-navy text-white flex-col hidden md:flex">
                <div className="p-6 flex items-center gap-2.5">
                    <Image src="/logo-special.png" alt="INCK Realty Ltd" width={36} height={36} className="h-9 w-auto object-contain" priority />
                    <div className="leading-none">
                        <p className="font-semibold tracking-wide text-sm">INCK <span className="text-gold">REALTY</span></p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 mt-1">Admin</p>
                    </div>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {nav.map((item) => {
                        const Icon = item.icon;
                        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                    active ? "bg-gold text-navy font-medium" : "text-white/70 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <Icon className="size-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 space-y-1 border-t border-white/10">
                    <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                        <ExternalLink className="size-4" /> View site
                    </Link>
                    <button
                        onClick={() => { clearToken(); router.replace("/admin/login"); }}
                        className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                        <LogOut className="size-4" /> Sign out
                    </button>
                </div>
            </aside>

            <div className="flex-1 min-w-0">
                <main className="p-5 md:p-8 max-w-7xl">{children}</main>
            </div>

            <Toaster richColors position="top-right" />
        </div>
    );
}
