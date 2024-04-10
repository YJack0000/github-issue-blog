import type { Metadata } from "next"

export const getMetadata = (
    title: string,
    description: string,
    imageUrl?: string
): Metadata => {
    const metadata: Metadata = {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: "website",
            images: [
                {
                    url: imageUrl ?? "/img/og.png",
                    width: 800,
                    height: 526
                },
            ],
        },
    }
    return metadata
}
