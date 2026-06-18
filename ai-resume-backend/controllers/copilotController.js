// ============================================================
// controllers/copilotController.js
// AI Career Copilot — Streaming Chat Controller
//
// Uses Gemini's generateContentStream to stream responses
// back to the frontend as Server-Sent Events (SSE).
//
// Slash command routing maps /ats, /resume, /interview etc
// to specialized system prompt injections.
// ============================================================

const { getGenAIInstance } = require('../services/KeyManager');
const CopilotSession = require('../models/CopilotSession');

// ── Master System Prompt ───────────────────────────────────
const MASTER_SYSTEM_PROMPT = `You are an elite AI Career Copilot — a world-class expert combining the expertise of:
- A Senior Technical Recruiter at top-tier tech companies (FAANG, unicorn startups)
- An ATS Systems Specialist who knows exactly what hiring algorithms look for
- A Professional Resume Writer with 15+ years of experience
- A Career Coach who has helped 10,000+ professionals land their dream roles
- A Technical Interview Coach who has trained engineers at Google, Meta, and Amazon

YOUR PERSONALITY:
- Professional yet warm and encouraging
- Proactively suggest improvements the user hasn't asked for
- Ask intelligent follow-up questions to understand their goals
- Never robotic, never repetitive, always human and insightful
- Confident and direct — give real, actionable feedback

YOUR RESPONSE STYLE:
- Use markdown formatting (headers, bullet points, bold, code blocks)
- Structure responses with clear sections for readability
- Use emojis sparingly but effectively (✅ for good, ⚠️ for warnings, 🎯 for targets)
- Keep responses concise but complete — never pad with filler
- When reviewing resumes or JDs, always include specific, actionable next steps

CAPABILITIES:
- Resume Review & Optimization (ATS scoring, formatting, content)
- Job Description Analysis (requirements extraction, culture fit)
- Interview Preparation (technical, behavioral, HR)
- Cover Letter Generation (professional, startup, creative styles)
- LinkedIn Profile Optimization
- Career Roadmap Planning
- Salary Negotiation Guidance
- Cold Outreach Messages (LinkedIn, Email, Twitter DM)
- Mock Interview Coaching

IMPORTANT: Always respond in a way that feels like talking to a brilliant, caring mentor — not a chatbot.`;

// ── Slash Command System Prompts ───────────────────────────
const SLASH_COMMANDS = {
  '/resume': `You are now in RESUME REVIEW MODE. Analyze the provided resume thoroughly and return a structured review with:
1. Overall ATS Score (0-100) with reasoning
2. Strong sections (what's working well)
3. Weak sections (what needs improvement)
4. Missing keywords for the target role
5. Formatting issues
6. Grammar and clarity issues
7. Specific, actionable improvement suggestions
8. Recruiter's first impression summary`,

  '/ats': `You are now in ATS AUDIT MODE. Perform a deep ATS compatibility analysis:
1. ATS Match Score against the job description
2. Keyword density analysis
3. Missing critical keywords
4. Format compatibility issues (headers, columns, graphics)
5. File format recommendations
6. Section naming conventions
7. Quantification opportunities
8. Priority optimization steps`,

  '/jd': `You are now in JOB DESCRIPTION ANALYSIS MODE. Break down the JD into:
1. Required vs. preferred qualifications
2. Hard skills vs. soft skills
3. Hidden requirements between the lines
4. Company culture signals
5. Red flags or green flags
6. Salary range estimation
7. Interview question predictions
8. Tailoring recommendations for the user's resume`,

  '/interview': `You are now in INTERVIEW PREP MODE. Generate structured interview preparation:
1. Technical questions (role-specific)
2. Behavioral questions (STAR format guidance)
3. Situational questions
4. Resume-based questions (targeting their specific projects)
5. Company-specific questions
6. Questions they should ask the interviewer
7. Common mistakes to avoid`,

  '/mock': `You are now in MOCK INTERVIEW MODE. Conduct a realistic interview simulation:
- Ask one question at a time
- After each answer, provide immediate coaching feedback
- Score the answer (1-10) with reasoning
- Suggest a stronger version of their answer
- Track performance across the session
- End with an overall assessment`,

  '/cover': `You are now in COVER LETTER MODE. Generate a compelling cover letter that:
1. Opens with a powerful, personalized hook
2. Connects their experience directly to the role's needs
3. Highlights 2-3 most relevant achievements with metrics
4. Shows genuine enthusiasm for the company (not generic)
5. Closes with a confident, specific call to action
Offer 3 tone variations: Professional, Startup-Friendly, Creative`,

  '/outreach': `You are now in OUTREACH MODE. Generate personalized networking messages:
1. LinkedIn connection request (under 300 characters)
2. LinkedIn InMail (longer, more detailed)
3. Cold recruiter email (subject line + body)
4. Warm referral request message
5. Post-interview follow-up email
Each should feel genuine, not templated.`,

  '/salary': `You are now in SALARY INTELLIGENCE MODE. Provide:
1. Salary range for the role/location (with data reasoning)
2. Total compensation breakdown (base, equity, bonus, benefits)
3. Negotiation strategy and scripts
4. Counter-offer response templates
5. Red lines and walk-away points
6. Timing recommendations for salary discussions`,

  '/linkedin': `You are now in LINKEDIN OPTIMIZATION MODE. Review and optimize:
1. Headline (keyword-rich, value-focused)
2. About section (hook, story, CTA)
3. Experience descriptions (achievement-focused)
4. Skills section (strategic keyword placement)
5. Featured section recommendations
6. Connection growth strategy
7. Content strategy for visibility`,

  '/roadmap': `You are now in CAREER ROADMAP MODE. Create a personalized plan:
1. Current state assessment
2. Target role gap analysis
3. 30-day quick wins
4. 90-day skill building plan
5. 6-month milestone targets
6. 1-year career vision
7. Resources, courses, and certifications to pursue`,
};

