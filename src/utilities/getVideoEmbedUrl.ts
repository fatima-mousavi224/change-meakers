export function getVideoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtube-nocookie.com")
    ) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.toString();
      }

      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      const shortPathId = parsed.pathname.split("/").filter(Boolean)[0];
      if (shortPathId === "shorts" && parsed.pathname.split("/")[2]) {
        return `https://www.youtube.com/embed/${parsed.pathname.split("/")[2]}`;
      }
    }

    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      const videoId = segments[segments.length - 1];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}
