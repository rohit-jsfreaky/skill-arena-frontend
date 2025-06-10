import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    classNames: {
      toast: "bg-green-100! border border-green-500! text-green-700!",
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    classNames: {
      toast: "bg-red-100! border border-red-500! text-red-700!",
    },
  });
};
