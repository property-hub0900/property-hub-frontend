import { USER_ROLES } from "@/constants/rbac";
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
    .filter(([, value]) => value !== undefined && value !== null)
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

export const extractFirebaseStoragePath = (url) => {
  // Create a URL object to parse the URL
  const urlObj = new URL(url);

  // Get the path after `/o/` and decode it
  const encodedPath = urlObj.pathname.split("/o/")[1];
  const decodedPath = decodeURIComponent(encodedPath);

  return decodedPath;
};

export function formatNumber(num: number | string): string {
  return Number(num).toLocaleString(); // defaults to en-US
}

export const convertSavedSearchToURL = (jsonString: string): string => {
  try {
    // Parse the JSON string to an object
    const filters = JSON.parse(jsonString);

    // Create URL parameters
    const params = new URLSearchParams();

    // Add each filter parameter to the URL
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // For array values like amenitiesIds or furnishedType, join with commas
        params.set(key, value.join(","));
      } else {
        params.set(key, String(value));
      }
    });

    return `?${params.toString()}`;
  } catch (error) {
    console.error("Error parsing saved search query:", error);
    return "";
  }
};


export function calculateRemainingDays(endDate: string | undefined): number {
  if (!endDate) return 0; // Return 0 if endDate is undefined or invalid

  const today = new Date();
  const subscriptionEnd = new Date(endDate);

  // Calculate the difference in milliseconds
  const differenceInTime = subscriptionEnd.getTime() - today.getTime();

  // Convert to days and round up to include the current day
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  // Return 0 if the date has passed or is invalid
  return differenceInDays > 0 ? differenceInDays : 0;
}

// map manager to admin
export const mapManagerToAdmin = (role: string): string => {
  if (role === USER_ROLES.MANAGER) {
    return USER_ROLES.ADMIN;
  } else if (role === USER_ROLES.ADMIN) {
    return USER_ROLES.ADMIN;
  } else {
    return role;
  }
};


export function groupByThreeDigits(num: number | string): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}