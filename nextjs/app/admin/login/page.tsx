"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back");
            router.replace("/admin");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Brand panel */}
            <div className="hidden lg:flex flex-col justify-between bg-navy p-12 relative overflow-hidden">
                <div className="flex items-center gap-3 relative">
                    <Image src="/logo-special.png" alt="INCK Realty Ltd" width={48} height={48} className="h-12 w-auto object-contain" priority />
                </div>
                <div className="relative">
                    <h1 className="text-4xl text-white font-medium leading-tight max-w-md">
                        Manage your developments, requests and content.
                    </h1>
                    <p className="text-white/60 mt-4 max-w-sm">
                        Building Communities. Creating Opportunities. Shaping Africa&rsquo;s Future.
                    </p>
                </div>
                <span className="pointer-events-none select-none absolute -bottom-10 -right-4 text-[220px] font-semibold leading-none text-white/[0.04]">IR</span>
            </div>

            {/* Form */}
            <div className="flex items-center justify-center p-6 md:p-12">
                <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-navy">Admin sign in</h2>
                        <p className="text-muted-foreground text-sm mt-1.5">Enter your credentials to continue.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required autoComplete="email"
                            placeholder="admin@inckrealty.co.ke"
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required autoComplete="current-password"
                            placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in…" : "Sign in"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
