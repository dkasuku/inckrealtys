"use client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TOKEN_KEY = "inck_admin_token";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
    window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
    status: number;
    payload: unknown;
    constructor(status: number, message: string, payload?: unknown) {
        super(message);
        this.status = status;
        this.payload = payload;
    }
}

/** Authenticated request to the Flask admin API. */
export async function api<T = unknown>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (res.status === 401 && typeof window !== "undefined") {
        clearToken();
        if (!window.location.pathname.endsWith("/admin/login")) {
            window.location.href = "/admin/login";
        }
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            (data && (data.error || (data.errors && Object.values(data.errors)[0]))) ||
            `Request failed (${res.status})`;
        throw new ApiError(res.status, String(message), data);
    }

    return data as T;
}

export async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new ApiError(res.status, data?.error || "Login failed", data);
    setToken(data.token);
    return data.user;
}

/** Resolve an image path to a full URL (uploads are served by Next from /public). */
export function imageUrl(src: string): string {
    if (!src) return "";
    if (src.startsWith("http") || src.startsWith("/")) return src;
    return `/${src}`;
}
