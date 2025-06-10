import { useEffect, useState } from "react";
import { Users, CalendarDays, Trophy, Award, UserX, Clock } from "lucide-react";
import { getDashboardStats, DashboardStats } from "@/api/admin/dashboard";
import StatCard from "@/components/dashboard/StatCard";
import LineChart from "@/components/dashboard/LineChart";
import RecentUsersList from "@/components/dashboard/RecentUsersList";
import ActiveUsersList from "@/components/dashboard/ActiveUsersList";
import DoughnutChart from "@/components/dashboard/DoughnutChart";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";
import EmptyChart from "@/components/dashboard/EmptyChart";
import AdminProfileDropdown from "@/components/admin/AdminProfileDropdown";
import AdminMargin from "@/components/admin/AdminMargin";
import {
  getTournamentMargin,
  UpdateTournamentMargin,
} from "@/api/admin/margin";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isEditingMargin, setIsEditingMargin] = useState(false);
  const [tournamentMargin, setTournamentMargin] = useState(0);
  const [tempMargin, setTempMargin] = useState(tournamentMargin);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const response = await getDashboardStats(setLoading);
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        showErrorToast(response.message || "Failed to load dashboard data");
      }
    };

    const fetchMargin = async () => {
      const { margin, success, message } = await getTournamentMargin();

      if (!success)
        return showErrorToast(message || "Failed to load tournament margin");

      setTournamentMargin(margin);
    };

    fetchDashboardStats();
    fetchMargin();
  }, []);

  // Prepare tournament data for doughnut chart
  const tournamentChartData = stats
    ? [
        { name: "Upcoming", value: stats.tournaments.upcoming },
        { name: "Ongoing", value: stats.tournaments.ongoing },
        { name: "Completed", value: stats.tournaments.completed },
      ]
    : [];

  // Prepare user data for doughnut chart
  const userChartData = stats
    ? [
        { name: "Active", value: stats.users.active },
        { name: "Banned", value: stats.users.banned },
      ]
    : [];

  const handleEditMargin = () => {
    setIsEditingMargin(true);
    setTempMargin(tournamentMargin);
  };

  const handleCancelEdit = () => {
    setIsEditingMargin(false);
    setTempMargin(tournamentMargin);
  };

  const handleUpdateMargin = async () => {
    const { margin, success, message } = await UpdateTournamentMargin(
      tempMargin
    );

    if (!success) return showErrorToast(message || "Failed to update margin");

    setTournamentMargin(margin);
    showSuccessToast(message);
    setIsEditingMargin(false);
  };

  return (
    <div className="w-full h-full flex-col relative bg-gradient-to-r from-black via-black to-[#BBF429] p-4 pt-14 md:p-8 md:pt-14">
      {/* Header with title and profile dropdown */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex justify-center items-center gap-2 md:gap-10">
          <AdminMargin
            handleCancelEdit={handleCancelEdit}
            handleEditMargin={handleEditMargin}
            handleUpdateMargin={handleUpdateMargin}
            isEditingMargin={isEditingMargin}
            setTempMargin={setTempMargin}
            tempMargin={tempMargin}
            tournamentMargin={tournamentMargin}
          />
          <AdminProfileDropdown adminUsername="Admin" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <LoadingSpinner color="white" size={50} />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Users"
              value={stats?.users.total || 0}
              icon={Users}
              iconClassName="bg-[#BBF429]/10"
            />
            <StatCard
              title="Total Tournaments"
              value={stats?.tournaments.total || 0}
              icon={Trophy}
              iconClassName="bg-purple-700/10"
              valueClassName="text-purple-400"
            />
            <StatCard
              title="Active Users"
              value={stats?.users.active || 0}
              icon={Award}
              iconClassName="bg-blue-700/10"
              valueClassName="text-blue-400"
            />
            <StatCard
              title="Banned Users"
              value={stats?.users.banned || 0}
              icon={UserX}
              iconClassName="bg-red-700/10"
              valueClassName="text-red-400"
            />
          </div>

          {/* Tournament Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Upcoming Tournaments"
              value={stats?.tournaments.upcoming || 0}
              icon={CalendarDays}
              iconClassName="bg-blue-700/10"
              valueClassName="text-blue-400"
            />
            <StatCard
              title="Ongoing Tournaments"
              value={stats?.tournaments.ongoing || 0}
              icon={Clock}
              iconClassName="bg-green-700/10"
              valueClassName="text-green-400"
            />
            <StatCard
              title="Completed Tournaments"
              value={stats?.tournaments.completed || 0}
              icon={Trophy}
              iconClassName="bg-amber-700/10"
              valueClassName="text-amber-400"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {stats?.users.registrations &&
            stats.users.registrations.length > 0 ? (
              <LineChart
                data={stats.users.registrations}
                title="User Registrations (Last 30 Days)"
                color="#3182CE"
              />
            ) : (
              <EmptyChart
                title="User Registrations (Last 30 Days)"
                message="No user registrations in the last 30 days"
              />
            )}

            {stats?.tournaments.created &&
            stats.tournaments.created.length > 0 ? (
              <LineChart
                data={stats.tournaments.created}
                title="Tournaments Created (Last 30 Days)"
                color="#BBF429"
              />
            ) : (
              <EmptyChart
                title="Tournaments Created (Last 30 Days)"
                message="No tournaments created in the last 30 days"
              />
            )}
          </div>

          {/* Doughnut Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DoughnutChart
              data={tournamentChartData}
              title="Tournament Status Distribution"
            />
            <DoughnutChart
              data={userChartData}
              title="User Status Distribution"
            />
          </div>

          {/* Lists Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentUsersList
              users={stats?.users.recentUsers || []}
              title="Recently Registered Users"
            />
            <ActiveUsersList
              users={stats?.users.topActiveUsers || []}
              title="Top Active Users"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
