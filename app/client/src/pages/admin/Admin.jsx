import { useContext, useEffect, useState } from "react";
import useAPI from "../../hooks/useAPI.jsx";

import "./Style.css";
import Title from "../../components/text/Title.jsx";
import classNames from "classnames";
import { AlertContext, AlertTypes } from "../../contexts/AlertContext.jsx";
import * as XLSX from "xlsx";
import useImportCampaigns from "../../hooks/admin/useImportCampaigns.jsx";
import useImportEvents from "../../hooks/admin/useImportEvents.jsx";
import useImportMessages from "../../hooks/admin/useImportMessages.jsx";
import { AuthenticationContext } from "../../contexts/AuthenticationContext.jsx";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader.jsx";

const AdminPage = () => {
  const { addAlert } = useContext(AlertContext);
  const { isAuthenticated } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const initialSignupOptions = {
    url: "/api/auth/public/signup",
    method: "POST",
  };

  const signup = useAPI(initialSignupOptions, false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [selectedAccount, setSelectedAccount] = useState(null);

  const accounts = useAPI({
    url: "/api/auth/user/all",
    method: "GET",
  });

  const initialDeleteOptions = {
    method: "DELETE",
  };

  const deletion = useAPI(initialDeleteOptions, false);

  const [importData, setImportData] = useState(null);

  const importCampaigns = useImportCampaigns();
  const importEvents = useImportEvents();
  const importMessages = useImportMessages();

  useEffect(() => {
    if (importData == null || importData.campaignIds == null) {
      return;
    }

    importCampaigns.execute(importData.campaignIds, importData.userId);
  }, [importData]);

  useEffect(() => {
    if (importCampaigns.success == false) {
      console.error("Campaign import failed. Not importing events.");
      return;
    }

    importEvents.execute(importData.events);
  }, [importCampaigns.success]);

  useEffect(() => {
    if (importEvents.success == false) {
      console.error("Events import failed. Not importing messages.");
      return;
    }

    importMessages.execute(importData.messages);
  }, [importEvents.success]);

  useEffect(() => {
    if (!Object.hasOwn(signup.options, "body")) {
      return;
    }

    signup.refetch();
  }, [signup.options]);

  useEffect(() => {
    if (!Object.hasOwn(deletion.options, "url")) {
      return;
    }

    deletion.refetch();
  }, [deletion.options]);

  useEffect(() => {
    if (signup.success == false) {
      return;
    }

    accounts.refetch();
    addAlert(AlertTypes.SUCCESS, "Account created.");
  }, [signup.success]);

  useEffect(() => {
    if (deletion.success == false) {
      return;
    }

    accounts.refetch();
    addAlert(AlertTypes.SUCCESS, "Account deleted.");
  }, [deletion.success]);

  useEffect(() => {
    if (signup.error == null) {
      return;
    }

    addAlert(AlertTypes.ERROR, signup.error);
  }, [signup.error]);

  useEffect(() => {
    if (deletion.error == null) {
      return;
    }

    addAlert(AlertTypes.ERROR, deletion.error);
  }, [deletion.error]);

  useEffect(() => {
    if (accounts.error == null) {
      return;
    }

    addAlert(AlertTypes.ERROR, accounts.error);
  }, [accounts.error]);

  const handleSignup = () => {
    const options = {
      ...initialSignupOptions,
      body: {
        username,
        password,
      },
    };

    signup.setOptions(options);
  };

  const handleDeletion = () => {
    const options = {
      ...initialDeleteOptions,
      url: `/api/auth/user/${selectedAccount._id}`,
    };

    deletion.setOptions(options);
  };

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise
      .then((d) => {
        const campaignIds = new Set();
        const events = {};
        const messages = [];
        Object.values(d).forEach((entry) => {
          campaignIds.add(entry.CampaignId);

          events[entry.TimelineEventId] = {
            eventId: entry.TimelineEventId,
            campaignId: entry.CampaignId,
          };
          messages.push({
            ChatMessageId: entry.ChatMessageId,
            CampaignId: entry.CampaignId,
            TimelineEventId: entry.TimelineEventId,
            Text: entry.Text,
            SentDateTime: entry.SentDateTime,
          });
        });

        const data = {
          campaignIds: Array.from(campaignIds),
          events: Object.values(events),
          messages,
          userId: selectedAccount._id,
        };

        setImportData(data);
      })
      .catch((err) => {
        console.error(err);
        addAlert(AlertTypes.ERROR, "Failed to convert Excel file.");
      });
  };

  if (!isAuthenticated) {
    navigate("/authentication");
    return <Loader />;
  }

  return (
    <div id="page" className="admin-page">
      <div className="signup-container">
        <Title value="Register" />
        <input
          type="text"
          placeholder="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="button"
          value="Create Account"
          disabled={!username || !password}
          onClick={() => handleSignup()}
        />
      </div>
      <div className="account-container">
        <Title value="Users" />
        <div className="account-list">
          {accounts.data &&
            accounts.data.map((account, index) => {
              const isSelected =
                selectedAccount != null && selectedAccount._id == account._id;

              const className = classNames("account-list-item", {
                selected: isSelected == true,
              });

              return (
                <div
                  key={account._id}
                  className={className}
                  onClick={() => setSelectedAccount(account)}
                >
                  <div>{index + 1}.</div>
                  <div>{account.username}</div>
                </div>
              );
            })}
        </div>
        <input
          disabled={!selectedAccount}
          type="button"
          value="Delete Account"
          onClick={() => handleDeletion()}
        />
        <input
          disabled={!selectedAccount}
          type="file"
          accept=".xls,.xlsx,.xlsm,.xlsb,.xltx,.xltm"
          onChange={(e) => {
            const file = e.target.files[0];
            readExcel(file);
          }}
        />
      </div>
    </div>
  );
};

export default AdminPage;
