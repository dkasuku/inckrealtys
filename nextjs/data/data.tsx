import React from "react";
import { Lightbulb, Building2, ShieldCheck, Leaf, Handshake } from "lucide-react";

export interface WhyChooseUsItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    image: string;
}

export const whyChooseUsData: WhyChooseUsItem[] = [
    {
        icon: <Lightbulb className="size-5 text-gold" />,
        title: "Innovative Property Developments",
        description: "We blend innovative architecture, quality craftsmanship and practical living to deliver modern homes designed for today's homeowners and tomorrow's cities.",
        image: "/assets/house.png"
    },
    {
        icon: <Building2 className="size-5 text-gold" />,
        title: "Modern Architectural Designs",
        description: "From affordable housing to premium residences and gated communities, our designs reflect international standards while embracing local culture.",
        image: "/assets/galleryImage1.png"
    },
    {
        icon: <ShieldCheck className="size-5 text-gold" />,
        title: "Quality, Durability & Transparency",
        description: "We are committed to quality and durability with transparent, professional project delivery you can trust at every stage.",
        image: "/assets/galleryImage2.png"
    },
    {
        icon: <Leaf className="size-5 text-gold" />,
        title: "Sustainable Development Practices",
        description: "Sustainability sits at the core of every project, creating communities that support economic growth and improve quality of life.",
        image: "/assets/galleryImage3.png"
    },
    {
        icon: <Handshake className="size-5 text-gold" />,
        title: "Strong Investment Opportunities",
        description: "With a customer-first approach and a long-term vision for Africa's growth, we unlock lasting value for homeowners and investors alike.",
        image: "/assets/galleryImage4.png"
    }
];

export interface TestimonialItem {
    name: string;
    location: string;
    avatar: string;
    text: string;
}

export const testimonialsCol1: TestimonialItem[] = [
    {
        name: "James Mwangi",
        location: "Nairobi, Kenya",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=120&h=120&q=80",
        text: "INCK delivered our home exactly as promised. The craftsmanship and attention to detail are outstanding."
    },
    {
        name: "Amina Hassan",
        location: "Mombasa, Kenya",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=120&h=120&q=80",
        text: "Professional, transparent and truly customer-first. Buying into their gated estate was a seamless experience."
    },
    {
        name: "Grace Njeri",
        location: "Kiambu, Kenya",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=120&h=120&q=80",
        text: "From planning to handover, everything was handled professionally. A developer you can genuinely trust."
    }
];

export const testimonialsCol2: TestimonialItem[] = [
    {
        name: "David Ochieng",
        location: "Kisumu, Kenya",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=120&h=120&q=80",
        text: "A strong investment with real long-term value. INCK's vision for African living is impressive."
    },
    {
        name: "Samuel Kariuki",
        location: "Nakuru, Kenya",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?fit=crop&w=120&h=120&q=80",
        text: "Modern design, quality build and sustainable communities. They deliver on every promise they make."
    },
    {
        name: "Fatuma Ali",
        location: "Nairobi, Kenya",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=120&h=120&q=80",
        text: "As a first-time homeowner, I felt supported throughout the entire journey. Highly recommended."
    }
];
