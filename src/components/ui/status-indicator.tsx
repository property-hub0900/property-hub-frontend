import type React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/utils"

const statusVariants = cva("inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium", {
    variants: {
        variant: {
            default: "bg-white shadow-sm border",
            solid: "text-white",
            subtle: "bg-opacity-10",
            outline: "border",
        },
        status: {
            active: "",
            inactive: "",
            expired: "",
            pending: "",
            draft: "",
            archived: "",
            rejected: "",
            info: "",
        },
    },
    compoundVariants: [
        // Default variant
        { variant: "default", status: "active", class: "border-green-200" },
        { variant: "default", status: "expired", class: "border-red-200" },
        { variant: "default", status: "pending", class: "border-yellow-200" },
        { variant: "default", status: "draft", class: "border-gray-200" },
        { variant: "default", status: "archived", class: "border-gray-200" },
        { variant: "default", status: "rejected", class: "border-red-200" },
        { variant: "default", status: "info", class: "border-blue-200" },

        // Solid variant
        { variant: "solid", status: "active", class: "bg-green-500" },
        { variant: "solid", status: "expired", class: "bg-red-500" },
        { variant: "solid", status: "pending", class: "bg-yellow-500" },
        { variant: "solid", status: "draft", class: "bg-gray-500" },
        { variant: "solid", status: "archived", class: "bg-gray-500" },
        { variant: "solid", status: "rejected", class: "bg-red-500" },
        { variant: "solid", status: "info", class: "bg-blue-500" },

        // Subtle variant
        { variant: "subtle", status: "active", class: "bg-green-50 text-green-700" },
        { variant: "subtle", status: "expired", class: "bg-red-50 text-red-700" },
        { variant: "subtle", status: "pending", class: "bg-yellow-50 text-yellow-700" },
        { variant: "subtle", status: "draft", class: "bg-gray-50 text-gray-700" },
        { variant: "subtle", status: "archived", class: "bg-gray-50 text-gray-700" },
        { variant: "subtle", status: "rejected", class: "bg-red-50 text-red-700" },
        { variant: "subtle", status: "info", class: "bg-blue-50 text-blue-700" },

        // Outline variant
        { variant: "outline", status: "active", class: "border-green-500 text-green-700" },
        { variant: "outline", status: "expired", class: "border-red-500 text-red-700" },
        { variant: "outline", status: "pending", class: "border-yellow-500 text-yellow-700" },
        { variant: "outline", status: "draft", class: "border-gray-500 text-gray-700" },
        { variant: "outline", status: "archived", class: "border-gray-500 text-gray-700" },
        { variant: "outline", status: "rejected", class: "border-red-500 text-red-700" },
        { variant: "outline", status: "info", class: "border-blue-500 text-blue-700" },
    ],
    defaultVariants: {
        variant: "default",
        status: "info",
    },
})

const dotVariants = cva("h-2.5 w-2.5 rounded-full", {
    variants: {
        status: {
            active: "bg-green-500",
            inactive: "bg-gray-500",
            expired: "bg-red-500",
            pending: "bg-yellow-500",
            draft: "bg-gray-500",
            archived: "bg-gray-500",
            rejected: "bg-red-500",
            info: "bg-blue-500",
            success: "bg-green-500",
        },
    },
    defaultVariants: {
        status: "info",
    },
})

export interface StatusIndicatorProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
    label?: string
    showDot?: boolean
    dotClassName?: string
    labelClassName?: string
}

export function StatusIndicator({
    className,
    variant,
    status,
    label,
    showDot = true,
    dotClassName,
    labelClassName,
    ...props
}: StatusIndicatorProps) {
    const displayLabel = label || (status ? status.charAt(0).toUpperCase() + status.slice(1) : "")

    return (
        <div className={cn(statusVariants({ variant, status, className }))} {...props}>
            {showDot && <span className={cn(dotVariants({ status }), dotClassName)} />}
            <span className={cn("whitespace-nowrap", labelClassName)}>{displayLabel}</span>
        </div>
    )
}

export { statusVariants }
