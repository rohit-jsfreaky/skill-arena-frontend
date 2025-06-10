import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { AuthTokenProvider } from "./context/AuthTokenContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { MembershipProvider } from "./context/MembershipContext.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <AuthTokenProvider>
        <UserProvider>
          <MembershipProvider>
            <App />
          </MembershipProvider>
        </UserProvider>
      </AuthTokenProvider>
    </ClerkProvider>
  </StrictMode>
);
