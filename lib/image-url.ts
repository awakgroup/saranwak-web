const FALLBACK_PLACE_IMAGE =
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop";

function getGoogleDriveFileId(url: string) {
    const fileMatch = url.match(/\/file\/d\/([^/]+)/);
    if (fileMatch?.[1]) return fileMatch[1];

    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch?.[1]) return idMatch[1];

    return null;
}

export function getSafePlaceImageUrl(url?: string | null) {
    if (!url) return FALLBACK_PLACE_IMAGE;

    const cleanUrl = url.trim();

    if (!cleanUrl) return FALLBACK_PLACE_IMAGE;

    if (cleanUrl.includes("drive.google.com")) {
        const fileId = getGoogleDriveFileId(cleanUrl);

        if (fileId) {
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
        }

        return FALLBACK_PLACE_IMAGE;
    }

    const isDirectImage =
        /\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i.test(cleanUrl);

    if (isDirectImage) {
        return cleanUrl;
    }

    const imageLikeHosts = [
        "images.unsplash.com",
        "plus.unsplash.com",
        "images.pexels.com",
        "cdn.pixabay.com",
        "lh3.googleusercontent.com",
        "static.wixstatic.com",
        "images.squarespace-cdn.com",
        "res.cloudinary.com",
        "ik.imagekit.io",
    ];

    try {
        const parsedUrl = new URL(cleanUrl);

        if (imageLikeHosts.includes(parsedUrl.hostname)) {
            return cleanUrl;
        }

        return FALLBACK_PLACE_IMAGE;
    } catch {
        return FALLBACK_PLACE_IMAGE;
    }
}