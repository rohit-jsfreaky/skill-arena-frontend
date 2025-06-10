import { StatusBadge } from "./StatusBadge";
import { Screenshot } from "@/hooks/useUserTournamentResult";

interface UserSubmissionProps {
  screenshot: Screenshot;
}

export const UserSubmission = ({ screenshot }: UserSubmissionProps) => {
  return (
    <div>
      <div className="mb-4 ">
        <StatusBadge status={screenshot.verification_status} />
      </div>
      <div className="mb-4">
        <img
          src={`${screenshot.screenshot_path}`}
          alt="Your screenshot"
          className="w-full rounded-lg shadow-md"
        />
      </div>
      <p className="text-sm text-gray-600">
        Submitted:{" "}
        {new Date(screenshot.upload_timestamp).toLocaleString()}
      </p>
    </div>
  );
};