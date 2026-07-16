"use client";

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function LenisScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            syncTouch: false,
            anchors: true,
            autoRaf: true,
        });

        return () => {
            lenis.destroy();
        };
    }, []);

    return null;
}
