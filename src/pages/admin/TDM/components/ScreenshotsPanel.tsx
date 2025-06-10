import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TdmScreenshot } from '@/interface/tdmMatches';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye, Trophy, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ScreenshotsPanelProps = {
  screenshots: TdmScreenshot[];
  selectedWinnerTeamId: number | null;
  onSelectWinner: (teamId: number) => void;
  prizeAlreadyAwarded?: boolean; // Add this prop to check if prize is already awarded
};

export const ScreenshotsPanel = ({ 
  screenshots, 
  selectedWinnerTeamId, 
  onSelectWinner,
  prizeAlreadyAwarded = false // Default to false if not provided
}: ScreenshotsPanelProps) => {
  const [expandedOcr, setExpandedOcr] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Helper functions
  const toggleOcr = (id: number) => {
    if (expandedOcr === id) {
      setExpandedOcr(null);
    } else {
      setExpandedOcr(id);
    }
  };
  
  const openImageViewer = (imagePath: string) => {
    setActiveImage(imagePath);
    setViewerOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified_win':
        return <Badge className="bg-green-600">Verified Win</Badge>;
      case 'verified_loss':
        return <Badge className="bg-red-600">Verified Loss</Badge>;
      case 'disputed':
        return <Badge className="bg-amber-600">Disputed</Badge>;
      case 'admin_reviewed':
        return <Badge className="bg-indigo-600">Admin Reviewed</Badge>;
      default:
        return <Badge className="bg-gray-600">Pending</Badge>;
    }
  };
  
  // Group screenshots by team
  const getTeamName = (screenshot: TdmScreenshot) => {
    return `Team ${screenshot.team_id}`;
  };
  
  if (screenshots.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
        <CardHeader>
          <CardTitle className="text-[#BBF429]">Match Screenshots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-gray-500">
            No screenshots have been uploaded for this match
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-[#BBF429]">Match Screenshots ({screenshots.length})</span>
            {prizeAlreadyAwarded && (
              <Badge className="bg-green-600 flex items-center gap-1">
                <Lock size={12} /> Winner Selected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {screenshots.map((screenshot) => (
            <div 
              key={screenshot.id} 
              className={`bg-black/30 p-3 sm:p-4 rounded-lg border ${
                selectedWinnerTeamId === screenshot.team_id 
                  ? 'border-green-500' 
                  : 'border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{screenshot.username}</span>
                  {getStatusBadge(screenshot.verification_status)}
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429] hover:text-black flex-1 sm:flex-auto"
                    onClick={() => openImageViewer(screenshot.screenshot_path)}
                  >
                    <Eye size={16} className="mr-1" /> View
                  </Button>
                  
                  {prizeAlreadyAwarded ? (
                    <Button 
                      variant="outline"
                      size="sm"
                      disabled
                      className="flex-1 sm:flex-auto bg-gray-800 opacity-60 cursor-not-allowed"
                    >
                      <Lock size={16} className="mr-1" />
                      <span className="hidden sm:inline">Finalized</span>
                      <span className="sm:hidden">Locked</span>
                    </Button>
                  ) : (
                    <Button 
                      variant={selectedWinnerTeamId === screenshot.team_id ? "default" : "outline"}
                      size="sm"
                      className={`flex-1 sm:flex-auto ${selectedWinnerTeamId === screenshot.team_id 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429] hover:text-black"}`}
                      onClick={() => onSelectWinner(screenshot.team_id)}
                    >
                      <Trophy size={16} className="mr-1" />
                      <span className="hidden sm:inline">{selectedWinnerTeamId === screenshot.team_id ? 'Selected' : 'Select Team'}</span>
                      <span className="sm:hidden">{selectedWinnerTeamId === screenshot.team_id ? 'Selected' : 'Select'}</span>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mb-2 aspect-video bg-black rounded overflow-hidden">
                <img 
                  src={screenshot.screenshot_path} 
                  alt={`Game screenshot by ${screenshot.username}`} 
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              
              <div 
                className="bg-black p-2 sm:p-3 rounded cursor-pointer flex justify-between items-center text-xs sm:text-sm"
                onClick={() => toggleOcr(screenshot.id)}
              >
                <span>OCR Results</span>
                {expandedOcr === screenshot.id 
                  ? <ChevronUp size={16} /> 
                  : <ChevronDown size={16} />
                }
              </div>
              
              {expandedOcr === screenshot.id && (
                <div className="mt-2 p-2 sm:p-3 bg-black/70 text-xs font-mono overflow-auto max-h-32 sm:max-h-40 rounded">
                  {screenshot.ocr_result || "No OCR text detected"}
                </div>
              )}
              
              {screenshot.admin_notes && (
                <div className="mt-2 p-2 sm:p-3 bg-indigo-900/20 border-l-4 border-indigo-500 rounded">
                  <h4 className="text-xs sm:text-sm font-medium text-indigo-300">Admin Notes:</h4>
                  <p className="text-xs text-gray-300 mt-1">{screenshot.admin_notes}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Image Viewer Dialog */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="bg-black border-[#BBF429] max-w-[90vw] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">Screenshot Viewer</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-[50vh] sm:h-[60vh]">
            <img 
              src={activeImage} 
              alt="Screenshot full view" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};