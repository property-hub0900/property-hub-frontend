import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";

// UI Components from shadcn/ui
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Define the props interface with proper TypeScript typing
interface ConfirmationDialogProps {
    /** The element that triggers the dialog (e.g., a Delete button) */
    trigger: React.ReactNode;
    /** Dialog title (e.g., "Are you sure?") */
    title: string;
    /** Dialog description (e.g., "Are you sure you want to delete this staff member?") */
    description: string;
    /** Callback function to execute when the Confirm button is clicked */
    onConfirm: () => void;
    /** Optional callback function to execute when the Cancel button is clicked */
    onCancel?: () => void;
    /** Optional custom label for the Confirm button */
    confirmLabel?: string;
    /** Optional custom label for the Cancel button */
    cancelLabel?: string;
}

/**
 * A reusable confirmation dialog component with a warning icon, centered message,
 * and responsive Cancel/Confirm buttons. Supports Arabic translations via next-intl.
 */
export function ConfirmationDialog({
    trigger,
    title,
    description,
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
}: ConfirmationDialogProps) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);

    // Handle confirm action: execute callback and close dialog
    const handleConfirm = () => {
        onConfirm();
        setOpen(false);
    };

    // Handle cancel action: execute optional callback and close dialog
    const handleCancel = () => {
        onCancel?.();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {/* Dialog Header with centered icon and text */}
                <DialogHeader className="flex flex-col items-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <AlertCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <DialogTitle className="text-center">{title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {/* Dialog Footer with responsive buttons */}
                <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="w-full sm:w-auto"
                    >
                        {cancelLabel ?? t("button.cancel")} {/* "إلغاء" in Arabic */}
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleConfirm}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                    >
                        {confirmLabel ?? t("button.confirm")} {/* "تأكيد" in Arabic */}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}