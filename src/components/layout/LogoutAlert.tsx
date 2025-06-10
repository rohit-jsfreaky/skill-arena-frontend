import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import React from "react";
import { NavigateFunction } from "react-router";

interface LogoutAlertProps {
  alertOpen: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  signOut: () => void;
  navigate: NavigateFunction;
}

const LogoutAlert: React.FC<LogoutAlertProps> = ({
  alertOpen,
  setAlertOpen,
  signOut,
  navigate,
}) => {
  return (
    <AlertDialog open={alertOpen}>
      <AlertDialogContent className="bg-gradient-to-r from-[#EAFFA9] to-[#BBF429]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out of your account. This action cannot be
            undone.
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
          <Button
            variant={"destructive"}
            onClick={() => {
              navigate("/");
              signOut();
            }}
          >
            Logout
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutAlert;
