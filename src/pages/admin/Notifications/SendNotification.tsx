import { useState, useEffect } from 'react';
import { sendGlobalNotification, sendUserNotification } from '@/api/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import { LoadingSpinner } from '@/components/my-ui/Loader';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
}

const SendNotification = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [notification, setNotification] = useState({
    title: '',
    body: '',
    imageUrl: '',
  });

  // Fetch users for individual notifications
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        setUsers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        showErrorToast('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        user => 
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNotification(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGlobalNotification = async () => {
    if (!notification.title || !notification.body) {
      showErrorToast('Title and message are required');
      return;
    }

    setLoading(true);
    try {
      const result = await sendGlobalNotification(
        notification.title, 
        notification.body, 
        notification.imageUrl || undefined
      );

      if (result.success) {
        showSuccessToast('Global notification sent successfully');
        // Clear form after successful submission
        setNotification({
          title: '',
          body: '',
          imageUrl: '',
        });
      } else {
        showErrorToast(result.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending global notification:', error);
      showErrorToast('An error occurred while sending the notification');
    } finally {
      setLoading(false);
    }
  };

  const handleUserNotification = async () => {
    if (!notification.title || !notification.body || !selectedUserId) {
      showErrorToast('User, title and message are required');
      return;
    }

    setLoading(true);
    try {
      const userId = parseInt(selectedUserId, 10);
      const result = await sendUserNotification(
        userId,
        notification.title, 
        notification.body, 
        notification.imageUrl || undefined
      );

      if (result.success) {
        showSuccessToast(`Notification sent successfully to user ID: ${userId}`);
        // Clear form after successful submission
        setNotification({
          title: '',
          body: '',
          imageUrl: '',
        });
        setSelectedUserId('');
      } else {
        showErrorToast(result.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending user notification:', error);
      showErrorToast('An error occurred while sending the notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-[#BBF429] mb-8">Send Notifications</h1>
      
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="mb-6 bg-black border border-[#BBF429] text-white">
          <TabsTrigger value="global" className="data-[state=active]:bg-[#BBF429] data-[state=active]:text-black">
            Global Notification
          </TabsTrigger>
          <TabsTrigger value="user" className="data-[state=active]:bg-[#BBF429] data-[state=active]:text-black">
            User Notification
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="global">
          <Card className="bg-[#1A1A1A] text-white border border-[#BBF429]">
            <CardHeader>
              <CardTitle className="text-[#BBF429]">Send to All Users</CardTitle>
              <CardDescription className="text-gray-400">
                This notification will be sent to all users who have the app installed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="title">Notification Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={notification.title}
                    onChange={handleInputChange}
                    placeholder="Enter notification title"
                    className="bg-black border-[#BBF429] text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="body">Notification Message</Label>
                  <Textarea
                    id="body"
                    name="body"
                    value={notification.body}
                    onChange={handleInputChange}
                    placeholder="Enter notification message"
                    className="bg-black border-[#BBF429] text-white"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={notification.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="bg-black border-[#BBF429] text-white"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGlobalNotification}
                disabled={loading}
                className="w-full bg-[#BBF429] text-black hover:bg-[#a3e41b]"
              >
                {loading ? (
                  <span className="flex items-center">
                    <LoadingSpinner size={30} color='white'/>
                    <span className="ml-2">Sending...</span>
                  </span>
                ) : (
                  'Send Global Notification'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="user">
          <Card className="bg-[#1A1A1A] text-white border border-[#BBF429]">
            <CardHeader>
              <CardTitle className="text-[#BBF429]">Send to Specific User</CardTitle>
              <CardDescription className="text-gray-400">
                Target a specific user with a personalized notification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="user">Select User</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Search users by username or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-black border-[#BBF429] text-white mb-2"
                    />
                    <Select 
                      value={selectedUserId} 
                      onValueChange={setSelectedUserId}
                    >
                      <SelectTrigger className="bg-black border-[#BBF429] text-white">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] text-white border border-[#BBF429]">
                        {filteredUsers.map(user => (
                          <SelectItem 
                            key={user.id} 
                            value={user.id.toString()}
                            className="hover:bg-black hover:text-[#BBF429]"
                          >
                            {user.username} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Notification Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={notification.title}
                    onChange={handleInputChange}
                    placeholder="Enter notification title"
                    className="bg-black border-[#BBF429] text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="body">Notification Message</Label>
                  <Textarea
                    id="body"
                    name="body"
                    value={notification.body}
                    onChange={handleInputChange}
                    placeholder="Enter notification message"
                    className="bg-black border-[#BBF429] text-white"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={notification.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="bg-black border-[#BBF429] text-white"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleUserNotification}
                disabled={loading}
                className="w-full bg-[#BBF429] text-black hover:bg-[#a3e41b]"
              >
                {loading ? (
                  <span className="flex items-center">
                    <LoadingSpinner color='white' size={20}/>
                    <span className="ml-2">Sending...</span>
                  </span>
                ) : (
                  'Send User Notification'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SendNotification;