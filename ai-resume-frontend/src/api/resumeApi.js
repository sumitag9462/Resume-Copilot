// =============================================================
// src/api/resumeApi.js — RESUME API CALLS
//
// Key note: File upload uses FormData, not JSON.
// We override the Content-Type to 'multipart/form-data' so
// the browser sets the correct boundary automatically.
// =============================================================

import api from './axiosConfig'

// POST /api/resume/upload
// Uploads a PDF or DOCX file. Uses FormData for multipart.
export const uploadResume = async (file) => {
  const formData = new FormData()
  formData.append('resume', file)   // 'resume' must match multer's field name

  const response = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// GET /api/resume/all
// Returns all resumes for the logged-in user
export const getAllResumes = async () => {
  const response = await api.get('/resume/all')
  return response.data
}

// GET /api/resume/:id
// Returns a single resume with its extracted text
export const getResume = async (resumeId) => {
  const response = await api.get(`/resume/${resumeId}`)
  return response.data
}

// DELETE /api/resume/:id
// Deletes the resume file and its MongoDB document
export const deleteResume = async (resumeId) => {
  const response = await api.delete(`/resume/${resumeId}`)
  return response.data
}