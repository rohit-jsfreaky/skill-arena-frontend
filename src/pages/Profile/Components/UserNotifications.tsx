import { useState, useEffect, useRef, useCallback } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { 
  getUserNotifications, 
  markAllNotificationsAsRead,
  markNotificationAsRead,
  getUnreadNotificationsCount
} from "@/api/userNotifications";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NotificationSection from "./Notifications/NotificationSection";
import EmptyNotifications from "./Notifications/EmptyNotifications";
import { Notification } from "./Notifications/NotificationItem";

interface UserNotificationsProps {
  userId: number;
}

const UserNotifications = ({ userId }: UserNotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalUnread, setTotalUnread] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastNotificationRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Group notifications by date
  const groupedNotifications = {
    today: notifications.filter(n => isToday(new Date(n.sent_at))),
    yesterday: notifications.filter(n => isYesterday(new Date(n.sent_at))),
    older: notifications.filter(n => !isToday(new Date(n.sent_at)) && !isYesterday(new Date(n.sent_at)))
  };

  // Fetch total unread count
  const fetchUnreadCount = async () => {
    const response = await getUnreadNotificationsCount(userId);
    if (response.success) {
      setTotalUnread(response.data);
    }
  };

  // Fetch notifications
  const fetchNotifications = async (page = 1, append = false) => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    
    const response = await getUserNotifications(page, 15, userId);
    
    if (response.success) {
      // If we're appending data (infinite scroll), combine with existing notifications
      if (append && page > 1) {
        setNotifications(prev => [...prev, ...response.data]);
      } else {
        setNotifications(response.data);
      }
      
      // Check if we've reached the end of the data
      setHasMore(response.data.length > 0 && page < (response.pagination?.totalPages || 1));
      setCurrentPage(page);
      
      // Update unread count after fetching notifications
      fetchUnreadCount();
    } else {
      toast.error("Failed to load notifications");
    }
    
    setLoading(false);
    setLoadingMore(false);
  };

  // Set up IntersectionObserver for infinite scroll
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return;
      
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchNotifications(currentPage + 1, true);
        }
      });
      
      if (node) {
        observer.current.observe(node);
        lastNotificationRef.current = node;
      }
    },
    [loading, loadingMore, hasMore, currentPage]
  );

  // Handle notification click (navigation)
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    
    // Navigate if route is provided
    if (notification.data?.route) {
      navigate(`/${notification.data.route}`);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (id: number) => {
    const response = await markNotificationAsRead(id, userId);
    
    if (response.success) {
      // Update local state to reflect the change
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      // Decrement unread count
      setTotalUnread(prev => Math.max(0, prev - 1));
    }
  };

  // Mark all notifications as read (not just visible ones)
  const handleMarkAllAsRead = async () => {
    const response = await markAllNotificationsAsRead(userId);
    
    if (response.success) {
      toast.success("All notifications marked as read");
      // Update all notifications to read in local state
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      // Reset unread count to zero
      setTotalUnread(0);
    } else {
      toast.error("Failed to mark notifications as read");
    }
  };

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchUnreadCount();
    }
    
    // Cleanup observer
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [userId]);

  // Date grouping for older notifications
  const getOlderNotificationsGroups = () => {
    const groups: Record<string, Notification[]> = {};
    
    groupedNotifications.older.forEach(notification => {
      const dateKey = format(new Date(notification.sent_at), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notification);
    });
    
    return Object.entries(groups).map(([date, items]) => ({
      date: format(new Date(date), 'MMMM d, yyyy'),
      notifications: items
    }));
  };
  
  const olderGroups = getOlderNotificationsGroups();

  return (
    <div className="p-2 sm:p-4 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <div className="mb-3 sm:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Notifications</h2>
          {totalUnread > 0 && (
            <div className="text-sm text-[#BBF429] mt-1">
              {totalUnread} unread notification{totalUnread !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Button 
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="text-xs sm:text-sm bg-black/30 border border-[#BBF429]/30 text-white hover:bg-[#BBF429]/20 flex-1 sm:flex-none"
            disabled={totalUnread === 0}
          >
            Mark all read
          </Button>
          
          <Button 
            onClick={() => fetchNotifications()}
            className="bg-[#BBF429]/20 hover:bg-[#BBF429]/30 text-[#BBF429] border border-[#BBF429]/40 text-xs sm:text-sm flex-1 sm:flex-none"
          >
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <LoadingSpinner color="white" size={32} />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Today's notifications */}
          <NotificationSection 
            title="Today" 
            notifications={groupedNotifications.today}
            onNotificationClick={handleNotificationClick}
            onMarkRead={handleMarkAsRead}
          />
          
          {/* Yesterday's notifications */}
          <NotificationSection 
            title="Yesterday" 
            notifications={groupedNotifications.yesterday}
            onNotificationClick={handleNotificationClick}
            onMarkRead={handleMarkAsRead}
          />
          
          {/* Older notifications grouped by date */}
          {olderGroups.map((group, index) => (
            <NotificationSection 
              key={group.date}
              title={group.date}
              notifications={group.notifications}
              onNotificationClick={handleNotificationClick}
              onMarkRead={handleMarkAsRead}
            />
          ))}
          
          {/* Loading indicator for infinite scroll */}
          <div 
            ref={hasMore ? lastElementRef : undefined}
            className="py-4 text-center"
          >
            {loadingMore && (
              <div className="flex justify-center py-4">
                <LoadingSpinner color="white" size={24} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
