import { useState, useCallback } from "react";

// Custom React hook for handling HTTP requests
export const useHttp = () => {
  // State to track the loading status of the HTTP request
  const [loading, setLoading] = useState(false);
  // State to track any errors that occur during the HTTP request
  const [error, setError] = useState(null);

  // Function to perform an HTTP request, memoized using useCallback
  const request = useCallback(
    async (
      url, // The URL to send the request to
      method = "GET", // HTTP method, defaults to "GET"
      body = null, // Request body, defaults to null
      headers = { "Content-Type": "application/json" } // Default headers
    ) => {
      setLoading(true); // Set loading to true before starting the request
      setError(null); // Clear any previous errors
      try {
        // Perform the HTTP request using the Fetch API
        const response = await fetch(url, { method, body, headers });

        // Check if the response status is not OK (status code 200-299)
        if (!response.ok) {
          throw new Error(`Could not fetch ${url}, status: ${response.status}`);
        }

        // Parse the response body as JSON
        const data = await response.json();

        setLoading(false); // Set loading to false after the request is complete
        return data; // Return the parsed data
      } catch (e) {
        setLoading(false); // Ensure loading is set to false in case of an error
        setError(e.message); // Set the error message
        throw e; // Re-throw the error to allow further handling
      } finally {
        setLoading(false); // Ensure loading is set to false in all cases
      }
    },
    [] // Dependencies array is empty, so the function is memoized once
  );

  // Function to clear the error state, memoized using useCallback
  const clearError = useCallback(() => setError(null), []);

  // Return the state and functions to the component using this hook
  return { loading, request, error, clearError };
};
