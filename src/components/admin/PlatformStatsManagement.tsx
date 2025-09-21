import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  Trophy, 
  Award,
  Calendar,
  Edit3, 
  Save, 
  X, 
  RefreshCw
} from "lucide-react";
import apiClient from "@/utils/apiClient";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";

interface PlatformStat {
  id: number;
  stat_key: string;
  stat_value: number;
  stat_label: string;
  stat_description?: string;
  display_order: number;
  is_active: boolean;
  icon?: string;
  format_type: 'number' | 'currency' | 'percentage';
  created_at: string;
  updated_at: string;
}

interface EditingStat extends PlatformStat {
  isEditing?: boolean;
}

const PlatformStatsManagement: React.FC = () => {
  const [stats, setStats] = useState<EditingStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [autoUpdating, setAutoUpdating] = useState(false);

  const iconMap: Record<string, React.ReactNode> = {
    'trophy': <Trophy className="h-5 w-5" />,
    'dollar-sign': <DollarSign className="h-5 w-5" />,
    'users': <Users className="h-5 w-5" />,
    'calendar': <Calendar className="h-5 w-5" />,
    'award': <Award className="h-5 w-5" />,
    'bar-chart': <BarChart3 className="h-5 w-5" />,
  };

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/admin/platform-stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      showErrorToast("Failed to fetch platform statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    setStats(prev => prev.map(stat => 
      stat.id === id ? { ...stat, isEditing: true } : { ...stat, isEditing: false }
    ));
  };

  const handleCancel = (id: number) => {
    setStats(prev => prev.map(stat => 
      stat.id === id ? { ...stat, isEditing: false } : stat
    ));
    fetchPlatformStats(); // Refresh to get original values
  };

  const handleSave = async (id: number) => {
    try {
      setUpdating(true);
      const statToUpdate = stats.find(s => s.id === id);
      if (!statToUpdate) return;

      const response = await apiClient.put(`/api/admin/platform-stats/${id}`, {
        stat_value: statToUpdate.stat_value,
        stat_label: statToUpdate.stat_label,
        stat_description: statToUpdate.stat_description,
        display_order: statToUpdate.display_order,
        is_active: statToUpdate.is_active,
      });

      if (response.data.success) {
        showSuccessToast("Platform statistic updated successfully");
        setStats(prev => prev.map(stat => 
          stat.id === id ? { ...response.data.data, isEditing: false } : stat
        ));
      }
    } catch (error) {
      console.error("Error updating platform stat:", error);
      showErrorToast("Failed to update platform statistic");
    } finally {
      setUpdating(false);
    }
  };

  const handleAutoUpdate = async () => {
    try {
      setAutoUpdating(true);
      const response = await apiClient.post("/api/admin/platform-stats/auto-update");
      if (response.data.success) {
        showSuccessToast("Platform statistics auto-updated successfully");
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error auto-updating platform stats:", error);
      showErrorToast("Failed to auto-update platform statistics");
    } finally {
      setAutoUpdating(false);
    }
  };

  const handleInputChange = (id: number, field: keyof PlatformStat, value: string | number | boolean) => {
    setStats(prev => prev.map(stat => 
      stat.id === id ? { ...stat, [field]: value } : stat
    ));
  };

  const formatValue = (value: number, formatType: string) => {
    switch (formatType) {
      case 'currency':
        return `₹${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-[#BBF429]">Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-800 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-[#BBF429]">Platform Statistics Management</CardTitle>
          <Button 
            onClick={handleAutoUpdate}
            disabled={autoUpdating}
            className="bg-[#BBF429] text-black hover:bg-[#BBF429]/80"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoUpdating ? 'animate-spin' : ''}`} />
            Auto Update from Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="h-10 w-10 bg-[#BBF429]/20 rounded-lg flex items-center justify-center">
                  {iconMap[stat.icon || 'bar-chart'] || <BarChart3 className="h-5 w-5" />}
                </div>
                
                <div className="flex-1">
                  {stat.isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={stat.stat_label}
                        onChange={(e) => handleInputChange(stat.id, 'stat_label', e.target.value)}
                        placeholder="Statistic Label"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        value={stat.stat_description || ''}
                        onChange={(e) => handleInputChange(stat.id, 'stat_description', e.target.value)}
                        placeholder="Description (optional)"
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium text-white">{stat.stat_label}</h3>
                      {stat.stat_description && (
                        <p className="text-sm text-gray-400">{stat.stat_description}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {stat.isEditing ? (
                    <Input
                      type="number"
                      value={stat.stat_value}
                      onChange={(e) => handleInputChange(stat.id, 'stat_value', parseInt(e.target.value) || 0)}
                      className="w-32 bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#BBF429]">
                        {formatValue(stat.stat_value, stat.format_type)}
                      </div>
                      <div className="text-xs text-gray-400">
                        Order: {stat.display_order}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {stat.isEditing ? (
                      <Switch
                        checked={stat.is_active}
                        onCheckedChange={(checked) => handleInputChange(stat.id, 'is_active', checked)}
                      />
                    ) : (
                      <Badge variant={stat.is_active ? "default" : "secondary"}>
                        {stat.is_active ? "Active" : "Inactive"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {stat.isEditing ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleSave(stat.id)}
                      disabled={updating}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(stat.id)}
                      className="border-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(stat.id)}
                    className="border-gray-600"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="font-medium text-white mb-2">About Platform Statistics</h4>
          <p className="text-sm text-gray-400">
            These statistics are displayed on the user-facing leaderboard page as banner stats. 
            Use "Auto Update from Data" to sync with actual database values, or manually edit 
            individual statistics as needed. The display order determines how they appear on the banner.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformStatsManagement;
