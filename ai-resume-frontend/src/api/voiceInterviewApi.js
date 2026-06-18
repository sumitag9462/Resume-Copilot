// =============================================================
// src/api/voiceInterviewApi.js — VOICE INTERVIEW API CLIENT
//
// Axios wrapper functions for all voice interview endpoints.
// Uses the shared axios instance from axiosConfig.js for
// automatic auth token attachment and 401 handling.
// =============================================================

import api from './axiosConfig'

export const startVoiceInterview = async (payload) => {
  const response = await api.post('/voice-interview/start', payload)
  return response.data
}

export const sendVoiceMessage = async (payload) => {
  const response = await api.post('/voice-interview/message', payload)
  return response.data
}

export const endVoiceInterview = async (payload) => {
  const response = await api.post('/voice-interview/end', payload)
  return response.data
}

export const getVoiceInterviewHistory = async () => {
  const response = await api.get('/voice-interview/history')
  return response.data
}

export const getVoiceInterviewSession = async (sessionId) => {
  const response = await api.get(`/voice-interview/history/${sessionId}`)
  return response.data
}

export const deleteVoiceInterviewSession = async (sessionId) => {
  const response = await api.delete(`/voice-interview/history/${sessionId}`)
  return response.data
}
