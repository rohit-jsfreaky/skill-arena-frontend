import { Button } from "@/components/ui/button";

const AccountActions = ({
  setAlertOpen,
  setSelectedOption,
}: {
  setAlertOpen: (open: boolean) => void;
  setSelectedOption: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <>
      <div className="mt-8 mx-4 bg-black/30 backdrop-blur-sm border border-[#BBF429]/20 rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-[#BBF429] font-semibold text-lg">
              Account Actions
            </h3>
            <p className="text-gray-400 text-sm">
              Manage your account statistics and history
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-[#BBF429]/20 hover:bg-[#BBF429]/30 text-[#BBF429] border border-[#BBF429]/40"
              onClick={() => setSelectedOption(4)}
            >
              View History
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="destructive"
          className="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/40"
          onClick={() => setAlertOpen(true)}
        >
          Sign Out
        </Button>
      </div>
    </>
  );
};

export default AccountActions;
