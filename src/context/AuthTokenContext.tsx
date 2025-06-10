import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setupInterceptors } from "@/utils/apiClient";

interface AuthTokenContextProps {
  authToken: string | null;
}

const AuthTokenContext = createContext<AuthTokenContextProps | undefined>(
  undefined
);

export const AuthTokenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getToken, isSignedIn } = useAuth();
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Function to get token - used by interceptors
  const getAuthToken = async (): Promise<string | null> => {
    if (isSignedIn) {
      try {
        const token = await getToken();
        setAuthToken(token);
        return token;
      } catch (error) {
        console.error("Error fetching token:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    // Set up interceptors once when the component mounts
    setupInterceptors(getAuthToken);

    // Initial token fetch
    if (isSignedIn !== undefined) {
      getAuthToken();
    }
  }, [isSignedIn]);

  return (
    <AuthTokenContext.Provider value={{ authToken }}>
      {children}
    </AuthTokenContext.Provider>
  );
};

export const useAuthToken = () => {
  const context = useContext(AuthTokenContext);
  if (!context) {
    throw new Error("useAuthToken must be used within an AuthTokenProvider");
  }
  return context;
};
