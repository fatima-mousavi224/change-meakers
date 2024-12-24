import Subscribe from "@/components/contact-us/Subscribe";
import Contribute from "@/components/home/contribute/Contribute";
import HeroSlider from "@/components/home/hero-section/HeroSlider";
import HomeVedio from "@/components/home/homeVedio";
import { InfiniteBanner } from "@/components/home/infinite-banner/InfiniteBanner";
import NewsStories from "@/components/home/news-stories/news-stories";
import Ourchanges from "@/components/home/our-changes/OurChanges";
import WhoWeAre from "@/components/home/who-we-are/WhoWeAre";
import "@/lib/env";
import prisma from "@/lib/prismaDB";

export default async function HomePage() {
  // select the 4 latest posts
  const posts = await prisma.post.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  const categories = await prisma.category.findMany();

  return (
    <main className="max-w-screen-2xl px-4 mx-auto">
      <HeroSlider />
      <InfiniteBanner direction="left" />
      <Ourchanges />
      <WhoWeAre />
      <NewsStories posts={posts} categories={categories} />
      <HomeVedio />
      <Contribute />
      <Subscribe />
    </main>
  );
}
