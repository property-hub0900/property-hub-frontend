import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type ContainerProps = {
    children: ReactNode
    className?: string
    alignment?: "left" | "center" | "right"
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "screen"

}

export function Container({ children, className, alignment = "left", maxWidth = "xl" }: ContainerProps) {
    const alignmentClasses = {
        left: "items-start",
        center: "items-center",
        right: "items-end",
    }

    const maxWidthClasses = {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        full: "max-w-full",
        screen: "w-screen",
    }

    return (
        <div
            className={cn(
                "w-full px-4 sm:px-6 lg:px-8 mx-auto",
                alignmentClasses[alignment],
                maxWidthClasses[maxWidth],
                className,
            )}
        >
            {children}
        </div>
    )
}

