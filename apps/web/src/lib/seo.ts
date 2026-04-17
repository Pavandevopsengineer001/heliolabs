export function buildMetadata({
  title,
  description,
  path = "",
  image = "/heliolabs-logo.png",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}) {
  const siteUrl = "https://heliolabs.skin";
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName: "HelioLabs",
      images: [{ url: image }],
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [image],
    },
  };
}
