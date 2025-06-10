import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
