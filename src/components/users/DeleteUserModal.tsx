import { LoadingSpinner } from "@/components/my-ui/Loader";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type DeleteUserModalProps = {
  alertOpen: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteUser: () => void;
  deleteLoading: boolean;
};

const DeleteUserModal = ({
  alertOpen,
  setAlertOpen,
  deleteUser,
  deleteLoading
}: DeleteUserModalProps) => {
  return (
    <AlertDialog open={alertOpen}>
      <AlertDialogContent className="bg-gradient-to-r from-[#EAFFA9] to-[#BBF429]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This user account will be permanently deleted. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setAlertOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button variant={"destructive"} onClick={deleteUser}>
            {
              deleteLoading ? (
                <LoadingSpinner color="white" size={16}/>
              ) : (
                "Delete User"
              )
            }
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserModal;