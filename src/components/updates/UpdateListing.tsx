"use client";

import { useEffect, useState } from "react";

import SiteContainer from "@/components/common/SiteContainer";
import StaggerReveal, { StaggerItem } from "@/components/common/StaggerReveal";
import OpportunityPagination from "@/components/opportunities/OpportunityPagination";
import {
  UPDATES_PER_PAGE,
  type UpdateListResponse,
} from "@/constant/updatesListing";
import UpdateFilters, {
  DEFAULT_UPDATE_FILTERS,
  type UpdateFiltersState,
} from "./UpdateFilters";
import UpdateListingCard from "./UpdateListingCard";

export default function UpdateListing() {
  const [filters, setFilters] = useState<UpdateFiltersState>(
    DEFAULT_UPDATE_FILTERS,
  );
  const [page, setPage] = useState(1);
  const [data, setData] = useState<UpdateListResponse>({
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.sort, filters.category]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUpdates = async () => {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(UPDATES_PER_PAGE),
        search: filters.search,
        category: filters.category,
        sort: filters.sort,
      });

      try {
        const response = await fetch(`/api/updates?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch updates");
        }

        const result = (await response.json()) as UpdateListResponse;
        setData(result);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setData({ items: [], total: 0, page: 1, totalPages: 1 });
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timeout = setTimeout(fetchUpdates, filters.search ? 300 : 0);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [filters, page]);

  const handleReset = () => {
    setFilters(DEFAULT_UPDATE_FILTERS);
    setPage(1);
  };

  return (
    <SiteContainer className="pb-12 pt-8 lg:pt-10">
      <div className="lg:hidden">
        <UpdateFilters
          layout="mobile"
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
        />

        {loading ? (
          <p className="py-10 text-center font-plusJakartaSans text-[15px] text-[#667085]">
            Loading updates...
          </p>
        ) : data.items.length ? (
          <StaggerReveal
            key={data.items.map((update) => update.id).join("-")}
            onMount
            className="mt-6 space-y-6"
          >
            {data.items.map((update) => (
              <StaggerItem key={update.id}>
                <UpdateListingCard update={update} layout="vertical" />
              </StaggerItem>
            ))}
          </StaggerReveal>
        ) : (
          <p className="py-10 text-center font-plusJakartaSans text-[15px] text-[#667085]">
            No updates match your filters.
          </p>
        )}
      </div>

      <div className="hidden gap-8 lg:flex lg:items-start">
        <UpdateFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
        />

        <div className="min-w-0 flex-1">
          {loading ? (
            <p className="py-16 text-center font-plusJakartaSans text-[15px] text-[#667085]">
              Loading updates...
            </p>
          ) : data.items.length ? (
            <StaggerReveal
              key={data.items.map((update) => update.id).join("-")}
              onMount
              className="space-y-6"
            >
              {data.items.map((update) => (
                <StaggerItem key={update.id}>
                  <UpdateListingCard update={update} />
                </StaggerItem>
              ))}
            </StaggerReveal>
          ) : (
            <p className="py-16 text-center font-plusJakartaSans text-[15px] text-[#667085]">
              No updates match your filters.
            </p>
          )}
        </div>
      </div>

      {!loading && data.totalPages > 1 ? (
        <div className="mt-10 lg:ml-[352px]">
          <OpportunityPagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </SiteContainer>
  );
}
