import React from 'react';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { WhatsAppButton } from '@/components/whatsapp-button';
import LenisScroll from '@/components/lenis-scroll';

export const metadata = {
    title: 'INCK Realty Ltd — Developing the Future of African Living',
    description: 'INCK Realty Ltd develops modern, affordable and sustainable homes and communities across Kenya and Africa.',
    appleWebApp: {
        title: 'INCK Realty Ltd',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LenisScroll />
            <Navbar />
            {children}
            <Footer />
            <WhatsAppButton phone="+254712470341" />
        </>
    );
}
