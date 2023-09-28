import { useState, useEffect, useRef, useCallback } from "react";

const useAPI = (initialOptions, autoRefetch = true) => {
  const [options, setOptions] = useState(initialOptions);
  const [data, setData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const abortController = useRef(null);

  const fetchApi = useCallback(async () => {
    setError(null);
    setSuccess(false);
    setIsFetching(true);
    // If there's an ongoing fetch, cancel it
    if (abortController.current) {
      abortController.current.abort();
    }
    // Create a new AbortController for the new fetch
    abortController.current = new AbortController();
    try {
      const response = await fetch(options.url, {
        method: options.method || "GET",
        headers: options.headers || {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options.body) || null,
        signal: abortController.current.signal, // Pass the abort signal
      });

      const contentLength = response.headers.get("Content-Length");
      const responseHasData = contentLength != null && contentLength !== "0";
      let data;
      if (responseHasData) {
        data = await response.json();
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (responseHasData && Object.hasOwn(data, "errors")) {
          const errorMessages = data.errors.map((error) => error.message);
          errorMessage = `Request failed, because: ${errorMessages.join(
            ", "
          )}.`;
        }
        throw new Error(errorMessage);
      }

      if (responseHasData) {
        setData(data);
      }

      setSuccess(true);
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Fetch cancelled");
      } else {
        setError(err.message);
        setData(null);
      }
    } finally {
      setIsFetching(false);
    }
  }, [options]);

  useEffect(() => {
    if (autoRefetch) {
      fetchApi();
    }
    // Clean up function to cancel ongoing fetch when component unmounts
    return () => abortController.current?.abort();
  }, [fetchApi, autoRefetch]);

  return {
    data,
    isFetching,
    error,
    refetch: fetchApi,
    setOptions,
    options,
    success,
  };
};

export default useAPI;
