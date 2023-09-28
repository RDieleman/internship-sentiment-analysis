import { useEffect, useCallback, useState, useContext } from "react";
import useAPI from "../useAPI.jsx";
import { AlertContext, AlertTypes } from "../../contexts/AlertContext.jsx";

const useImportMessages = () => {
  const initialOptions = {
    url: "/api/chat/import",
    method: "POST",
  };

  const { addAlert } = useContext(AlertContext);

  const request = useAPI(initialOptions, false);
  const [data, setData] = useState();

  useEffect(() => {
    const requestDoesNotHaveData = !Object.hasOwn(request.options, "body");
    if (requestDoesNotHaveData) {
      return;
    }

    request.refetch();
  }, [request.options]);

  useEffect(() => {
    if (request.error == null) {
      return;
    }

    addAlert(AlertTypes.ERROR, request.error);
  }, [request.error]);

  useEffect(() => {
    if (request.success == false) {
      return;
    }

    setData(null);
    addAlert(AlertTypes.SUCCESS, "Messages successfully imported.");
  }, [request.success]);

  useEffect(() => {
    if (data == null || data.messages.length == 0) {
      return;
    }

    addAlert(
      AlertTypes.INFO,
      "Attempting to import " + data.messages.length + " messages."
    );

    const options = {
      ...initialOptions,
      body: data,
    };

    request.setOptions(options);
  }, [data]);

  const execute = useCallback((messages) => {
    setData({
      messages,
    });
  });

  return {
    success: request.success,
    failure: request.error != null,
    isFetching: request.isFetching,
    execute,
  };
};

export default useImportMessages;
