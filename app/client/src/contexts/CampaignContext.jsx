import { createContext, useContext, useEffect, useState } from "react";
import useAPI from "../hooks/useAPI.jsx";
import { AuthenticationContext } from "./AuthenticationContext.jsx";
import { AlertContext, AlertTypes } from "./AlertContext.jsx";
export const CampaignContext = createContext();

export function CampaignContextProvider({ children }) {
  const { addAlert } = useContext(AlertContext);
  const { isAuthenticated } = useContext(AuthenticationContext);
  const campaigns = useAPI(
    {
      url: "/api/campaigns",
    },
    false
  );
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    if (campaigns.error != null) {
      addAlert(AlertTypes.ERROR, "Failed to retrieve campaigns.");
    }
  }, [campaigns.error]);

  useEffect(() => {
    if (isAuthenticated == false) {
      return;
    }

    campaigns.refetch();
  }, [isAuthenticated]);

  const getById = (id) => {
    return campaigns.data.find((c) => c._id === id);
  };

  const setSelectedById = (id) => {
    const campaign = getById(id);
    setSelectedCampaign(campaign);
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        selectedCampaign,
        setSelectedCampaign,
        setSelectedById,
        getById,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}
