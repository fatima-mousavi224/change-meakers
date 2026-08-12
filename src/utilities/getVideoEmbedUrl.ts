export function getVideoEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.toString();
      }

      const queryId = parsed.searchParams.get("v");
      if (queryId) {
        return `https://www.youtube.com/embed/${queryId}`;
      }

      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments[0] === "shorts" && segments[1]) {
        return `https://www.youtube.com/embed/${segments[1]}`;
      }

      if (segments[0] === "live" && segments[1]) {
        return `https://www.youtube.com/embed/${segments[1]}`;
      }

      if (segments[0] === "watch" && parsed.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
      }
    }

    if (host.includes("vimeo.com")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      const videoId = segments[segments.length - 1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
  } catch {
    return null;
  }

  return null;
}
