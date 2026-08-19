import type { OpportunityContentBlock } from "@/constant/opportunityContentBlocks";
import { getVideoEmbedUrl } from "@/utilities/getVideoEmbedUrl";
import Image from "next/image";

type OpportunityContentBlocksProps = {
  blocks: OpportunityContentBlock[];
};

function isRemoteImage(src: string) {
  return src.startsWith("http");
}

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
  return (
    <figure className="w-full">
      <div className="relative aspect-[16/9] w-full min-h-[240px] overflow-hidden rounded-[20px] bg-[#F2F4F7] sm:min-h-[360px] lg:min-h-[480px]">
        <Image
          src={src}
          alt={caption ?? "Opportunity image"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          unoptimized={isRemoteImage(src) || src.startsWith("/")}
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
    return (
      <figure>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-[12px] bg-primary-50 px-5 py-3 font-plusJakartaSans text-[14px] font-medium text-white hover:bg-primary-100"
        >
          Watch video
        </a>
        {caption ? (
          <figcaption className="mt-3 font-plusJakartaSans text-[13px] leading-relaxed text-[#667085] sm:text-[14px]">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="w-full">
      <div className="relative aspect-[16/9] w-full min-h-[240px] overflow-hidden rounded-[20px] bg-black sm:min-h-[360px] lg:min-h-[480px]">
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
    <div className="space-y-10 sm:space-y-12 lg:space-y-14">
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
