import Subscribe from "@/components/contact-us/Subscribe";
import Contribute from "@/components/home/contribute/Contribute";
import HeroSlider from "@/components/home/hero-section/HeroSlider";
import HomeVedio from "@/components/home/homeVedio";
import { InfiniteBanner } from "@/components/home/infinite-banner/InfiniteBanner";
import LatestNews from "@/components/home/news-stories/LatestNews";
import NewsStories from "@/components/home/news-stories/news-stories";
import Ourchanges from "@/components/home/our-changes/OurChanges";
import WhoWeAre from "@/components/home/who-we-are/WhoWeAre";
import "@/lib/env";
import prisma from "@/lib/prismaDB";

export default async function HomePage() {
  // select the 4 latest posts
    const posts = await prisma.post.findMany({
    take: 10,
    where: {
      Category: {
        title: "Latests", 
      },
    },
    orderBy: {
      postDate: "desc", 
    },
  });

  return (
    <main >
      <div className="max-w-screen-2xl px-4 mx-auto">
      <HeroSlider />
      <InfiniteBanner direction="left" />
      <Ourchanges />
      <WhoWeAre />
      {/* <NewsStories posts={posts} categories={categories} /> */}
      </div>
      <LatestNews posts={posts} />
      <div className="max-w-screen-2xl px-4 mx-auto">
      <HomeVedio />
      <Contribute />
      <Subscribe />
      </div>
    </main>
  );
}
