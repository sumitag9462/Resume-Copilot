// src/api/copilotApi.js
// Streams AI response from the copilot endpoint using fetch + ReadableStream

const getToken = () => localStorage.getItem('token');

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Streams a copilot chat response.
 * @param {object} payload - { messages, resumeText, jobDescription, companyName, targetRole }
 * @param {function} onChunk - called with each text chunk as it arrives
 * @param {function} onDone  - called when the stream finishes
 * @param {function} onError - called on error
 * @returns {AbortController} — call .abort() to stop the stream
 */
export const streamCopilotChat = (payload, onChunk, onDone, onError) => {
  const controller = new AbortController();

  const token = getToken();

  fetch(`${API_BASE}/copilot/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Stream failed' }));
        onError(err.message || 'AI stream failed');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const raw = decoder.decode(value, { stream: true });
          const lines = raw.split('\n').filter((l) => l.startsWith('data: '));

          for (const line of lines) {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.error) { onError(json.error); return; }
              if (json.done) { onDone(); return; }
              if (json.text) onChunk(json.text);
            } catch {
              // Ignore malformed chunks
            }
          }
        }
        onDone();
      };

      pump().catch((err) => {
        if (err.name !== 'AbortError') onError('Connection lost. Please retry.');
      });
    })
    .catch((err) => {
      if (err.name !== 'AbortError') onError('Failed to connect to AI. Check your connection.');
    });

  return controller;
};

/**
 * Generates a short title for a conversation from its first message.
 */
export const generateConversationTitle = async (firstMessage) => {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/copilot/title`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ firstMessage }),
    });
    const data = await res.json();
    return data.title || 'New Conversation';
  } catch {
    return 'New Conversation';
  }
};

// ── CRUD History API ───────────────────────────────────────

export const getSessions = async () => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/copilot/sessions`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
};

export const getSession = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/copilot/sessions/${id}`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
};

export const createSession = async (title, messages = []) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/copilot/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ title, messages })
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
};

export const updateSession = async (id, payload) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/copilot/sessions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload) // { title, messages }
  });
  if (!res.ok) throw new Error('Failed to update session');
  return res.json();
};

export const deleteSession = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/copilot/sessions/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (!res.ok) throw new Error('Failed to delete session');
  return res.json();
};
