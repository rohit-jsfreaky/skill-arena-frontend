import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/my-ui/Loader";

interface DeleteMembershipDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  processing: boolean;
}

const DeleteMembershipDialog: React.FC<DeleteMembershipDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  processing,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#1A1A1A] text-white border-[#BBF429]/30">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Membership</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Are you sure you want to delete this membership? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-transparent text-white border-gray-600 hover:bg-gray-800 hover:text-white"
            disabled={processing}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={processing}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {processing ? (
              <div className="flex items-center">
                <LoadingSpinner color="white" size={16} />
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMembershipDialog;
