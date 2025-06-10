import { useState } from 'react';
import SendNotification from './SendNotification';
import NotificationHistory from './NotificationHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, History } from 'lucide-react';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('send');

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-4xl font-bold text-[#BBF429] mb-6">Notifications Management</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full max-w-md mx-auto mb-6 bg-black border border-[#BBF429] text-white">
          <TabsTrigger 
            value="send" 
            className="flex-1 data-[state=active]:bg-[#BBF429] data-[state=active]:text-black"
          >
            <Bell className="mr-2 h-4 w-4" />
            Send Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="flex-1 data-[state=active]:bg-[#BBF429] data-[state=active]:text-black"
          >
            <History className="mr-2 h-4 w-4" />
            Notification History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="send">
          <SendNotification />
        </TabsContent>
        
        <TabsContent value="history">
          <NotificationHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;