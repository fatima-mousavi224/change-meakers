import type { OpportunityContentBlock } from "@/constant/opportunityContentBlocks";
import { getVideoEmbedUrl } from "@/utilities/getVideoEmbedUrl";
import Image from "next/image";

type OpportunityContentBlocksProps = {
  blocks: OpportunityContentBlock[];
};

function TextBlock({ body }: { body: string }) {
  return (
    <p className="font-plusJakartaSans text-[16px] leading-[28px] text-[#252525] sm:text-[17px] sm:leading-[30px]">
      {body}
    </p>
  );
}

function ImageBlock({
  src,
  caption,
}: {
  src: string;
  caption?: string;
}) {
  const isRemoteImage = src.startsWith("http");

  return (
    <figure>
      <div className="relative aspect-[15/7] w-full overflow-hidden rounded-[16px]">
        <Image
          src={src}
          alt={caption ?? "Opportunity image"}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 896px"
          unoptimized={isRemoteImage}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 font-plusJakartaSans text-[13px] leading-relaxed text-[#667085] sm:text-[14px]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function VideoBlock({
  url,
  caption,
}: {
  url: string;
  caption?: string;
}) {
  const embedUrl = getVideoEmbedUrl(url);

  if (!embedUrl) {
    return null;
  }

  return (
    <figure>
      <div className="relative aspect-[15/7] w-full overflow-hidden rounded-[16px] bg-black">
        <iframe
          src={embedUrl}
          title={caption ?? "Opportunity video"}
          className="absolute inset-0 size-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 font-plusJakartaSans text-[13px] leading-relaxed text-[#667085] sm:text-[14px]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default function OpportunityContentBlocks({
  blocks,
}: OpportunityContentBlocksProps) {
  if (!blocks.length) {
    return null;
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "text":
            return <TextBlock key={`text-${index}`} body={block.body} />;
          case "image":
            return (
              <ImageBlock
                key={`image-${index}`}
                src={block.src}
                caption={block.caption}
              />
            );
          case "video":
            return (
              <VideoBlock
                key={`video-${index}`}
                url={block.url}
                caption={block.caption}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
