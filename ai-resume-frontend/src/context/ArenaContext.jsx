import React, { createContext, useContext, useState } from "react";
import { runArena } from "../api/arenaApi";
import toast from "react-hot-toast";

const ArenaContext = createContext();

export const useArena = () => useContext(ArenaContext);

export const ArenaProvider = ({ children }) => {
  // activeRuns shape: { [featureId]: { isLoading: boolean, arenaRun: object | null } }
  const [activeRuns, setActiveRuns] = useState({});

  /**
   * Triggers an Arena run and tracks it in global state.
   * @param {string} featureId A unique ID for the feature tab (e.g. "cover_letter")
   * @param {object} payload The API payload to send to `runArena`
   */
  const executeRun = React.useCallback(async (featureId, payload) => {
    // Set loading state for this specific feature
    setActiveRuns((prev) => ({
      ...prev,
      [featureId]: { ...prev[featureId], isLoading: true, arenaRun: null }
    }));

    try {
      const data = await runArena(payload);
      // On success, save the run result globally
      setActiveRuns((prev) => ({
        ...prev,
        [featureId]: { isLoading: false, arenaRun: data.arenaRun }
      }));
      
      if (data.arenaRun?.results?.some(r => r.error)) {
        toast.error("Request blocked. See workspace for details.");
      } else {
        toast.success("Generation completed! ✨");
      }
    } catch (err) {
      // On error, clear loading
      setActiveRuns((prev) => ({
        ...prev,
        [featureId]: { isLoading: false, arenaRun: null }
      }));
      toast.error(err.response?.data?.message || "Failed to generate");
    }
  }, []);

  /**
   * Resets the arena run state for a specific feature.
   */
  const clearRun = React.useCallback((featureId) => {
    setActiveRuns((prev) => ({
      ...prev,
      [featureId]: { isLoading: false, arenaRun: null }
    }));
  }, []);

  /**
   * Safely gets the current state for a feature.
   */
  const getRunState = React.useCallback((featureId) => {
    return activeRuns[featureId] || { isLoading: false, arenaRun: null };
  }, [activeRuns]);

  return (
    <ArenaContext.Provider value={{ activeRuns, executeRun, clearRun, getRunState }}>
      {children}
    </ArenaContext.Provider>
  );
};
