import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


/**
 * Gets the initials from a name
 * @param firstName First name or full name
 * @param lastName Last name (optional)
 * @returns Initials (1-2 characters)
 */
function getInitials(firstName?: string, lastName?: string): string {
    if (!firstName) return ""

    // If we have both first and last name, return first letter of each
    if (lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    // If we only have one name, check if it contains a space (full name in one field)
    const nameParts = firstName.split(" ").filter(Boolean)
    if (nameParts.length > 1) {
        return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
    }

    // If we only have a single name, return the first letter
    return firstName.charAt(0).toUpperCase()
}

/**
 * Generates a background color based on a string (name)
 * @param name The name to generate a color for
 * @returns A tailwind background color class
 */
function getAvatarColor(name?: string): string {
    if (!name) return "bg-gray-200"

    // Generate a consistent number from the string
    const hash = name.split("").reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)

    // Use the hash to pick one of several predefined colors
    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-amber-500",
        "bg-yellow-500",
        "bg-lime-500",
        "bg-green-500",
        "bg-emerald-500",
        "bg-teal-500",
        "bg-cyan-500",
        "bg-sky-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-violet-500",
        "bg-purple-500",
        "bg-fuchsia-500",
        "bg-pink-500",
        "bg-rose-500",
    ]

    const index = Math.abs(hash) % colors.length
    return colors[index]
}


interface UserAvatarProps {
    src?: string | null
    firstName?: string
    lastName?: string
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
}

export function UserAvatar({ src, firstName, lastName, size = "md", className = "shadow-md" }: UserAvatarProps) {
    const initials = getInitials(firstName, lastName)
    const colorClass = getAvatarColor(`${firstName} ${lastName}`)

    // Size classes
    const sizeClasses = {
        sm: "h-8 w-8 text-xs",
        md: "h-12 w-12 text-sm",
        lg: "h-16 w-16 text-base",
        xl: "h-24 w-24 text-lg",
    }

    return (
        <Avatar className={`${sizeClasses[size]} ${className}`}>
            <AvatarImage src={src || ""} alt={`${firstName} ${lastName}`} />
            <AvatarFallback className={colorClass}>{initials}</AvatarFallback>
        </Avatar>
    )
}

