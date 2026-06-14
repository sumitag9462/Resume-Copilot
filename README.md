# Resume Copilot 🚀

**Resume Copilot** is a premium, AI-powered career assistant and optimization platform. It goes beyond simple resume parsing by helping job seekers analyze, boost, and benchmark their resumes, write tailored cover letters, run mock interviews, and view their profiles through an AI recruiter simulator.

---

## 🌟 Features

- **📊 ATS Score Analysis**: Instant applicant tracking system compatibility checks with keyword suggestions and section-by-section scoring.
- **🎯 JD Match Score**: Paste any job description to benchmark your compatibility and identify key skill gaps.
- **✨ Resume Boost & Bullet Enhancer**: Optimize your bullet points using AI, detecting and replacing weak language, passive voice, and filler words.
- **🎙️ Mock Interview Prep**: Receive custom, resume-tailored interview questions and practice your answers in an interactive simulation.
- **🕵️ Recruiter Simulator**: Get an honest, simulated recruiter review showing how a human hiring manager would rate your profile.
- **⚔️ Resume Arena & Version Compare**: Battle-test and compare different resume versions to select the strongest one for a specific application.
- **✉️ Cover Letter Generator**: Generate professional, formal, creative, or startup-style cover letters in one click.

---

## 🛠️ Technology Stack

### Frontend
- **React** with **Vite**
- **Tailwind CSS** (Styling)
- **Framer Motion** (Transitions & animations)
- **Lucide Icons**
- **Recharts** (Visualizing ATS and match scores)

### Backend
- **Node.js** with **Express**
- **MongoDB** with Mongoose
- **Google Gemini API** (using `@google/generative-ai`)
- **JWT** (Authentication)
- **Multer & pdf-parse / mammoth** (File parsing and uploads)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** instance (local or Atlas)
- **Google Gemini API Key**

### 1. Installation
Clone the repository and install dependencies for both the frontend and backend:

```bash
# Clone the repository
git clone https://github.com/your-username/resume-copilot.git
cd resume-copilot

# Install root dependencies
npm install

# Install Frontend dependencies
cd ai-resume-frontend
npm install

# Install Backend dependencies
cd ../ai-resume-backend
npm install
```

### 2. Configuration
Create a `.env` file in the `ai-resume-backend/` directory:

```bash
cd ai-resume-backend
cp .env.example .env
```

Open the `.env` file and configure your credentials:
```env
# Required
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key

# Optional — OTP emails (falls back to terminal logging if not set)
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=your_verified_email@example.com

PORT=5000
```

### 3. Running Locally
You can run the frontend and backend concurrently from the root directory using the predefined NPM scripts:

```bash
# From the root project directory:

# Start the frontend dev server (runs on port 3000)
npm run dev:frontend

# Start the backend server (runs on port 5000)
npm run dev:backend
```

---

## 🧪 Running Tests
The backend features an automated test suite powered by Jest. To run the tests, execute the following command:

```bash
cd ai-resume-backend
npx jest tests/app.test.js
```

---

## 📄 License
This project is licensed under the ISC License.
