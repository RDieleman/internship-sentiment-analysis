import { Navigate, createBrowserRouter } from "react-router-dom";
import CampaignOverview from "./campaign-overview/CampaignOverview.jsx";
import CampaignDetails from "./campaign-details/CampaignDetails.jsx";
import Timeline from "./campaign-details/timeline/Timeline.jsx";
import BaseLayout from "./BaseLayout.jsx";
import ModerationOverview from "./campaign-details/moderation/ModerationOverview.jsx";
import Authentication from "./authentication/Authentication.jsx";
import AdminPage from "./admin/Admin.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="authentication" replace />,
      },
      {
        path: "authentication",
        element: <Authentication />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "overview",
        element: <CampaignOverview />,
      },
      {
        path: "campaign/:campaignId",
        element: <CampaignDetails />,
        children: [
          {
            path: "",
            element: <Navigate to="timeline" replace />,
          },
          {
            path: "timeline",
            element: <Timeline />,
          },
          {
            path: "moderation",
            element: <ModerationOverview />,
          },
        ],
      },
    ],
  },
]);
