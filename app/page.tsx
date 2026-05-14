import { Categories } from "@/components/site/Categories";
import { Hero } from "@/components/site/Hero";
import { Instagram } from "@/components/site/Instagram";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Hero />
    <Categories />
    <Instagram />
    </>
  );
}
