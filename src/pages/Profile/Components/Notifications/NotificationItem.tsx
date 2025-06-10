import { format } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export interface Notification {
  id: number;
  title: string;
  body: string;
  data: any;
  is_read: boolean;
  sent_at: string;
}

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  onMarkRead: () => void;
}

const NotificationItem = ({ notification, onClick, onMarkRead }: NotificationItemProps) => {
  const formattedTime = format(new Date(notification.sent_at), 'h:mm a');
  
  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.01 }}
      className={`cursor-pointer p-3 sm:p-4 rounded-lg transition-all duration-300 border ${
        notification.is_read 
          ? "bg-black/20 border-[#BBF429]/10" 
          : "bg-gradient-to-r from-black/40 to-[#BBF429]/5 border-[#BBF429]/30 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start" onClick={onClick}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-medium text-sm sm:text-base ${notification.is_read ? 'text-white/80' : 'text-[#BBF429]'}`}>
              {notification.title}
            </h4>
            {!notification.is_read && (
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            )}
          </div>
          <p className={`text-xs sm:text-sm ${notification.is_read ? 'text-gray-400' : 'text-white'}`}>
            {notification.body}
          </p>
          <div className="text-xs text-gray-400 mt-2">{formattedTime}</div>
        </div>
        <div className="ml-2">
          {!notification.is_read && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead();
              }}
              className="text-xs text-gray-400 hover:text-white p-1 sm:p-2 h-auto"
            >
              <span className="hidden sm:inline">Mark read</span>
              <span className="sm:hidden">Read</span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;