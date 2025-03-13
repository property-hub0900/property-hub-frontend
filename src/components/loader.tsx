import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface LoaderProps {
  isLoading: boolean;
}

export const Loader = ({ isLoading = false }: LoaderProps) => {
  if (!isLoading) return null;
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center bg-background/60 backdrop-blur-xs z-50 w-screen h-screen"
      )}
    >
      <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
};
