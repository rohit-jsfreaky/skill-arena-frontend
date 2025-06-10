import { Screenshot } from "@/hooks/useUserTournamentResult";
import { StatusBadge } from "./StatusBadge";

interface AllSubmissionsProps {
  screenshots: Screenshot[];
}

export const AllSubmissions = ({ screenshots }: AllSubmissionsProps) => {
  if (screenshots.length === 0) {
    return (
      <p className="text-gray-600">No screenshots have been submitted yet.</p>
    );
  }

  return (
    <div className="space-y-6 ">
      {screenshots.map((screenshot) => (
        <div
          key={screenshot.id}
          className="border rounded-lg overflow-hidden border-[#BBF429]"
        >
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center bg-gradient-to-r from-black to-[#1A1A1A]">
            <div className="font-medium text-white">
              {screenshot.name || screenshot.username}
            </div>
            <StatusBadge status={screenshot.verification_status} />
          </div>
          <div className="p-4">
            <img
              src={`${screenshot.screenshot_path}`}
              alt={`${screenshot.name || screenshot.username}'s screenshot`}
              className="w-full rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-2">
              Submitted:{" "}
              {new Date(screenshot.upload_timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
