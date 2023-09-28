import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import Loader from "../../components/loader/Loader.jsx";
import { AuthenticationContext } from "../../contexts/AuthenticationContext.jsx";
import "./Style.css";

function Authentication() {
  const navigate = useNavigate();
  const { isAuthenticated, attemptLogin, loginError } = useContext(
    AuthenticationContext
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const reloads = useRef(0);

  useEffect(() => {
    if (isAuthenticated) {
      redirect();
    }
  }, [isAuthenticated]);

  reloads.current += 1;

  const redirect = () => {
    const historyCount = window.history.state.idx;
    const historyExists = historyCount > 0;
    if (historyExists) {
      navigate(-1);
    } else {
      navigate("/overview");
    }
  };

  if (isAuthenticated) {
    return <Loader />;
  }

  return (
    <>
      <div id="auth-content">
        <div id="auth-container">
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="button"
            value="Sign in"
            onClick={() => {
              attemptLogin(username, password);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Authentication;
