import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "@/utils/toastUtils";

interface AdminUser {
  id: number;
  username: string;
  email: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("api/admin/auth/check-auth");

      if (response.data.authenticated) {
        setAdmin(response.data.admin);
        setIsAuthenticated(true);
      } else {
        setAdmin(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("api/admin/auth/logout");
      setAdmin(null);
      setIsAuthenticated(false);
      navigate("/admin/login");
    } catch (error) {
      showErrorToast("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAuthenticated,
        isLoading,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
