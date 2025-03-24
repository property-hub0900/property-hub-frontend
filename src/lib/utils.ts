import { fetchUrl } from "@/services/common";
import { PropertyFilters } from "@/types/client/properties";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (e: unknown): string => {
  if (
    typeof e === "object" &&
    e &&
    "response" in e &&
    typeof e.response === "object" &&
    e.response &&
    "data" in e.response &&
    typeof e.response.data === "object" &&
    e.response.data &&
    "message" in e.response.data &&
    typeof e.response.data.message === "string"
  ) {
    return e.response.data.message; // Extracts "Invalid credentials"
  }

  if (
    typeof e === "object" &&
    e &&
    "message" in e &&
    typeof e.message === "string"
  ) {
    return e.message; // Handles cases where message is in AxiosError itself
  }

  return "Something went wrong";
};

export const formatDateAndTime = (dateStr: string): string => {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat("en-QA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  }).format(date);
};

export const formatAmountToQAR = (amount: number): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    useGrouping: true, // Ensures thousand separators
    minimumFractionDigits: 0, // No decimals
  });

  return `QAR ${formatter.format(amount)}`;
};

// Helper function to build query string from filters
export function buildQueryString(filters: PropertyFilters): string {
  const params = new URLSearchParams();

  if (filters.location) params.append("location", filters.location);
  if (filters.propertyType && filters.propertyType !== "Property Type") {
    params.append("type", filters.propertyType);
  }
  if (filters.bedsAndBath && filters.bedsAndBath !== "Beds & Bath") {
    // Extract number of beds from string like "2+ Beds"
    const bedsMatch = filters.bedsAndBath.match(/(\d+)\+\s*Beds?/i);
    if (bedsMatch && bedsMatch[1]) {
      params.append("minBeds", bedsMatch[1]);
    }
  }
  if (filters.price && filters.price !== "Price") {
    if (filters.price.includes("-")) {
      const [minStr, maxStr] = filters.price.split("-");
      const min = Number.parseInt(minStr.replace(/,/g, ""));
      const max = Number.parseInt(maxStr.replace(/,/g, ""));
      if (!isNaN(min)) params.append("minPrice", min.toString());
      if (!isNaN(max)) params.append("maxPrice", max.toString());
    } else if (filters.price.includes("+")) {
      const min = Number.parseInt(
        filters.price.replace(/,/g, "").replace("+", "")
      );
      if (!isNaN(min)) params.append("minPrice", min.toString());
    }
  }
  if (filters.rent && filters.rent !== "Rent") {
    params.append("listingType", filters.rent.toLowerCase());
  }

  // Pagination
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());

  return params.toString();
}
