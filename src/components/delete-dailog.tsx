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

interface DeleteDialogProps {
    title,
    deleteConfirmation
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onDelete: () => void
    isSubmitting: boolean
}

export function DeleteDialog({ title, deleteConfirmation, isOpen, onOpenChange, onDelete, isSubmitting }: DeleteDialogProps) {
    const t = useTranslations()

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {deleteConfirmation}
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

