import { useState } from "react";
import { X, Trophy, Upload, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { markNotificationAsRead } from "@/api/userNotifications";

interface TournamentNotification {
  id: number;
  title: string;
  body: string;
  data: {
    tournament_id: string;
    type: string;
    action_url: string;
  };
  sent_at: string;
}

interface TournamentCompletionModalProps {
  notifications: TournamentNotification[];
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

const TournamentCompletionModal = ({
  notifications,
  isOpen,
  onClose,
  userId,
}: TournamentCompletionModalProps) => {
  const navigate = useNavigate();
  const [processingNotifications, setProcessingNotifications] = useState<number[]>([]);

  const handleViewResults = async (notification: TournamentNotification) => {
    setProcessingNotifications(prev => [...prev, notification.id]);
    
    try {
      // Mark notification as read
      await markNotificationAsRead(notification.id, userId);
      
      // Navigate to tournament results
      navigate(notification.data.action_url);
      
      // Close modal
      onClose();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setProcessingNotifications(prev => prev.filter(id => id !== notification.id));
    }
  };

  const handleCloseModal = async () => {
    // Mark all notifications as read when closing
    try {
      await Promise.all(
        notifications.map(notification => 
          markNotificationAsRead(notification.id, userId)
        )
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
    onClose();
  };

  if (!isOpen || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-black to-[#1A1A1A] border-[#BBF429] w-full max-w-lg max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-[#BBF429]" />
            <h2 className="text-xl font-bold text-white">
              Tournament{notifications.length > 1 ? 's' : ''} Completed!
            </h2>
          </div>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {notifications.length === 1 ? (
            // Single tournament notification
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#BBF429] rounded-full flex items-center justify-center mx-auto">
                <Trophy className="h-8 w-8 text-black" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {notifications[0].title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {notifications[0].body}
                </p>
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <Button
                  onClick={() => handleViewResults(notifications[0])}
                  disabled={processingNotifications.includes(notifications[0].id)}
                  className="bg-[#BBF429] text-black hover:bg-[#9FD424] flex items-center gap-2"
                >
                  {processingNotifications.includes(notifications[0].id) ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload Screenshot
                </Button>
                
                <Button
                  onClick={handleCloseModal}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Later
                </Button>
              </div>
            </div>
          ) : (
            // Multiple tournaments notification
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#BBF429] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {notifications.length} Tournaments Completed!
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  Upload your screenshots to claim your prizes
                </p>
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium mb-1">
                          Tournament Completed
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(notification.sent_at).toLocaleString()}
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => handleViewResults(notification)}
                        disabled={processingNotifications.includes(notification.id)}
                        size="sm"
                        className="bg-[#BBF429] text-black hover:bg-[#9FD424] text-xs px-3 py-1 h-8 flex items-center gap-1"
                      >
                        {processingNotifications.includes(notification.id) ? (
                          <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleCloseModal}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TournamentCompletionModal;