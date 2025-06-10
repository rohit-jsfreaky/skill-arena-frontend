import { BrowserRouter as Router } from "react-router-dom"; // Fixed import
import AppRoutes from "./Routes/Routes";
import { Toaster } from "./components/ui/sonner";
import NotificationRoot from "./components/notifications/NotificationRoot";

const App = () => {
  return (
    <NotificationRoot>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </NotificationRoot>
  );
};

export default App;
