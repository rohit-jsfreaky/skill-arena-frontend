import NotificationItem, { Notification } from "./NotificationItem";

interface NotificationSectionProps {
  title: string;
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkRead: (id: number) => void;
}

const NotificationSection = ({ 
  title, 
  notifications, 
  onNotificationClick, 
  onMarkRead 
}: NotificationSectionProps) => {
  if (notifications.length === 0) return null;
  
  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="text-[#BBF429] text-base sm:text-lg font-semibold mb-2 sm:mb-3 px-2">{title}</h3>
      <div className="space-y-2 sm:space-y-3">
        {notifications.map(notification => (
          <NotificationItem 
            key={notification.id}
            notification={notification}
            onClick={() => onNotificationClick(notification)}
            onMarkRead={() => onMarkRead(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationSection;