import ChatPage from "@/pages/globalChat/ChatPage";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import { Routes as RouterRoutes, Route } from "react-router-dom";

import PersonalChatPage from "@/pages/personalChat/PersonalChat";
import ProfileSecond from "@/pages/Profile/ProfileSecond";
import MembershipPage from "@/pages/Membership/MembershipPage";
import MembershipSuccess from "@/pages/Membership/MembershipSuccess";
import CreateTournament from "@/pages/admin/Tournaments/CreateTournament";
import TournamentList from "@/pages/Tournaments/TournamentList";
import TournamentDetails from "@/pages/Tournaments/TournamentDetails";
import TournamentHistory from "@/pages/Tournaments/TournamentHistory";
import TournamentResults from "@/pages/Tournaments/TournamentResults"; // Add this import
import SignIn from "@/pages/auth/SignIn";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "@/components/layout/Layout";
import AdminLogin from "@/pages/admin/auth/AdminLogin";
import AdminDashboard from "@/pages/admin/Dashboard/AdminDashboard";
import ForgotPassword from "@/pages/admin/auth/ForgotPassword";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminTournaments from "@/pages/admin/Tournaments/AdminTournaments";
import Tournament from "@/pages/admin/Tournaments/Tournament";
import EditTournaments from "@/pages/admin/Tournaments/EditTournaments";
import Users from "@/pages/admin/users/Users";
import User from "@/pages/admin/users/User";
import { AdminProvider } from "@/context/AdminContext";
import Games from "@/pages/admin/Games/Games";
import TransactionsPage from "@/pages/admin/Transactions/TransactionsPage";
import MembershipManagement from "@/pages/admin/Membership/MembershipManagement";
import AdminTournamentResults from "@/pages/admin/Tournaments/AdminTournamentResults";
import AdminTournamentReview from "@/pages/admin/Tournaments/AdminTournamentReview";
import AdminTdmMatchesPage from "@/pages/admin/TDM/AdminTdmMatchesPage";
import AdminTdmDisputesPage from "@/pages/admin/TDM/AdminTdmDisputesPage";
import AdminCreateTdmMatchPage from "@/pages/admin/TDM/AdminCreateTdmMatchPage";
import LeaderboardPage from "@/pages/Leaderboard/Leaderboard";
// REMOVED: import CreateTdmMatchPage from "@/pages/TDM/CreateTdmMatchPage"; - Users can no longer create matches
import MatchDetailsPage from "@/pages/TDM/MatchDetailsPage";
import JoinPrivateMatchPage from "@/pages/TDM/JoinPrivateMatchPage";
import PublicMatchesPage from "@/pages/PublicMatchesPage";
import JoinMatchForm from "@/components/TDM/JoinMatchForm";
import UserLeaderboardStats from "@/pages/Profile/UserLeaderboardStats";
import TDMPage from "@/pages/TDM/TDMPage";
import AdminTdmMatchReviewPage from "@/pages/admin/TDM/AdminTdmMatchReviewPage";
import AdminPagesPage from "@/pages/admin/Pages/AdminPagesPage";
import AboutUsPage from "@/pages/AboutUs/AboutUsPage";
import ContactUsPage from "@/pages/ContactUs/ContactUsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AdminLeaderboard from "@/pages/admin/Leaderboard/AdminLeaderboard";

const AppRoutes = () => {
  return (
    <RouterRoutes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route path="/sign-in" element={<SignIn />} />
      <Route
        path="/profile"
        element={
          <Layout>
            <ProtectedRoute>
              <ProfileSecond />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/chat"
        element={
          <Layout>
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/personal"
        element={
          <Layout>
            <ProtectedRoute>
              <PersonalChatPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/membership"
        element={
          <Layout>
            <ProtectedRoute>
              <MembershipPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/tournaments"
        element={
          <Layout>
            <ProtectedRoute>
              <TournamentList />
            </ProtectedRoute>
          </Layout>
        }
      />

      <Route
        path="/tdm"
        element={
          <Layout>
            <ProtectedRoute>
              <TDMPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      {/* BLOCKED: User TDM creation route - redirect to TDM page */}
      <Route
        path="/tdm/create-match"
        element={
          <Layout>
            <ProtectedRoute>
              <TDMPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/tdm/match/:matchId"
        element={
          <Layout>
            <ProtectedRoute>
              <MatchDetailsPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/tdm/join-match/:matchId"
        element={
          <Layout>
            <ProtectedRoute>
              <JoinMatchForm />
            </ProtectedRoute>
          </Layout>
        }
      />

      <Route
        path="/tdm/join-private/:inviteCode"
        element={
          <Layout>
            <ProtectedRoute>
              <JoinPrivateMatchPage />
            </ProtectedRoute>
          </Layout>
        }
      />

      <Route
        path="/tdm/match/:matchId"
        element={
          <Layout>
            <ProtectedRoute>
              <MatchDetailsPage />
            </ProtectedRoute>
          </Layout>
        }
      />

      <Route
        path="/tournaments/:id"
        element={
          <Layout>
            <ProtectedRoute>
              <TournamentDetails />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/tournaments/:id/results"
        element={
          <Layout>
            <ProtectedRoute>
              <TournamentResults />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <AboutUsPage />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <ContactUsPage />
          </Layout>
        }
      />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot" element={<ForgotPassword />} />

      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <AdminProvider>
              <AdminDashboard />
            </AdminProvider>
          </AdminLayout>
        }
      />

      <Route
        path="/admin/tournaments"
        element={
          <AdminLayout>
            <AdminTournaments />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/tournaments/:id"
        element={
          <AdminLayout>
            <Tournament />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/tournaments/create"
        element={
          <AdminLayout>
            <CreateTournament />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/tournaments/edit/:id"
        element={
          <AdminLayout>
            <EditTournaments />
          </AdminLayout>
        }
      />

      {/* Add these new routes for admin tournament review */}
      <Route
        path="/admin/tournament-results"
        element={
          <AdminLayout>
            <AdminTournamentResults />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/tournament-results/:id/review"
        element={
          <AdminLayout>
            <AdminTournamentReview />
          </AdminLayout>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <Layout>
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          </Layout>
        }
      />

      <Route
        path="/profile/:userId"
        element={
          <Layout>
            <ProtectedRoute>
              <UserLeaderboardStats />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/admin/tdm/matches"
        element={
          <AdminLayout>
            <AdminTdmMatchesPage />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/tdm/create"
        element={
          <AdminLayout>
            <AdminCreateTdmMatchPage />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/tdm/disputes"
        element={
          <AdminLayout>
            <AdminTdmDisputesPage />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/tdm/matches/:matchId/review"
        element={
          <AdminLayout>
            <AdminTdmMatchReviewPage />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <Users />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <AdminLayout>
            <User />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/games"
        element={
          <AdminLayout>
            <Games />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/transactions"
        element={
          <AdminLayout>
            <TransactionsPage />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/memberships"
        element={
          <AdminLayout>
            <MembershipManagement />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/pages"
        element={
          <AdminLayout>
            <AdminPagesPage />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/leaderboard"
        element={
          <AdminLayout>
            <AdminProvider>
              <AdminLeaderboard />
            </AdminProvider>
          </AdminLayout>
        }
      />

      <Route path="/*" element={<NotFoundPage />} />
    </RouterRoutes>
  );
};

export default AppRoutes;
