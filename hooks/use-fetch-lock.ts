import { useCallback, useState } from "react";

// Type for the fetching states
interface FetchingStates {
  [key: string]: boolean;
}

// Custom hook to lock asynchronous functions
const useFetchLock = () => {
  const [fetchingStates, setFetchingStates] = useState<FetchingStates>({});

  const fetchWithLock = useCallback(
    async (key: string, fn: () => Promise<void>) => {
      // If already fetching for this key, return early
      if (fetchingStates[key]) return;

      setFetchingStates((prev) => ({ ...prev, [key]: true })); // Set the fetching flag to true for this key
      try {
        await fn(); // Execute the async function
      } catch (error) {
        console.error("Error during fetch:", error);
      } finally {
        setFetchingStates((prev) => ({ ...prev, [key]: false })); // Reset the fetching flag for this key
      }
    },
    [fetchingStates]
  );

  return (key: string, fn: () => Promise<void>) => () => fetchWithLock(key, fn);
};

export default useFetchLock;
