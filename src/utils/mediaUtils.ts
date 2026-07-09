import { useEffect, useMemo } from "react";

type CacheEntry = {
    url: string;
    refCount: number;
};

const blobUrlCache = new Map<string, CacheEntry>();

export function useBase64ToBlobUrl(
    base64: string,
    type: string
): string | undefined {
    const blobUrl = useMemo(() => {
        if (!base64 || base64.length < 100) return undefined;

        const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;

        let entry = blobUrlCache.get(cleanBase64);

        if (!entry) {
            try {
                const byteCharacters = atob(cleanBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type });
                const url = URL.createObjectURL(blob);

                entry = { url, refCount: 1 };
                blobUrlCache.set(cleanBase64, entry);

            } catch (error) {
                console.error("Failed to create blob:", error);
                return undefined;
            }
        } else {
            entry.refCount++;
        }

        return entry.url;
    }, [base64, type]);

    useEffect(() => {
        if (!blobUrl) return;

        return () => {
            const entry = Array.from(blobUrlCache.values()).find((e) => e.url === blobUrl);
            if (!entry) return;

            entry.refCount--;

            if (entry.refCount <= 0) {
                URL.revokeObjectURL(entry.url);
                for (const [key, val] of blobUrlCache.entries()) {
                    if (val === entry) {
                        blobUrlCache.delete(key);
                        break;
                    }
                }
            }
        };
    }, [blobUrl]);

    return blobUrl;
}

export const convertBase64ToBlobUrl = (base64, type) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type });
    const url = URL.createObjectURL(blob);

    return url
};