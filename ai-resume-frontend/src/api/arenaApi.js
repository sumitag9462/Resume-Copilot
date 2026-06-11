// src/api/arenaApi.js — MULTI-MODEL ARENA API WRAPPER
//
// Makes HTTP requests to the backend /api/arena routes.

import api from "./axiosConfig";

/**
 * Runs a feature analysis on the Arena (supporting single and multi-model parallel queries).
 * 
 * @param {object} payload { feature, inputs: { resumeId, jobDescription, goal, etc. }, model, compareMode, forceRefresh }
 */
export const runArena = async (payload) => {
  const response = await api.post("/arena/run", payload);
  return response.data;
};

/**
 * Fetches user's Arena logs.
 * 
 * @param {string} feature Optional feature filter
 */
export const getArenaHistory = async (feature) => {
  const url = feature ? `/arena/history?feature=${feature}` : "/arena/history";
  const response = await api.get(url);
  return response.data;
};

/**
 * Deletes a past Arena record from logs database.
 */
export const deleteArenaHistory = async (id) => {
  const response = await api.delete(`/arena/history/${id}`);
  return response.data;
};
