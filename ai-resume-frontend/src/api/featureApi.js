import api from './axiosConfig'

export const enhanceResumeBullet = async (payload) => {
  const response = await api.post('/resume/enhance', payload)
  return response.data
}

export const enhanceResumeBullets = async (payload) => {
  const response = await api.post('/bullets/enhance-bulk', payload) // Left untouched as not requested
  return response.data
}

export const generateInterviewQuestions = async (payload) => {
  const response = await api.post('/interview/generate', payload)
  return response.data
}

export const regenerateInterviewQuestions = async (payload) => {
  const response = await api.post('/interview/regenerate', payload)
  return response.data
}

export const getInterviewHistory = async () => {
  const response = await api.get('/interview/history')
  return response.data
}

export const deleteInterviewHistory = async (id) => {
  const response = await api.delete(`/interview/history/${id}`)
  return response.data
}

export const analyzeWeakLanguage = async (payload) => {
  const response = await api.post('/resume/scan', payload)
  return response.data
}

export const rebuildResume = async (payload) => {
  const response = await api.post('/resume/rebuild', payload)
  return response.data
}

export const getRebuildHistory = async () => {
  const response = await api.get('/resume/history')
  return response.data
}

export const deleteRebuildHistory = async (id) => {
  const response = await api.delete(`/resume/history/${id}`)
  return response.data
}
