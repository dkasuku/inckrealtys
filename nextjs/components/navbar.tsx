"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    children?: { label: string; href: string; desc: string }[];
}

const navLinks: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Developments", href: "/properties" },
    {
        label: "About",
        href: "/about",
        children: [
            { label: "About Us", href: "/about", desc: "Who we are, our vision, mission and values" },
            { label: "Blog", href: "/blog", desc: "Market insight, buying guides and design thinking" },
        ],
    },
    { label: "Contact", href: "/contact" },
];

function Wordmark({ scrolled }: { scrolled: boolean }) {
    return (
        <Link href="/" className="select-none flex items-center">
            <Image
                src={scrolled ? "/logo-onwhite.png" : "/logo-special.png"}
                alt="INCK Realty Ltd"
                width={144}
                height={40}
                className="h-10 w-auto object-contain"
                priority
            />
        </Link>
    );
}

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const open = (label: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpenMenu(label);
    };
    const scheduleClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
    };

    const linkClass = scrolled ? "text-navy hover:text-gold" : "text-white hover:text-gold";

    return (
        <>
            <nav className={`fixed z-50 flex items-center justify-between left-1/2 -translate-x-1/2 transition-all duration-500 p-4 ${scrolled ? "md:w-5xl w-[calc(100vw-14px)] bg-white/80 backdrop-blur-2xl rounded-full mt-4 pl-6 shadow" : "md:px-16 lg:px-24 xl:px-32 w-full"}`}>
                <Wordmark scrolled={scrolled} />

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-6 md:gap-10 text-sm">
                    {navLinks.map((link) =>
                        link.children ? (
                            <div
                                key={link.label}
                                className="relative"
                                onMouseEnter={() => open(link.label)}
                                onMouseLeave={scheduleClose}
                            >
                                <button
                                    onClick={() => setOpenMenu(openMenu === link.label ? null : link.label)}
                                    className={`flex items-center gap-1 transition-colors duration-500 cursor-pointer ${linkClass}`}
                                >
                                    {link.label}
                                    <ChevronDown className={`size-3.5 transition-transform duration-200 ${openMenu === link.label ? "rotate-180" : ""}`} />
                                </button>

                                {/* Dropdown */}
                                <div
                                    className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-200 ${
                                        openMenu === link.label
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-1 pointer-events-none"
                                    }`}
                                >
                                    <div className="w-72 bg-white rounded-xl shadow-[0_18px_50px_rgba(15,45,82,0.16)] border border-zinc-100 p-2">
                                        {link.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                onClick={() => setOpenMenu(null)}
                                                className="block rounded-lg px-3 py-2.5 hover:bg-cream transition-colors group"
                                            >
                                                <span className="block text-navy font-medium text-sm group-hover:text-gold-dark transition-colors">
                                                    {child.label}
                                                </span>
                                                <span className="block text-charcoal/60 text-xs mt-0.5 leading-snug">
                                                    {child.desc}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link key={link.href} href={link.href} className={`transition-colors duration-500 ${linkClass}`}>
                                {link.label}
                            </Link>
                        )
                    )}
                </div>

                <Link href="/contact" className={`hidden md:block px-6 py-2.5 text-sm font-medium cursor-pointer transition-all duration-500 ${scrolled ? "bg-navy text-white hover:bg-navy-light rounded-full" : "bg-gold text-navy hover:bg-gold-dark rounded-[6px]"}`}>
                    Get in Touch
                </Link>

                <button onClick={() => setMobileOpen(true)} className={`md:hidden p-2 rounded-md aspect-square font-medium transition cursor-pointer ${scrolled ? "text-navy" : "text-white"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12h16" /><path d="M4 18h16" /><path d="M4 6h16" />
                    </svg>
                </button>
            </nav>

            {/* Mobile menu */}
            <div className={`${mobileOpen ? "max-md:w-full" : "max-md:w-0"} md:hidden max-md:fixed max-md:top-0 max-md:z-50 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-full max-md:bg-navy/97 max-md:backdrop-blur max-md:flex-col max-md:justify-center flex items-center gap-6 text-sm`}>
                {navLinks.map((link) =>
                    link.children ? (
                        <div key={link.label} className="flex flex-col items-center gap-4">
                            <button
                                onClick={() => setMobileAboutOpen((o) => !o)}
                                className="flex items-center gap-1.5 text-white hover:text-gold transition-colors cursor-pointer"
                            >
                                {link.label}
                                <ChevronDown className={`size-4 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
                            </button>
                            {mobileAboutOpen && (
                                <div className="flex flex-col items-center gap-3">
                                    {link.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={() => { setMobileOpen(false); setMobileAboutOpen(false); }}
                                            className="text-gold/90 hover:text-gold transition-colors text-sm"
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                            className="text-white hover:text-gold transition-colors duration-500">
                            {link.label}
                        </Link>
                    )
                )}

                <Link href="/contact" onClick={() => setMobileOpen(false)} className="bg-gold text-navy px-6 py-2.5 rounded-full text-sm font-medium">
                    Get in Touch
                </Link>

                <button onClick={() => setMobileOpen(false)} className="md:hidden bg-white text-navy p-2 rounded-md aspect-square font-medium transition cursor-pointer absolute top-6 right-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>
        </>
    );
}
