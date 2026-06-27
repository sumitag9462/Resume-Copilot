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

export const streamVoiceMessage = async (payload) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
  const response = await fetch(`${API_URL}/voice-interview/message-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.body.getReader()
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
