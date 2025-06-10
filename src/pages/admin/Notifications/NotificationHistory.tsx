import { useState, useEffect } from 'react';
import { getNotificationHistory } from '@/api/notifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/my-ui/Loader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: number;
  title: string;
  body: string;
  image_url: string | null;
  is_global: boolean;
  user_id: number | null;
  sent_at: string;
  admin_username: string;
  recipient_username: string | null;
}

interface PaginationInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

const NotificationHistory = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });
  const [type, setType] = useState<'all' | 'global' | 'user'>('all');

  useEffect(() => {
    fetchNotifications();
  }, [pagination.currentPage, type]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const result = await getNotificationHistory(pagination.currentPage, pagination.limit, type);
      
      if (result.success) {
        setNotifications(result.data);
        setPagination(prev => ({
          ...prev,
          totalCount: result.pagination.totalCount,
          totalPages: result.pagination.totalPages,
        }));
      } else {
        console.error('Error fetching notifications:', result.message);
      }
    } catch (error) {
      console.error('Error fetching notification history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const handleTypeChange = (value: 'all' | 'global' | 'user') => {
    setType(value);
    setPagination(prev => ({
      ...prev,
      currentPage: 1, // Reset to first page when changing type
    }));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#BBF429]">Notification History</h1>
        <div className="flex items-center">
          <span className="mr-2 text-white">Filter:</span>
          <Select value={type} onValueChange={(val: any) => handleTypeChange(val)}>
            <SelectTrigger className="bg-black border-[#BBF429] text-white w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] text-white border border-[#BBF429]">
              <SelectItem value="all" className="hover:bg-black hover:text-[#BBF429]">All</SelectItem>
              <SelectItem value="global" className="hover:bg-black hover:text-[#BBF429]">Global</SelectItem>
              <SelectItem value="user" className="hover:bg-black hover:text-[#BBF429]">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-[#1A1A1A] text-white border border-[#BBF429]">
        <CardHeader>
          <CardTitle className="text-[#BBF429] flex justify-between items-center">
            <span>Past Notifications</span>
            {pagination.totalCount > 0 && (
              <span className="text-sm font-normal">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to {
                  Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)
                } of {pagination.totalCount}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <LoadingSpinner color='white' size={40} />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No notifications found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-black/40 border-[#BBF429]/30">
                    <TableHead className="text-[#BBF429]">ID</TableHead>
                    <TableHead className="text-[#BBF429]">Type</TableHead>
                    <TableHead className="text-[#BBF429]">Title</TableHead>
                    <TableHead className="text-[#BBF429]">Message</TableHead>
                    <TableHead className="text-[#BBF429]">Recipient</TableHead>
                    <TableHead className="text-[#BBF429]">Sent By</TableHead>
                    <TableHead className="text-[#BBF429]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id} className="hover:bg-black/40 border-[#BBF429]/30">
                      <TableCell className="font-mono">{notification.id}</TableCell>
                      <TableCell>
                        <Badge variant={notification.is_global ? "default" : "outline"} 
                               className={notification.is_global ? 
                                  "bg-[#BBF429] text-black hover:bg-[#a3e41b]" : 
                                  "border-[#BBF429] text-[#BBF429]"}>
                          {notification.is_global ? 'Global' : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{notification.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{notification.body}</TableCell>
                      <TableCell>
                        {notification.is_global ? (
                          <span className="text-gray-400">All Users</span>
                        ) : notification.recipient_username ? (
                          notification.recipient_username
                        ) : (
                          <span className="text-gray-400">ID: {notification.user_id}</span>
                        )}
                      </TableCell>
                      <TableCell>{notification.admin_username}</TableCell>
                      <TableCell>{formatDate(notification.sent_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
                className="bg-black border-[#BBF429] text-white hover:bg-[#1A1A1A]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                // Logic to show pages around current page
                let pageToShow = pageNum;
                if (pagination.totalPages > 5) {
                  if (pagination.currentPage <= 3) {
                    pageToShow = pageNum;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageToShow = pagination.totalPages - 5 + i + 1;
                  } else {
                    pageToShow = pagination.currentPage - 2 + i;
                  }
                }

                return pageToShow <= pagination.totalPages ? (
                  <Button
                    key={pageToShow}
                    variant={pageToShow === pagination.currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageToShow)}
                    disabled={loading}
                    className={pageToShow === pagination.currentPage ? 
                      "bg-[#BBF429] text-black hover:bg-[#a3e41b]" : 
                      "bg-black border-[#BBF429] text-white hover:bg-[#1A1A1A]"}
                  >
                    {pageToShow}
                  </Button>
                ) : null;
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages || loading}
                className="bg-black border-[#BBF429] text-white hover:bg-[#1A1A1A]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationHistory;