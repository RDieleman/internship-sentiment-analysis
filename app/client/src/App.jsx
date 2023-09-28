import "./App.css";

import { RouterProvider } from "react-router-dom";
import { CampaignContextProvider } from "./contexts/CampaignContext";
import SocketProvider from "./contexts/SocketContext";
import { NotificationContextProvider } from "./contexts/NotificationContext.jsx";
import { router } from "./pages/Router.jsx";
import { AuthenticationContextProvider } from "./contexts/AuthenticationContext.jsx";
import { AlertContextProvider } from "./contexts/AlertContext.jsx";

function App() {
  return (
    <AlertContextProvider>
      <AuthenticationContextProvider>
        <SocketProvider>
          <CampaignContextProvider>
            <NotificationContextProvider>
              <RouterProvider router={router} />
            </NotificationContextProvider>
          </CampaignContextProvider>
        </SocketProvider>
      </AuthenticationContextProvider>
    </AlertContextProvider>
  );
}

export default App;
