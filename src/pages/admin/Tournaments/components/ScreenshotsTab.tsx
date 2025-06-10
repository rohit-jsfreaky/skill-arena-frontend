import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { ScreenshotCard } from "./ScreenshotCard";
import { Screenshot } from "../useAdminTournamentReview";

interface ScreenshotsTabProps {
  screenshots: Screenshot[];
  emptyMessage: string;
  selectedWinnerId: number | null;
  expandedOcr: number | null;
  onWinnerSelect: (userId: number) => void;
  onToggleOcr: (id: number) => void;
}

export const ScreenshotsTab = ({
  screenshots,
  emptyMessage,
  selectedWinnerId,
  expandedOcr,
  onWinnerSelect,
  onToggleOcr,
}: ScreenshotsTabProps) => {
  if (screenshots.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429]">
        <CardContent className="p-8 text-center">
          <div className="text-yellow-500 mb-4">
            <AlertTriangle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium mb-2 text-white">{emptyMessage}</h3>
          <p className="text-[#EAFFA9]">
            There are no screenshots available in this category.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {screenshots.map((screenshot) => (
        <ScreenshotCard
          key={screenshot.id}
          screenshot={screenshot}
          selectedWinnerId={selectedWinnerId}
          expandedOcr={expandedOcr}
          onWinnerSelect={onWinnerSelect}
          onToggleOcr={onToggleOcr}
        />
      ))}
    </div>
  );
};