"use client";

import { cn } from "@/utils/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";

interface AuthContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  size?: "sm" | "lg";
}

export function AuthContainer({
  children,
  title,
  subtitle,
  size = "sm",
}: AuthContainerProps) {
  return (
    <div className="flex items-center justify-center px-5 py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "bg-card text-card-foreground rounded-md shadow-lg  max-w-full p-6 space-y-2",
          size === "sm" ? "w-md" : "w-4xl"
        )}
      >
        <div
          className="flex justify-center w-[80px] h-[80px] mx-auto rounded-xl mb-8"
          style={{
            boxShadow:
              "0px 4px 32px 0px rgba(33, 120, 103, 0.1), 0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Image
            src="/temp-logo.svg"
            alt="PropertyExplorer"
            width={48}
            height={48}
          />
        </div>
        <h1 className="text-2xl font-semibold text-center mb-0">{title}</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {subtitle}
        </p>
        {children}
      </motion.div>
    </div>
  );
}
