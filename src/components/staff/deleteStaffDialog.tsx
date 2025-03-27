"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl"

interface DeleteStaffDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onDelete: () => void
    isSubmitting: boolean
}

export function DeleteStaffDialog({ isOpen, onOpenChange, onDelete, isSubmitting }: DeleteStaffDialogProps) {
    const t = useTranslations()

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("title.deleteAgent") || "Delete Agent"}</DialogTitle>
                    <DialogDescription>
                        {t("text.deleteConfirmation") ||
                            "Are you sure you want to delete this agent? This action cannot be undone."}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        {t("button.cancel") || "Cancel"}
                    </Button>
                    <Button type="button" variant="destructive" onClick={onDelete} disabled={isSubmitting}>
                        {isSubmitting ? t("button.deleting") || "Deleting..." : t("button.delete") || "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

