const PLACEHOLDER_IMAGE = "/images/place-placeholder.svg";

function extractGoogleDriveFileId(url: string) {
    const patterns = [
        /drive\.google\.com\/file\/d\/([^/]+)/,
        /drive\.google\.com\/open\?id=([^&]+)/,
        /drive\.google\.com\/uc\?id=([^&]+)/,
        /drive\.google\.com\/thumbnail\?id=([^&]+)/,
        /id=([^&]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);

        if (match?.[1]) {
            return match[1];
        }
    }

    return null;
}

function isGoogleDriveUrl(url: string) {
    return url.includes("drive.google.com");
}

function isDirectGoogleImageUrl(url: string) {
    return url.includes("lh3.googleusercontent.com");
}

export function getSafePlaceImageUrl(imageUrl?: string | null) {
    if (!imageUrl) {
        return PLACEHOLDER_IMAGE;
    }

    const trimmedUrl = imageUrl.trim();

    if (!trimmedUrl) {
        return PLACEHOLDER_IMAGE;
    }

    if (isDirectGoogleImageUrl(trimmedUrl)) {
        return trimmedUrl;
    }

    if (isGoogleDriveUrl(trimmedUrl)) {
        const fileId = extractGoogleDriveFileId(trimmedUrl);

        if (fileId) {
            return `https://lh3.googleusercontent.com/d/${fileId}`;
        }

        return PLACEHOLDER_IMAGE;
    }

    return trimmedUrl;
}