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
