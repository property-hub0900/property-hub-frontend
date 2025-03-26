/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
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
export function buildQueryString(params: Record<string, any>): string {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return filtered;
}
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
