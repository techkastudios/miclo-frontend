import { Hero } from "@/components/site/Hero";
import { getHeroBanner } from "@/lib/api";

const FALLBACK_HERO_SRC = "/assets/default-banner.jpeg";
async function AboutPage() {
    const { data: bannerData } = await getHeroBanner("about_hero", FALLBACK_HERO_SRC);
    return (
        <>
            <Hero {...bannerData} />
            <section className="my-12">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    <h3 className="uppercase font-semibold text-xl tracking-[8px]">Who we are</h3>
                    <p className="text-xl">
                        We are MICLO Bangladesh Limited, a fashion retailer committed to providing
                        basic, simple, comfortable, and affordable clothing. More than just a brand,
                        we are a movement that brings fashion to your doorstep without compromising
                        on quality, style, or affordability.
                    </p>
                    <p className="text-xl">
                        Our customers are at the heart of everything we do. We understand that
                        shopping for fashion, whether in stores or online, should be a seamless and
                        enjoyable experience. That’s why we have invested in user-friendly
                        interfaces, secure payment gateways, and responsive customer support—because
                        shopping for fashion should be as fun as wearing it! We’re here to make your
                        journey with us memorable, joyous, and hassle-free.
                    </p>
                    <p className="text-xl">
                        With a strong commitment to excellence, our leadership ensures that MICLO
                        Bangladesh Limited continues to grow as a trusted name in the fashion
                        industry, delivering quality and affordability to our valued customers.
                    </p>
                </div>
            </section>
        </>
    );
}

export default AboutPage;
