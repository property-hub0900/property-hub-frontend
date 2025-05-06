"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { companyService } from "@/services/protected/company"
import { getErrorMessage } from "@/utils/utils"
import { useTranslations } from "next-intl"

interface RefundConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    transactionId: string
    propertyTitle: string
    points: number
    onSuccess: () => void
}

export function RefundConfirmationDialog({
    isOpen,
    onClose,
    transactionId,
    propertyTitle,
    points,
    onSuccess,
}: RefundConfirmationDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [dir, setDir] = useState<"ltr" | "rtl">("ltr")
    const t = useTranslations()

    // Detect document direction
    useEffect(() => {
        if (typeof document !== "undefined") {
            const documentDir = document.documentElement.dir || document.dir || "ltr"
            setDir(documentDir as "ltr" | "rtl")
        }
    }, [])

    const handleRefund = async () => {
        setIsLoading(true)
        try {
            const response = await companyService.refundPoints(transactionId)
            toast.success(response.message || t("refund.success") || "Refund successful")
            onSuccess()
            onClose()
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]" dir={dir}>
                <DialogHeader className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500"
                        >
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="M12 8v4" />
                            <path d="M12 16h.01" />
                        </svg>
                    </div>
                    <DialogTitle>{t("refund.title") || "Refund Request"}</DialogTitle>
                    <DialogDescription>
                        {t("refund.description", { points, propertyTitle }) ||
                            `Are you sure you want to refund ${points} points for "${propertyTitle}"?`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row justify-center gap-2 sm:justify-center">
                    <Button variant="outline" onClick={onClose}>
                        {t("button.cancel") || "Cancel"}
                    </Button>
                    <Button onClick={handleRefund} disabled={isLoading}>
                        {isLoading ? t("button.processing") || "Processing..." : t("button.confirm") || "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
