import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMYUser } from "@/context/UserContext";
import { applyReferral } from "@/api/user";
import { toast } from "sonner";

interface ReferDialogProps {
  referAlertOpen: boolean;
  setReferAlertOpen: (value: boolean) => void;
  referCode: string;
  setReferCode: (value: string) => void;
}

const ReferDialog = ({
  referAlertOpen,
  setReferAlertOpen,
  referCode,
  setReferCode,
}: ReferDialogProps) => {
  const { myUser } = useMYUser();

  const handleApplyRefferal = async () => {
    if (myUser) {
      console.log(myUser.email);
      console.log(referCode);

      const result = await applyReferral(myUser.email, referCode);

      if (result.success) {
        toast.success(result.message, {
          classNames: {
            toast: "bg-green-100! border border-green-500! text-green-700!",
          },
        });
      } else {
        toast.error(result.message, {
          classNames: {
            toast: "bg-red-100! border border-red-500! text-red-700!",
          },
        });
      }

      setReferAlertOpen(false);
    }
  };

  return (
    <AlertDialog open={referAlertOpen}>
      <AlertDialogContent className="bg-gradient-to-r from-[#EAFFA9] to-[#BBF429]">
        <AlertDialogHeader>
          <AlertDialogTitle>Referral Code (Optional)</AlertDialogTitle>
          <AlertDialogDescription className="text-[black]">
            Enter Referral Code And get Some New Player Bonus
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          value={referCode}
          onChange={(e) => {
            setReferCode(e.target.value);
          }}
          placeholder="Enter Referral Code"
          maxLength={6}
        />

        <div className="flex gap-10 justify-evenly">
          <Button
            variant={"ghost"}
            onClick={() => {
              setReferAlertOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleApplyRefferal();
            }}
            variant={"outline"}
          >
            Apply
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReferDialog;
