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

type DeleteTournamentModalProps = {
  alertOpen: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteTournament: () => void;
  deleteLoading: boolean
};

const DeleteTournamentModal = ({
  alertOpen,
  setAlertOpen,
  deleteTournament,
  deleteLoading
}: DeleteTournamentModalProps) => {
  return (
    <AlertDialog open={alertOpen}>
      <AlertDialogContent className="bg-gradient-to-r from-[#EAFFA9] to-[#BBF429]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            The Tournament will be Deleted. This action cannot be undone.
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
          <Button variant={"destructive"} onClick={deleteTournament}>
            {
              deleteLoading ? (
                <LoadingSpinner color="white" size={16}/>
              ) : (
                "Delete Tournament"
              )
            }
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTournamentModal;
