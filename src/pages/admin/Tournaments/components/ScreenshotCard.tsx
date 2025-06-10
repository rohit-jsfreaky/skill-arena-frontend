import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Screenshot } from "../useAdminTournamentReview";

interface ScreenshotCardProps {
  screenshot: Screenshot;
  selectedWinnerId: number | null;
  expandedOcr: number | null;
  onWinnerSelect: (userId: number) => void;
  onToggleOcr: (id: number) => void;
}

export const ScreenshotCard = ({
  screenshot,
  selectedWinnerId,
  expandedOcr,
  onWinnerSelect,
  onToggleOcr,
}: ScreenshotCardProps) => {
  return (
    <Card
      className={`overflow-hidden bg-gradient-to-r from-black to-[#1A1A1A] ${
        selectedWinnerId === screenshot.user_id ? "ring-2 ring-green-500" : " border-[#BBF429]"
      }`}
    >
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-black to-[#1A1A1A]  border-b p-4 sm:p-6">
        <div className="mb-4 sm:mb-0">
          <CardTitle className="text-lg sm:text-xl text-white">
            {screenshot.user_name || screenshot.username}
          </CardTitle>
          <p className="text-sm sm:text-base text-gray-500">
            {screenshot.email}
          </p>
        </div>
        <StatusBadge status={screenshot.verification_status} />
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="mb-4">
          <img
            src={`${screenshot.screenshot_path}`}
            alt={`${screenshot.user_name || screenshot.username}'s screenshot`}
            className="w-full rounded-lg shadow-sm object-cover max-h-64 sm:max-h-80"
          />
        </div>

        <div className="mb-4">
          <div
            className="bg-gray-50 p-3 rounded text-sm sm:text-base text-gray-700 cursor-pointer flex justify-between items-center"
            onClick={() => onToggleOcr(screenshot.id)}
          >
            <span>OCR Result</span>
            {expandedOcr === screenshot.id ? (
              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </div>

          {expandedOcr === screenshot.id && (
            <div className="mt-2 p-3 bg-gray-50 text-xs sm:text-sm font-mono overflow-auto max-h-40 rounded">
              {screenshot.ocr_result || "No OCR text detected"}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between mt-4 gap-2 sm:gap-4">
          <Button
            variant={
              selectedWinnerId === screenshot.user_id ? "default" : "outline"
            }
            className={`w-full sm:w-auto ${
              selectedWinnerId === screenshot.user_id
                ? "bg-green-600 hover:bg-green-700"
                : ""
            }`}
            onClick={() => onWinnerSelect(screenshot.user_id)}
          >
            {selectedWinnerId === screenshot.user_id ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Selected as Winner
              </>
            ) : (
              "Select as Winner"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
