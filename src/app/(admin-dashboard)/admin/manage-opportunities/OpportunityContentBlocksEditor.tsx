"use client";

import type { OpportunityContentBlock } from "@/constant/opportunityContentBlocks";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export type EditableContentBlock =
  | { id: string; type: "text"; body: string }
  | {
      id: string;
      type: "image";
      src: string;
      caption: string;
      file: File | null;
      preview: string | null;
      isUploading?: boolean;
    }
  | { id: string; type: "video"; url: string; caption: string };

function createBlockId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createDefaultEditableBlocks(): EditableContentBlock[] {
  return [{ id: createBlockId(), type: "text", body: "" }];
}

export function contentBlocksToEditable(
  blocks: OpportunityContentBlock[]
): EditableContentBlock[] {
  if (!blocks.length) {
    return createDefaultEditableBlocks();
  }

  return blocks.map((block) => {
    if (block.type === "text") {
      return { id: createBlockId(), type: "text", body: block.body };
    }

    if (block.type === "image") {
      return {
        id: createBlockId(),
        type: "image",
        src: block.src,
        caption: block.caption ?? "",
        file: null,
        preview: block.src,
      };
    }

    return {
      id: createBlockId(),
      type: "video",
      url: block.url,
      caption: block.caption ?? "",
    };
  });
}

type OpportunityContentBlocksEditorProps = {
  blocks: EditableContentBlock[];
  onChange: (
    updater:
      | EditableContentBlock[]
      | ((prev: EditableContentBlock[]) => EditableContentBlock[])
  ) => void;
  onUploadImage: (file: File) => Promise<string>;
};

function BlockToolbar({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Block {index + 1}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          aria-label="Move block up"
        >
          <ChevronUp className="size-4" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          aria-label="Move block down"
        >
          <ChevronDown className="size-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={total === 1}
          className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-30"
          aria-label="Remove block"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function OpportunityContentBlocksEditor({
  blocks,
  onChange,
  onUploadImage,
}: OpportunityContentBlocksEditorProps) {
  const updateBlockById = (
    blockId: string,
    updater: (block: EditableContentBlock) => EditableContentBlock
  ) => {
    onChange((prev) =>
      prev.map((block) => (block.id === blockId ? updater(block) : block))
    );
  };

  const updateBlock = (
    index: number,
    updater: (block: EditableContentBlock) => EditableContentBlock
  ) => {
    onChange((prev) =>
      prev.map((block, blockIndex) =>
        blockIndex === index ? updater(block) : block
      )
    );
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    onChange((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const nextBlocks = [...prev];
      [nextBlocks[index], nextBlocks[targetIndex]] = [
        nextBlocks[targetIndex],
        nextBlocks[index],
      ];
      return nextBlocks;
    });
  };

  const removeBlock = (index: number) => {
    onChange((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, blockIndex) => blockIndex !== index);
    });
  };

  const addBlock = (type: EditableContentBlock["type"]) => {
    const newBlock: EditableContentBlock =
      type === "text"
        ? { id: createBlockId(), type: "text", body: "" }
        : type === "image"
          ? {
              id: createBlockId(),
              type: "image",
              src: "",
              caption: "",
              file: null,
              preview: null,
            }
          : { id: createBlockId(), type: "video", url: "", caption: "" };

    onChange((prev) => [...prev, newBlock]);
  };

  const handleImageSelect = async (blockId: string, file: File) => {
    updateBlockById(blockId, (block) => {
      if (block.type !== "image") return block;
      return {
        ...block,
        file,
        preview: URL.createObjectURL(file),
        isUploading: true,
      };
    });

    try {
      const uploadedUrl = await onUploadImage(file);
      updateBlockById(blockId, (block) => {
        if (block.type !== "image") return block;
        return {
          ...block,
          src: uploadedUrl,
          file: null,
          preview: uploadedUrl,
          isUploading: false,
        };
      });
    } catch (error: any) {
      updateBlockById(blockId, (block) => {
        if (block.type !== "image") return block;
        return {
          ...block,
          file: null,
          preview: block.src || null,
          isUploading: false,
        };
      });
      toast.error(error?.message || "Failed to upload image block");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Details Page Content
        </label>
        <p className="mt-1 text-xs text-gray-500">
          Add text, images, and videos in the order they should appear on the
          details page.
        </p>
      </div>

      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <BlockToolbar
            index={index}
            total={blocks.length}
            onMoveUp={() => moveBlock(index, -1)}
            onMoveDown={() => moveBlock(index, 1)}
            onRemove={() => removeBlock(index)}
          />

          {block.type === "text" ? (
            <textarea
              value={block.body}
              onChange={(event) =>
                updateBlock(index, (current) =>
                  current.type === "text"
                    ? { ...current, body: event.target.value }
                    : current
                )
              }
              rows={5}
              placeholder="Write a paragraph..."
              className="mt-3 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            />
          ) : null}

          {block.type === "image" ? (
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-4">
                {block.preview ? (
                  <Image
                    src={block.preview}
                    alt="Block preview"
                    width={96}
                    height={64}
                    className="h-16 w-24 rounded-md object-cover"
                    unoptimized={
                      block.preview.startsWith("blob:") ||
                      block.preview.startsWith("http") ||
                      block.preview.startsWith("/")
                    }
                  />
                ) : null}
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-600">
                  <PhotoIcon className="size-5" />
                  {block.isUploading ? "Uploading..." : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={block.isUploading}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleImageSelect(block.id, file);
                    }}
                  />
                </label>
              </div>
              <input
                value={block.caption}
                onChange={(event) =>
                  updateBlock(index, (current) =>
                    current.type === "image"
                      ? { ...current, caption: event.target.value }
                      : current
                  )
                }
                placeholder="Image caption (optional)"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          ) : null}

          {block.type === "video" ? (
            <div className="mt-3 space-y-3">
              <input
                value={block.url}
                onChange={(event) =>
                  updateBlock(index, (current) =>
                    current.type === "video"
                      ? { ...current, url: event.target.value }
                      : current
                  )
                }
                placeholder="YouTube or Vimeo URL"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={block.caption}
                onChange={(event) =>
                  updateBlock(index, (current) =>
                    current.type === "video"
                      ? { ...current, caption: event.target.value }
                      : current
                  )
                }
                placeholder="Video caption (optional)"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          ) : null}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addBlock("text")}
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus className="size-4" />
          Add Text
        </button>
        <button
          type="button"
          onClick={() => addBlock("image")}
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus className="size-4" />
          Add Image
        </button>
        <button
          type="button"
          onClick={() => addBlock("video")}
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus className="size-4" />
          Add Video
        </button>
      </div>
    </div>
  );
}
