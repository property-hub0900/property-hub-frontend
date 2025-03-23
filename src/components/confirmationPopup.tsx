import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface IConfirmationPopupProps {
  title?: string;
  description?: string;
  trigger: React.ReactNode;
  onConfirm: () => void | Promise<void>;
}

export const ConfirmationPopup = (props: IConfirmationPopupProps) => {
  const { title, description, trigger, onConfirm } = props;
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-10 px-8">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="h-10 px-8 bg-destructive hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
