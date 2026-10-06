# FileSync — Real-Time File Sharing & AI Productivity Platform

![FileSync SaaS Platform](frontend/public/favicon.svg)

FileSync is a modern, full-stack, real-time file sharing and AI-powered productivity platform. Built with React, Node.js, Express, MongoDB, Socket.io, JWT Authentication, and Google Gemini 2.5 Flash AI, FileSync enables seamless cross-user file sharing, live transfer progress tracking, and instant AI file analysis.

---

## 🚀 Features

### 📡 Real-Time User-to-User File Sharing
- **Asynchronous Uploads:** Fast drag-and-drop file upload with SHA-256 integrity verification checksums.
- **Cross-User Transfers:** Direct user-to-user file transfers with instant target user selection.
- **Live Transfer Tracking:** Real-time transfer status (Pending, Uploading, Completed, Failed) with live percentage progress via WebSockets (`Socket.io`).
- **Secure File Access:** Strict authorization model guaranteeing only senders and authorized recipients can access or download files.

### 🤖 Gemini AI Productivity Hub
- **Server-Side Security:** Google Gemini API calls are strictly handled on the Express backend—API keys are never exposed to the client browser.
- **File Summarization:** Generate instant, structured summaries for uploaded documents and text content.
- **Content Insights:** Extract key takeaways, structured bullet points, and actionable insights.
- **Contextual Q&A:** Interactive Q&A allowing users to ask specific questions about any file's content.

### 🔒 Enterprise JWT Security
- User registration and login with encrypted `bcryptjs` password hashing.
- Stateless JSON Web Tokens (JWT) for protected API endpoints.
- Secure session state management and auto-logout on token expiration.

### 🎨 Modern SaaS User Interface
- Ultra-sleek dark theme designed with glassmorphism, glowing indigo/purple gradients, and smooth micro-interactions.
- Fully responsive across desktop, tablet, and mobile displays.
- Real-time toast notifications for incoming file transfer alerts and completions.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, TailwindCSS v4, Lucide Icons, Socket.io-Client, Axios |
| **Backend** | Node.js, Express.js, TypeScript, Mongoose (MongoDB ORM), Multer, Socket.io |
| **Database** | MongoDB (Users, Files, Transfers, AI Analysis persistence) |
| **AI Integration**| Google Gemini API (`@google/genai` - `gemini-2.5-flash`) |
| **Authentication**| JWT (JSON Web Token), `bcryptjs` |

---

## 📁 Repository Structure

```text
FileSync/
├── frontend/                 # React.js SPA Application
│   ├── public/               # Favicon and static assets
│   ├── src/
│   │   ├── components/       # UI Components (Navbar, FileManager, Modals, Drawers)
│   │   ├── context/          # React Contexts (AuthContext, TransferContext)
│   │   ├── pages/            # View Pages (LoginPage, RegisterPage, DashboardPage)
│   │   ├── services/         # Axios API client & Socket.io integration
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Main App component
│   │   ├── index.css         # Styling system & TailwindCSS directives
│   │   └── main.tsx          # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                  # Node.js + Express REST & Socket Server
│   ├── src/
│   │   ├── config/           # Database connection config
│   │   ├── controllers/      # Auth, File, Transfer, and AI controllers
│   │   ├── middleware/       # Auth guard (protect) & Multer upload middleware
│   │   ├── models/           # Mongoose schemas (User, File, Transfer, AIAnalysis)
│   │   ├── routes/           # Express API endpoints (/auth, /files, /transfers, /ai)
│   │   ├── services/         # Gemini AI service & Socket.io service
│   │   ├── utils/            # JWT token generator
│   │   └── index.ts          # Server entry point
│   ├── uploads/              # Local disk storage directory for uploaded files
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── tsconfig.json
├── .gitignore                # Production ignore configuration
├── README.md                 # Project documentation
└── prompt.md                 # Authoritative specification prompt
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the `backend/` directory using `backend/.env.example` as a template:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/filesync
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

---

## 🚦 Getting Started

### Prerequisites
- **Node.js**: v18.0+
- **MongoDB**: Local MongoDB community server running on `mongodb://localhost:27017` or MongoDB Atlas URI.
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/souvik-10/FileSync.git
   cd FileSync
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🏃 Running the Application

### 1. Start the Backend Server
From the `backend/` directory:
```bash
npm run dev
```
*The Express server will start on `http://localhost:5000` with WebSocket support.*

### 2. Start the Frontend Client
From the `frontend/` directory:
```bash
npm run dev
```
*The Vite React development server will start on `http://localhost:5173`.*

---

## 🛠️ Build Commands

### Backend Production Build
```bash
cd backend
npm run build
```

### Frontend Production Build
```bash
cd frontend
npm run build
```

---

## 🧪 Testing Multi-User Real-Time Transfers

To test the real-time cross-user file transfer functionality locally:
1. Open `http://localhost:5173` in a regular browser window and register **User A** (e.g. `userA@example.com`).
2. Open `http://localhost:5173` in an Incognito/Private window and register **User B** (e.g. `userB@example.com`).
3. Upload a file as **User A**, click the **Share** icon, select **User B**, and send.
4. Watch the real-time transfer progress bar update simultaneously in both browser windows!

---

## 🛡️ License

Built to high-performance SaaS standards under the MIT License.
