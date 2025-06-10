import { Button } from "@/components/ui/button";

const StatsAndHistory = () => {
  return (
    <div className="w-full flex flex-col  gap-5">
      <Button className="rounded-2xl text-black border-2 border-[#BBF429] bg-[#EAFFA9] hover:bg-white transition duration-300 px-6 py-5   ">
        Reset Stats
      </Button>
      <Button className="rounded-2xl text-black border-2 border-[#BBF429] bg-[#EAFFA9] hover:bg-white transition duration-300 px-6 py-5">
       History
      </Button>
    </div>
  );
};

export default StatsAndHistory;
