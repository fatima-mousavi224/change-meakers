import UpdateDetails from "@/components/updates/UpdateDetails";
import prisma from "@/lib/prismaDB";

interface DetailsUpdatePageProps {
  params: { id: string };
}

export default async function DetailsUpdatePage({
  params: { id },
}: DetailsUpdatePageProps) {
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: { Category: true },
  });

  return (
    <main className="min-h-screen max-w-screen-2xl  mx-auto px-4">
      {/* @ts-ignore */}
      <UpdateDetails {...post} />
    </main>
  );
}

export async function generateMetadata({
  params: { id },
}: DetailsUpdatePageProps) {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  if (post) {
    return {
      title: ` ${post?.title}`,
      description: ` ${post?.description}`,
      openGraph: {
        images: [post?.postImages[0]?.image],
      },
    };
  }
}
