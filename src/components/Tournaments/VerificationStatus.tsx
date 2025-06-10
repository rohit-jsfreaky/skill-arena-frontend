import { Progress } from "@/components/ui/progress";

interface VerificationStatusProps {
  screenshotsSubmitted: number;
  totalParticipants: number;
  prizePool: number;
}

export const VerificationStatus = ({
  screenshotsSubmitted,
  totalParticipants,
  prizePool,
}: VerificationStatusProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-white">Verification Status</h2>
      <div className="mb-4">
        <div className="flex justify-between text-sm  mb-2 text-white">
          <span>Screenshots Submitted</span>
          <span>
        {screenshotsSubmitted} of {totalParticipants}
          </span>
        </div>
        <Progress
          value={(screenshotsSubmitted / totalParticipants) * 100}
          className="bg-white"
          
          
        />
      </div>

      <div className="p-4 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] rounded-lg ">
        <h3 className="font-medium mb-2 text-white">How verification works:</h3>
        <ul className="text-sm text-[#eaffa9] space-y-2 list-disc pl-5">
          <li>Upload a screenshot showing your tournament results</li>
          <li>
            Our system will analyze the image to verify your win or loss
          </li>
          <li>
            If there's exactly one winner, prizes are awarded
            automatically
          </li>
          <li>
            If multiple winners are detected, an admin will review all
            submissions
          </li>
          <li>Prize pool: ${prizePool}</li>
        </ul>
      </div>
    </>
  );
};