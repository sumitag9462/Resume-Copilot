// src/context/ModelContext.jsx — GLOBAL MODEL SELECTOR STATE
//
// Manages the state of the Global Model Selector and Compare Models toggle,
// persisting choices in localStorage.

import { createContext, useContext, useState, useEffect } from "react";

const ModelContext = createContext(null);

export const ModelProvider = ({ children }) => {
  // Load initial states from localStorage if they exist, else defaults
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem("selectedModel") || "auto";
  });

  const [compareMode, setCompareMode] = useState(() => {
    return localStorage.getItem("compareMode") === "true";
  });

  // Persist selections
  useEffect(() => {
    localStorage.setItem("selectedModel", selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem("compareMode", compareMode.toString());
  }, [compareMode]);

  const value = {
    selectedModel,
    setSelectedModel,
    compareMode,
    setCompareMode
  };

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
};

export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModel must be used inside a ModelProvider");
  }
  return context;
};
