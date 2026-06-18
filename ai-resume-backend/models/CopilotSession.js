const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true // used by frontend for React keys
  }
}, { timestamps: true });

const copilotSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model('CopilotSession', copilotSessionSchema);
