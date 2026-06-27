// src/pages/CopilotPage.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CopilotLayout from '../components/copilot/CopilotLayout';
import MessageList from '../components/copilot/MessageList';
import InputComposer from '../components/copilot/InputComposer';
import { streamCopilotChat, generateConversationTitle, getSessions, createSession, updateSession, deleteSession } from '../api/copilotApi';
import DashboardLayout from '../components/layout/DashboardLayout';
import toast from 'react-hot-toast';

export default function CopilotPage() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  
  // Chat History State
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  
  const abortControllerRef = useRef(null);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      toast.error('Failed to load sessions');
      console.error(error);
    }
  };

  // Stop currently streaming message
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    
    // Save whatever chunk we received so far
    if (streamingContent) {
      const finalMsg = { role: 'assistant', content: streamingContent, id: Date.now().toString() };
      setMessages(prev => {
        const newHistory = [...prev, finalMsg];
        if (activeSessionId) {
          updateSession(activeSessionId, { messages: newHistory }).catch(console.error);
        }
        return newHistory;
      });
      setStreamingContent('');
    }
  };

  const handleSend = async (content, specificMessages = null) => {
    if (isStreaming) return;
    
    const newUserMsg = { role: 'user', content, id: Date.now().toString() };
    const chatHistory = specificMessages || [...messages, newUserMsg];
    
    // Update UI immediately
    if (!specificMessages) {
      setMessages(chatHistory);
    }
    
    setIsStreaming(true);
    setStreamingContent('');

    // If this is a new chat, create it in DB first
    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      try {
        const newSession = await createSession('New Conversation', chatHistory);
        currentSessionId = newSession._id;
        setActiveSessionId(currentSessionId);
        // Refresh sidebar
        setSessions(prev => [newSession, ...prev]);
        
        // Auto-generate title in background
        generateConversationTitle(content).then(async (title) => {
          await updateSession(newSession._id, { title });
          setSessions(prev => prev.map(s => s._id === newSession._id ? { ...s, title } : s));
        });
      } catch (err) {
        console.error("Failed to create session in DB", err);
      }
    } else {
      // Append user message to existing DB session
      updateSession(currentSessionId, { messages: chatHistory }).catch(console.error);
    }

    const activeContext = {
      resumeText: localStorage.getItem('lastParsedResume') || '',
      jobDescription: '',
      companyName: ''
    };

    abortControllerRef.current = streamCopilotChat(
      { messages: chatHistory, ...activeContext },
      // onChunk
      (chunk) => {
        setStreamingContent(prev => prev + chunk);
      },
      // onDone
      () => {
        setIsStreaming(false);
      },
      // onError
      (errorMsg) => {
        setIsStreaming(false);
        setMessages(prev => {
          const newHistory = [...prev, { role: 'assistant', content: `**Error:** ${errorMsg}`, id: Date.now().toString() }];
          if (currentSessionId) updateSession(currentSessionId, { messages: newHistory }).catch(console.error);
          return newHistory;
        });
        setStreamingContent('');
      }
    );
  };

  // Effect to flush streamingContent into messages when streaming finishes successfully
  useEffect(() => {
    if (!isStreaming && streamingContent) {
      const finalMsg = { role: 'assistant', content: streamingContent, id: Date.now().toString() };
      setMessages(prev => {
        const newHistory = [...prev, finalMsg];
        if (activeSessionId) {
          updateSession(activeSessionId, { messages: newHistory }).catch(console.error);
        }
        return newHistory;
      });
      setStreamingContent('');
    }
  }, [isStreaming, streamingContent, activeSessionId]);

  const handleRegenerate = (index) => {
    if (index === 0) return;
    const historyToResend = messages.slice(0, index);
    setMessages(historyToResend);
    const lastUserMsg = historyToResend[historyToResend.length - 1];
    if (lastUserMsg?.role === 'user') {
      handleSend(lastUserMsg.content, historyToResend);
    }
  };

  const handleAction = (cmd) => {
    handleSend(cmd);
  };

  const handleNewChat = () => {
    if (isStreaming) handleStop();
    setMessages([]);
    setStreamingContent('');
    setActiveSessionId(null);
  };

  const handleSelectSession = (session) => {
    if (isStreaming) handleStop();
    setActiveSessionId(session._id);
    setMessages(session.messages || []);
    setStreamingContent('');
  };

  const handleDeleteSession = async (id) => {
    try {
      await deleteSession(id);
      setSessions(prev => prev.filter(s => s._id !== id));
      if (activeSessionId === id) {
        handleNewChat();
      }
      toast.success('Chat deleted');
    } catch (err) {
      toast.error('Failed to delete chat');
    }
  };

  const handleRenameSession = async (id, newTitle) => {
    try {
      await updateSession(id, { title: newTitle });
      setSessions(prev => prev.map(s => s._id === id ? { ...s, title: newTitle } : s));
    } catch (err) {
      toast.error('Failed to rename chat');
    }
  };

  return (
    <DashboardLayout fullScreen={true}>
      <CopilotLayout 
        onNewChat={handleNewChat} 
        activeContext={{}} 
        onQuickAction={handleAction}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
      >
        <div className="flex-1 flex flex-col h-full bg-[#0A0B0F] relative">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#111318] to-transparent pointer-events-none z-10" />
          <MessageList
            messages={messages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            onPrompt={handleAction}
            onRegenerate={handleRegenerate}
          />
          <div className="shrink-0 bg-gradient-to-t from-[#0A0B0F] via-[#0A0B0F] to-transparent pt-6 z-20">
            <div className="max-w-3xl mx-auto w-full">
              <InputComposer
                onSend={handleSend}
                onStop={handleStop}
                isStreaming={isStreaming}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </CopilotLayout>
    </DashboardLayout>
  );
}
