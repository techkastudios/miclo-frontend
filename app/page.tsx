import { Categories } from "@/components/site/Categories";
import { Instagram } from "@/components/site/Instagram";
import HomeBanner from "./(components)/home-banner";

export default function Home() {
    return (
        <>
            <HomeBanner />
            <Categories />
            <Instagram />
        </>
    );
}
