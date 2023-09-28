import { createContext, useCallback, useContext, useEffect } from "react";
import useAPI from "../hooks/useAPI.jsx";
import { AlertContext, AlertTypes } from "./AlertContext.jsx";
export const AuthenticationContext = createContext();

export function AuthenticationContextProvider({ children }) {
  const { addAlert } = useContext(AlertContext);

  const session = useAPI({
    url: "/api/auth/user/me",
    method: "GET",
  });

  const signinBaseOptions = {
    url: "/api/auth/public/signin",
    method: "POST",
  };

  const signin = useAPI(signinBaseOptions, false);

  const signout = useAPI(
    {
      url: "/api/auth/signout",
      method: "POST",
    },
    false
  );

  useEffect(() => {
    if (signin.error == null) {
      return;
    }

    addAlert(AlertTypes.ERROR, "Sign in failed.");
  }, [signin.error]);

  useEffect(() => {
    if (signout.error == null) {
      return;
    }

    addAlert(AlertTypes.ERROR, "Signout failed.");
  }, [signout.error]);

  useEffect(() => {
    if (session.data == null) {
      console.log("No session found.");
      return;
    }
  }, [session.data]);

  useEffect(() => {
    if (!Object.hasOwn(signin.options, "body")) {
      return;
    }

    signin.refetch();
  }, [signin.options]);

  useEffect(() => {
    if (signin.isFetching == true) {
      return;
    }

    session.refetch();
  }, [signin.isFetching]);

  useEffect(() => {
    if (signout.isFetching == true) {
      return;
    }

    session.refetch();
  }, [signout.isFetching]);

  const isAuthenticated = session.data != null;

  const attemptLogin = (username, password) => {
    const options = {
      ...signinBaseOptions,
      body: {
        username,
        password,
      },
    };

    signin.setOptions(options);
  };

  const logout = useCallback(() => {
    signout.refetch();
  });

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        session: session.data,
        attemptLogin,
        loginError: signin.error,
        logout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
