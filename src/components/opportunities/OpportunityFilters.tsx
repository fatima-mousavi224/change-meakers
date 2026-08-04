"use client";



import { useState } from "react";



import {

  OPPORTUNITY_CATEGORIES,

  OPPORTUNITY_LOCATIONS,

  OPPORTUNITY_SORT_OPTIONS,

  type OpportunityCategory,

  type OpportunityLocation,

  type OpportunitySort,

} from "@/constant/opportunities";

import { cn } from "@/utilities/cn";

import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";



export type OpportunityFiltersState = {

  search: string;

  sort: OpportunitySort;

  category: OpportunityCategory;

  location: OpportunityLocation;

};



type OpportunityFiltersProps = {

  filters: OpportunityFiltersState;

  onChange: (filters: OpportunityFiltersState) => void;

  onReset: () => void;

  layout?: "sidebar" | "mobile";

};



type OpenPanel = "sort" | "category" | "location" | null;



function getSortLabel(sort: OpportunitySort) {

  return (

    OPPORTUNITY_SORT_OPTIONS.find((option) => option.value === sort)?.label ??

    "Newest First"

  );

}



function PillList({

  options,

  value,

  onChange,

}: {

  options: readonly string[];

  value: string;

  onChange: (value: string) => void;

}) {

  return (

    <div className="mt-3 flex flex-col gap-2">

      {options.map((option) => {

        const isActive = value === option;



        return (

          <button

            key={option}

            type="button"

            onClick={() => onChange(option)}

            className={cn(

              "rounded-[10px] border px-4 py-3 text-left font-plusJakartaSans text-[14px] font-medium transition-colors",

              isActive

                ? "border-primary-50 bg-primary-50 text-white"

                : "border-[#E4E7EC] bg-white text-[#252525] hover:border-[#D0D5DD]",

            )}

          >

            {option}

          </button>

        );

      })}

    </div>

  );

}



function SortPillList({

  value,

  onChange,

}: {

  value: OpportunitySort;

  onChange: (value: OpportunitySort) => void;

}) {

  return (

    <div className="mt-3 flex flex-col gap-2">

      {OPPORTUNITY_SORT_OPTIONS.map((option) => {

        const isActive = value === option.value;



        return (

          <button

            key={option.value}

            type="button"

            onClick={() => onChange(option.value)}

            className={cn(

              "rounded-[10px] border px-4 py-3 text-left font-plusJakartaSans text-[14px] font-medium transition-colors",

              isActive

                ? "border-primary-50 bg-primary-50 text-white"

                : "border-[#E4E7EC] bg-white text-[#252525] hover:border-[#D0D5DD]",

            )}

          >

            {option.label}

          </button>

        );

      })}

    </div>

  );

}



function ExpandableFilterField({

  label,

  value,

  isOpen,

  onToggle,

  children,

}: {

  label: string;

  value: string;

  isOpen: boolean;

  onToggle: () => void;

  children: React.ReactNode;

}) {

  return (

    <div>

      <span className="mb-2 block font-plusJakartaSans text-[14px] font-semibold text-[#252525]">

        {label}

      </span>

      <button

        type="button"

        onClick={onToggle}

        aria-expanded={isOpen}

        className="flex w-full items-center justify-between rounded-[12px] border border-[#D0D5DD] bg-white px-4 py-3 text-left font-plusJakartaSans text-[14px] text-[#667085] outline-none transition-colors hover:border-[#98A2B3] focus:border-primary-50"

      >

        <span className="truncate">{value}</span>

        <ChevronDownIcon

          className={cn(

            "size-4 shrink-0 text-[#667085] transition-transform duration-200",

            isOpen && "rotate-180",

          )}

          aria-hidden

        />

      </button>

      {isOpen ? children : null}

    </div>

  );

}



export default function OpportunityFilters({

  filters,

  onChange,

  onReset,

  layout = "sidebar",

}: OpportunityFiltersProps) {

  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);



  const update = (partial: Partial<OpportunityFiltersState>) => {

    onChange({ ...filters, ...partial });

  };



  const closePanels = () => setOpenPanel(null);



  const handleReset = () => {

    closePanels();

    onReset();

  };



  const togglePanel = (panel: Exclude<OpenPanel, null>) => {

    setOpenPanel((current) => (current === panel ? null : panel));

  };



  const searchField = (

    <div className="relative">

      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#667085]" />

      <input

        type="search"

        value={filters.search}

        onChange={(event) => update({ search: event.target.value })}

        onFocus={closePanels}

        placeholder="Search..."

        className="w-full rounded-[12px] border border-[#D0D5DD] bg-white py-3 pl-10 pr-4 font-plusJakartaSans text-[14px] text-[#252525] outline-none focus:border-primary-50"

      />

    </div>

  );



  const sortField = (

    <ExpandableFilterField

      label="Filter By"

      value={getSortLabel(filters.sort)}

      isOpen={openPanel === "sort"}

      onToggle={() => togglePanel("sort")}

    >

      <SortPillList

        value={filters.sort}

        onChange={(value) => update({ sort: value })}

      />

    </ExpandableFilterField>

  );



  const categoryField = (

    <ExpandableFilterField

      label="Category"

      value={filters.category}

      isOpen={openPanel === "category"}

      onToggle={() => togglePanel("category")}

    >

      <PillList

        options={OPPORTUNITY_CATEGORIES}

        value={filters.category}

        onChange={(value) =>

          update({ category: value as OpportunityCategory })

        }

      />

    </ExpandableFilterField>

  );



  const locationField = (

    <ExpandableFilterField

      label="Location"

      value={filters.location}

      isOpen={openPanel === "location"}

      onToggle={() => togglePanel("location")}

    >

      <PillList

        options={OPPORTUNITY_LOCATIONS.filter((item) => item !== "All Locations")}

        value={filters.location}

        onChange={(value) =>

          update({ location: value as OpportunityLocation })

        }

      />

    </ExpandableFilterField>

  );



  const resetButton = (

    <button

      type="button"

      onClick={handleReset}

      className="w-full rounded-[12px] bg-[#252525] px-4 py-3 font-plusJakartaSans text-[14px] font-medium text-white transition-colors hover:bg-[#111111]"

    >

      Reset Filters

    </button>

  );



  if (layout === "mobile") {

    return (

      <div className="space-y-4">

        <div className="flex items-center gap-3">

          <div className="min-w-0 flex-1">{searchField}</div>

          <button

            type="button"

            onClick={handleReset}

            className="shrink-0 rounded-[12px] bg-[#252525] px-4 py-3 font-plusJakartaSans text-[13px] font-medium text-white"

          >

            Reset Filters

          </button>

        </div>



        <div className="space-y-4">

          {sortField}

          {categoryField}

          {locationField}

        </div>

      </div>

    );

  }



  return (

    <aside className="w-full shrink-0 rounded-[16px] border border-[#E8E8EA] bg-[#FAFAFA] px-4 pb-4 pt-6 lg:w-[320px]">

      <div className="flex flex-col gap-8">

        {searchField}

        {sortField}

        {categoryField}

        {locationField}

        {resetButton}

      </div>

    </aside>

  );

}



export const DEFAULT_OPPORTUNITY_FILTERS: OpportunityFiltersState = {

  search: "",

  sort: "recent",

  category: "All Opportunities",

  location: "All Locations",

};



export { getSortLabel };

