import { useState, useEffect, useCallback } from "react";
import { X, Trophy, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getRecentTournamentCompletions, markNotificationAsRead } from "@/api/userNotifications";
import { useMYUser } from "@/context/UserContext";

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

const HomeTournamentNotifications = () => {
  const [notifications, setNotifications] = useState<TournamentNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { myUser } = useMYUser();

  const fetchTournamentCompletions = useCallback(async () => {
    if (!myUser?.id) return;
    
    setLoading(true);
    try {
      const response = await getRecentTournamentCompletions(myUser.id);
      
      if (response.success && response.data.length > 0) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching tournament completions:", error);
    } finally {
      setLoading(false);
    }
  }, [myUser?.id]);

  const handleViewResults = async (notification: TournamentNotification) => {
    try {
      // Mark notification as read
      await markNotificationAsRead(notification.id, myUser?.id || 0);
      
      // Navigate to tournament results
      navigate(notification.data.action_url);
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  const handleDismiss = async (notification: TournamentNotification) => {
    try {
      // Mark notification as read
      await markNotificationAsRead(notification.id, myUser?.id || 0);
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };

  const handleDismissAll = async () => {
    try {
      // Mark all notifications as read
      await Promise.all(
        notifications.map(notification => 
          markNotificationAsRead(notification.id, myUser?.id || 0)
        )
      );
      
      // Clear local state
      setNotifications([]);
    } catch (error) {
      console.error("Error dismissing all notifications:", error);
    }
  };

  // Fetch notifications when component mounts and user is available
  useEffect(() => {
    if (myUser?.id) {
      fetchTournamentCompletions();
    }
  }, [myUser?.id, fetchTournamentCompletions]);

  // Don't render anything if no notifications or still loading
  if (loading || notifications.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#BBF429]/10 to-transparent border-b border-[#BBF429]/20">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-7 w-7 text-[#BBF429] animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                🎉 Tournament{notifications.length > 1 ? 's' : ''} Completed!
              </h2>
              <p className="text-gray-300 text-sm">
                {notifications.length} tournament{notifications.length > 1 ? 's' : ''} ready for screenshot upload
              </p>
            </div>
          </div>
          <Button
            onClick={handleDismissAll}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            Dismiss All
          </Button>
        </div>

        {/* Notifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className="bg-gradient-to-br from-gray-900/90 to-black/90 border-[#BBF429]/50 p-5 relative overflow-hidden hover:border-[#BBF429] transition-all duration-300 backdrop-blur-sm"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#BBF429]/10 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#BBF429]/5 rounded-full translate-y-4 -translate-x-4" />
              
              {/* Close button */}
              <button
                onClick={() => handleDismiss(notification)}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors z-10 hover:bg-gray-800/50 rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Content */}
              <div className="space-y-4 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#BBF429]/20 rounded-full flex items-center justify-center flex-shrink-0 border border-[#BBF429]/30">
                    <Trophy className="h-6 w-6 text-[#BBF429]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-base">
                      Tournament Completed!
                    </h3>
                    <p className="text-gray-300 text-sm mt-1 line-clamp-3">
                      {notification.body}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-400 bg-gray-800/30 px-2 py-1 rounded">
                  📅 {new Date(notification.sent_at).toLocaleString()}
                </div>

                <Button
                  onClick={() => handleViewResults(notification)}
                  className="w-full bg-[#BBF429] text-black hover:bg-[#9FD424] font-semibold text-sm h-10 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Upload className="h-4 w-4" />
                  Upload Screenshot & Claim Prize
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Footer note */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            💡 Upload your screenshots within 24 hours to claim your prizes!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeTournamentNotifications;