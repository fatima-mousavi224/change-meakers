"use client";

import { useEffect, useState } from "react";

import SiteContainer from "@/components/common/SiteContainer";
import {
  OPPORTUNITIES_PER_PAGE,
  type OpportunityListResponse,
} from "@/constant/opportunities";
import OpportunityCard from "./OpportunityCard";
import OpportunityFilters, {
  DEFAULT_OPPORTUNITY_FILTERS,
  type OpportunityFiltersState,
} from "./OpportunityFilters";
import OpportunityPagination from "./OpportunityPagination";

export default function OpportunityListing() {
  const [filters, setFilters] = useState<OpportunityFiltersState>(
    DEFAULT_OPPORTUNITY_FILTERS,
  );
  const [page, setPage] = useState(1);
  const [data, setData] = useState<OpportunityListResponse>({
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.sort, filters.category, filters.location]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOpportunities = async () => {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(OPPORTUNITIES_PER_PAGE),
        search: filters.search,
        category: filters.category,
        location: filters.location,
        sort: filters.sort,
      });

      try {
        const response = await fetch(`/api/opportunities?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }

        const result = (await response.json()) as OpportunityListResponse;
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

    const timeout = setTimeout(fetchOpportunities, filters.search ? 300 : 0);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [filters, page]);

  const handleReset = () => {
    setFilters(DEFAULT_OPPORTUNITY_FILTERS);
    setPage(1);
  };

  return (
    <SiteContainer className="pb-12 pt-8 lg:pt-10">
      <div className="lg:hidden">
        <OpportunityFilters
          layout="mobile"
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
        />

        <div className="mt-6 space-y-6">
          {loading ? (
            <p className="py-10 text-center font-plusJakartaSans text-[15px] text-[#667085]">
              Loading opportunities...
            </p>
          ) : data.items.length ? (
            data.items.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                layout="vertical"
              />
            ))
          ) : (
            <p className="py-10 text-center font-plusJakartaSans text-[15px] text-[#667085]">
              No opportunities match your filters.
            </p>
          )}
        </div>
      </div>

      <div className="hidden gap-8 lg:flex lg:items-start">
        <OpportunityFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
        />

        <div className="min-w-0 flex-1">
          <div className="space-y-6">
            {loading ? (
              <p className="py-16 text-center font-plusJakartaSans text-[15px] text-[#667085]">
                Loading opportunities...
              </p>
            ) : data.items.length ? (
              data.items.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))
            ) : (
              <p className="py-16 text-center font-plusJakartaSans text-[15px] text-[#667085]">
                No opportunities match your filters.
              </p>
            )}
          </div>
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
