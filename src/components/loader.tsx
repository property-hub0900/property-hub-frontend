import { cn } from "@/utils/utils";
import { LoaderCircle } from "lucide-react";

interface LoaderProps {
  isLoading: boolean;
  variant?: "fixed" | "inline";
}

export const Loader = ({
  isLoading = false,
  variant = "fixed",
}: LoaderProps) => {
  if (!isLoading) return null;
  return (
    <div
      className={cn(
        `${
          variant === "inline" ? "absolute" : "fixed"
        } inset-0 flex items-center justify-center bg-background/60 backdrop-blur-xs z-50 w-full h-full`
      )}
    >
      <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
};