// ── Detect Slash Command ───────────────────────────────────
const detectSlashCommand = (message) => {
  const trimmed = message.trim().toLowerCase();
  for (const cmd of Object.keys(SLASH_COMMANDS)) {
    if (trimmed.startsWith(cmd)) {
      return { command: cmd, rest: message.slice(cmd.length).trim() };
    }
  }
  return null;
};

// ── Build Context String ───────────────────────────────────
const buildContextString = ({ resumeText, jobDescription, companyName, targetRole }) => {
  let context = '';
  if (companyName) context += `\n\nTARGET COMPANY: ${companyName}`;
  if (targetRole) context += `\nTARGET ROLE: ${targetRole}`;
  if (resumeText) context += `\n\nUSER'S RESUME:\n---\n${resumeText}\n---`;
  if (jobDescription) context += `\n\nJOB DESCRIPTION:\n---\n${jobDescription}\n---`;
  return context;
};

// ── Main Chat Handler (Streaming SSE with Retries) ──────────
const streamChat = async (req, res) => {
  try {
    const {
      messages = [],
      resumeText = '',
      jobDescription = '',
      companyName = '',
      targetRole = '',
    } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ message: 'No messages provided.' });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Check for slash commands in the latest message
    const latestMessage = messages[messages.length - 1];
    let userContent = latestMessage.content;
    const slashDetected = detectSlashCommand(userContent);

    if (slashDetected) {
      userContent = `[MODE: ${slashDetected.command}]\n${SLASH_COMMANDS[slashDetected.command]}\n\nUser request: ${slashDetected.rest || 'Please begin.'}`;
    }

    // Build chat history
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const systemInstruction = MASTER_SYSTEM_PROMPT + buildContextString({ resumeText, jobDescription, companyName, targetRole });

    // Retry Logic for Rate Limits (429) and Auth (401)
    const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
    let success = false;

    for (const modelName of MODELS_TO_TRY) {
      if (success) break;
      let attempt = 1;
      const maxRetries = 3;

      while (attempt <= maxRetries && !success) {
        try {
          // getGenAIInstance() rotates to a new key internally on each call!
          const model = getGenAIInstance().getGenerativeModel({
            model: modelName,
            systemInstruction
          });

          const chat = model.startChat({ history });
          const result = await chat.sendMessageStream(userContent);

          // Stream chunks to client
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
          }
          success = true; // Stream completed successfully
        } catch (error) {
          const isTemporary = error.message?.includes('429') || error.message?.includes('401') || error.message?.includes('503') || error.message?.includes('Quota');
          console.warn(`[Copilot] Model ${modelName} failed on attempt ${attempt}. Error: ${error.message}`);
          
          if (isTemporary && attempt < maxRetries) {
            attempt++;
            // We just loop again; getGenAIInstance() will fetch a new key automatically.
          } else {
            break; // Break the while loop to try the next model (e.g. flash-lite)
          }
        }
      }
    }

    if (!success) {
      // If all models and all keys failed
      res.write(`data: ${JSON.stringify({ error: 'Our AI models are currently experiencing extremely high demand. Please wait a moment and try again.' })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    }
    
    res.end();
  } catch (error) {
    console.error('Copilot Fatal Stream Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'AI stream failed. Please try again.' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted. Please retry.' })}\n\n`);
      res.end();
    }
  }
};

// ── Auto Title Generator ───────────────────────────────────
const generateTitle = async (req, res) => {
  try {
    const { firstMessage } = req.body;
    if (!firstMessage) return res.json({ title: 'New Conversation' });

    const model = getGenAIInstance().getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(
      `Generate a short, 4-6 word title for a career coaching conversation that starts with: "${firstMessage}". Return ONLY the title, no quotes, no punctuation at end.`
    );
    const title = result.response.text().trim().slice(0, 60);
    res.json({ title });
  } catch {
    res.json({ title: 'New Conversation' });
  }
};

// ── CRUD Controllers for Chat History ────────────────────────

// @desc    Get all sessions for a user
// @route   GET /api/copilot/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    const sessions = await CopilotSession.find({ userId: req.user._id })
      .select('-messages') // Don't send full messages array for the sidebar list
      .sort('-createdAt');
    res.json(sessions);
  } catch (error) {
    console.error('Get Sessions Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single session by ID
// @route   GET /api/copilot/sessions/:id
// @access  Private
const getSession = async (req, res) => {
  try {
    const session = await CopilotSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Get Session Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new session
// @route   POST /api/copilot/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const { title, messages } = req.body;
    const session = await CopilotSession.create({
      userId: req.user._id,
      title: title || 'New Conversation',
      messages: messages || []
    });
    res.status(201).json(session);
  } catch (error) {
    console.error('Create Session Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a session (rename or append messages)
// @route   PUT /api/copilot/sessions/:id
// @access  Private
const updateSession = async (req, res) => {
  try {
    const { title, messages } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (messages) updateData.messages = messages;

    const session = await CopilotSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: updateData },
      { new: true } // Return updated document
    );
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Update Session Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a session
// @route   DELETE /api/copilot/sessions/:id
// @access  Private
const deleteSession = async (req, res) => {
  try {
    const session = await CopilotSession.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete Session Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { 
  streamChat, 
  generateTitle,
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession
};
