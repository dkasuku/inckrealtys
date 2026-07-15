"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MediaLibrary } from "@/components/admin/media-picker";

export default function MediaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-navy">Media</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Upload and manage every image used across the site.
                </p>
            </div>
            <Card>
                <CardContent>
                    <MediaLibrary />
                </CardContent>
            </Card>
        </div>
    );
}
