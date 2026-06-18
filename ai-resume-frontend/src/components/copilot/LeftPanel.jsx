// src/components/copilot/LeftPanel.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, History, Plus, MoreVertical, Edit2, Trash2, Check, X } from 'lucide-react';

const SessionItem = ({ session, active, onSelect, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title);

  const handleSave = (e) => {
    e.stopPropagation();
    if (editTitle.trim() && editTitle !== session.title) {
      onRename(session._id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditTitle(session.title);
    setIsEditing(false);
  };

  return (
    <div className="relative group mb-1">
      <button
        onClick={() => !isEditing && onSelect(session)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2.5 
                    ${active ? 'bg-accent-violet/15 text-accent-violet-light font-medium' : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'}`}
      >
        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-accent-violet' : 'text-text-muted group-hover:text-text-secondary'}`} />
        
        {isEditing ? (
          <div className="flex-1 flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave(e)}
              autoFocus
              className="w-full bg-[#1A1D24] text-white px-1 py-0.5 rounded text-xs focus:outline-none border border-accent-violet/50"
            />
            <Check onClick={handleSave} className="w-3.5 h-3.5 text-green-400 cursor-pointer hover:text-green-300 shrink-0" />
            <X onClick={handleCancel} className="w-3.5 h-3.5 text-red-400 cursor-pointer hover:text-red-300 shrink-0" />
          </div>
        ) : (
          <div className="flex-1 truncate leading-tight pr-6">{session.title}</div>
        )}
      </button>

      {!isEditing && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="p-1 rounded bg-[#181C24] hover:bg-white/10 text-text-muted hover:text-white"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(session._id); }}
            className="p-1 rounded bg-[#181C24] hover:bg-red-500/20 text-text-muted hover:text-red-400"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, icon: Icon, children }) => {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;
  return (
    <div className="mb-5">
      <h3 className="text-[10px] uppercase tracking-widest text-text-muted font-bold px-3 mb-2 flex items-center gap-1.5">
        <Icon className="w-3 h-3" />
        {title}
      </h3>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
};

export default function LeftPanel({ 
  isOpen, 
  onNewChat, 
  sessions = [], 
  activeSessionId, 
  onSelectSession, 
  onDeleteSession, 
  onRenameSession 
}) {
  const [search, setSearch] = useState('');

  const filteredSessions = sessions.filter(s => s.title?.toLowerCase().includes(search.toLowerCase()));

  // We could group sessions by Today, Previous 7 Days, etc., but for now we list all under History
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className="w-64 h-full border-r border-white/[0.06] bg-[#0A0B0F]/90 flex flex-col flex-shrink-0"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 256, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ backdropFilter: 'blur(16px)' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">AI Workspace</h2>
            <button
              onClick={onNewChat}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-text-secondary transition-colors"
              title="New Conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search history..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#111318] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-text-primary 
                           placeholder:text-text-muted focus:outline-none focus:border-accent-violet/30 transition-colors"
              />
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
            <Section title="Recent Conversations" icon={History}>
              {filteredSessions.map(session => (
                <SessionItem 
                  key={session._id} 
                  session={session} 
                  active={session._id === activeSessionId}
                  onSelect={onSelectSession}
                  onDelete={onDeleteSession}
                  onRename={onRenameSession}
                />
              ))}
            </Section>
            
            {filteredSessions.length === 0 && (
              <div className="px-3 text-xs text-text-muted italic text-center mt-4">
                No conversations found.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
