"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import type { Post } from "@/types/database";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import SearchResultList from "./SearchResult";

interface SearchModalProps {
  posts: Post[];
}

export default function SearchModal({ posts }: SearchModalProps) {
  const [open, setOpen] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  const handleSearch = async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);

      return;
    }

    const results = posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  useEffect(() => {
    setOpen(params.get("search") === "open");
  }, [params]);

  const handleClose = () => {
    setOpen(false);
    setSearchResults([]);
    router.push("?search=close");
  };

  if (!open) return null;

  return (
    <Suspense fallback="loading...">
      <Dialog
        open={open}
        onClose={handleClose}
        className="relative z-[9999] lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <SearchInput handleSearch={handleSearch} />
              <SearchResultList searchResults={searchResults} />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Suspense>
  );
}
