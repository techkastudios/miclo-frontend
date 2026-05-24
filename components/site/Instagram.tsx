import { CiInstagram as IgIcon } from "react-icons/ci";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MetaInstagramResponse } from "@/types";

// mock instagram posts
export const mockInstagramFeed: MetaInstagramResponse = {
    data: [
        {
            id: "18012345678901234",
            caption:
                "Our signature heavyweight oversized cotton hoodie. Built for comfort, tailored for the streets. 🪐✨ Shop the Neutral Drop online now. #streetwear #minimalfashion #hoodieseason",
            media_type: "IMAGE",
            media_url:
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
            permalink: "https://www.instagram.com/p/C3_clothing1/",
            timestamp: "2026-05-24T08:30:00+0000",
        },
        {
            id: "18012345678901235",
            caption:
                "Summer linen sets are officially here. Lightweight, breathable, and effortlessly sharp. 🌊🌾 #resortwear #summeressentials #mensfashion",
            media_type: "IMAGE",
            media_url:
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
            permalink: "https://www.instagram.com/p/C3_clothing2/",
            timestamp: "2026-05-23T14:15:00+0000",
        },
        {
            id: "18012345678901236",
            caption:
                "Classic silhouettes, modern tailoring. The Essential Trench Coat in Desert Sand. 🧥🍂 #outerwear #fallfashion #classicstyle",
            media_type: "IMAGE",
            media_url:
                "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
            permalink: "https://www.instagram.com/p/C3_clothing3/",
            timestamp: "2026-05-22T18:00:00+0000",
        },
        {
            id: "18012345678901237",
            caption:
                "It's all in the details. Premium sustainable fabrics designed to last a lifetime. 🧵🌱 #slowfashion #sustainableclothing #minimalist",
            media_type: "IMAGE",
            media_url:
                "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
            permalink: "https://www.instagram.com/p/C3_clothing4/",
            timestamp: "2026-05-21T09:05:00+0000",
        },
        {
            id: "18012345678901238",
            caption:
                "Monochrome coordination for the city wanderers. What's your go-to weekend uniform? 🏙️👟 #capsulewardrobe #streetstyle #ootd",
            media_type: "IMAGE",
            media_url:
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
            permalink: "https://www.instagram.com/p/C3_clothing5/",
            timestamp: "2026-05-20T16:45:00+0000",
        },
        {
            id: "18012345678901239",
            caption:
                "Crisp whites and sharp denim. Your ultimate uniform for long sunny afternoons. ☀️👖 #denimstyle #casualchic #springoutfit",
            media_type: "IMAGE",
            media_url:
                "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop",
            permalink: "https://www.instagram.com/p/C3_clothing6/",
            timestamp: "2026-05-19T11:20:00+0000",
        },
        {
            id: "18012345678901240",
            caption:
                "Functional athleisure that transitions perfectly from morning workouts to everyday errands. 🏃‍♀️☕ #athleisure #activewear #sportychic",
            media_type: "IMAGE",
            media_url:
                "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600&auto=format&fit=crop",
            permalink: "https://www.instagram.com/p/C3_clothing7/",
            timestamp: "2026-05-17T20:10:00+0000",
        },
        {
            id: "18012345678901241",
            caption:
                "Behind the design: Sketching out the final concepts for Autumn '26 collection. Stay tuned. 📐🖊️ #fashiondesign #behindthescenes #brandlaunch",
            media_type: "IMAGE",
            media_url:
                "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600&auto=format&fit=crop",
            permalink: "https://www.instagram.com/p/C3_clothing8/",
            timestamp: "2026-05-16T13:00:00+0000",
        },
    ],
    paging: {
        cursors: {
            before: "MAZDZD",
            after: "Njg0Mjg0NzEw",
        },
        next: "https://graph.instagram.com/v22.0/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=8&after=Njg0Mjg0NzEw&access_token=MOCK_TOKEN",
    },
};

export async function Instagram() {
    const posts = await mockInstagramFeed.data;

    return (
        <section className="bg-background">
            <div className="w-full px-4 md:px-5 pb-16 md:pb-24">
                <div className="text-center mb-10 md:mb-14">
                    <p className="text-[11px] tracking-wider-2 uppercase text-muted-foreground mb-3">
                        @miclo.studio
                    </p>
                    <h2 className="text-2xl md:text-4xl font-light tracking-display uppercase">
                        On <span className="italic">Instagram</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                    {posts.map((item) => (
                        <a
                            key={item.id}
                            href={item.permalink}
                            className="group relative block aspect-square overflow-hidden bg-surface"
                            aria-label={`Instagram post ${item.id}`}
                            target="_blank"
                        >
                            <Image
                                src={item.media_url}
                                alt=""
                                loading="lazy"
                                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                                fill={true}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/40 group-hover:opacity-100">
                                <IgIcon className="h-6 w-6 text-white" />
                            </div>
                        </a>
                    ))}
                </div>

                <div className="flex justify-center mt-12">
                    <a href="#" className={cn("btn-outline")}>
                        Find us on Instagram
                    </a>
                </div>
            </div>
        </section>
    );
}
