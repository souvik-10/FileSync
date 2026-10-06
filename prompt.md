# FileSync --- Antigravity Gemini 3.1 Pro High Master Build Prompt

## ROLE

You are a senior full-stack software engineer working inside the
existing **FileSync** project directory.

Build FileSync to a professional, production-level standard using
**Antigravity with Gemini 3.1 Pro (High)**.

Inspect the existing repository before changing anything. Preserve
correct existing work and continue from the current state if
implementation already exists.

------------------------------------------------------------------------

## 1. PROJECT

**Project Name:** FileSync

**Goal:** Build a full-stack, real-time file sharing and AI-powered
productivity platform with live communication, smart file analysis,
secure authentication, and efficient asynchronous file handling.

------------------------------------------------------------------------

## 2. STRICT TECHNOLOGY STACK

Use only these application technologies:

-   React.js
-   Node.js
-   Express.js
-   MongoDB
-   Google Gemini API
-   JWT Authentication

Do not replace, switch, or add another core technology, database, AI
provider, authentication provider, or cloud platform.

Normal supporting packages required to implement the fixed stack are
allowed, but do not introduce unrelated product technologies.

------------------------------------------------------------------------

## 3. PROJECT DESCRIPTION --- STRICT SCOPE

Build exactly the product described below:

> A full-stack real-time file sharing and AI-powered productivity
> platform with live communication and smart file analysis features.

Required capabilities:

### Real-time file sharing

-   User-to-user file sharing
-   File upload
-   File download
-   File transfer status/progress
-   Real-time transfer updates
-   Cross-device communication through the application
-   File metadata management
-   Reliable asynchronous file handling
-   Clear transfer states such as pending, uploading, completed, and
    failed where appropriate

### Live communication

Implement only the real-time communication required by the file-sharing
workflow, including relevant transfer/status updates.

Do not add unrelated social/chat/community functionality.

### Google Gemini AI

Integrate Google Gemini API for:

-   File summarization
-   Content insights
-   Instant contextual response generation

Gemini must be connected to FileSync's file/productivity workflow, not
implemented as an unrelated generic chatbot.

Keep the Gemini API key on the server side and never expose it to the
React client.

Use the official Gemini API approach when implementation details are
uncertain: https://ai.google.dev/gemini-api/docs

### MongoDB

Use MongoDB for the application's required data, including as
appropriate:

-   Users
-   File metadata
-   File-sharing/transfer records
-   AI analysis metadata/results
-   Authentication-related data
-   Data required by the real-time file-sharing workflow

Use appropriate schemas, indexes, validation, references, timestamps,
and efficient queries.

### JWT authentication

Implement:

-   User registration
-   User login
-   JWT creation
-   JWT verification
-   Protected backend routes
-   Authorization
-   Secure user-specific file/transfer access
-   Logout/session handling appropriate to JWT
-   Client authentication state
-   Invalid/expired token handling

Never hardcode secrets. Use environment variables for MongoDB, JWT,
Gemini, and other required configuration.

Create `.env.example` files without real secrets.

------------------------------------------------------------------------

## 4. UI / UX

Create a very beautiful, modern, unique, professional, and highly
responsive UI.

The application should feel like a real production SaaS/productivity
application, not a basic college project.

Include:

-   Consistent visual system
-   Strong typography hierarchy
-   Professional spacing
-   Clear actions
-   Attractive cards/panels where useful
-   Upload/transfer progress visualization
-   File information
-   Loading states
-   Empty states
-   Error states
-   Success feedback
-   Responsive navigation
-   Accessible forms and controls
-   Useful feedback during AI processing

Support desktop, laptop, tablet, and mobile layouts.

Do not add unrelated UI sections or features.

------------------------------------------------------------------------

## 5. PRODUCTION-LEVEL ARCHITECTURE

Use a professional maintainable full-stack architecture.

A suitable structure is:

``` text
FileSync/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── ...
│   ├── public/
│   └── ...
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   └── ...
│   ├── uploads/
│   └── ...
├── .gitignore
├── README.md
└── prompt.md
```

This is guidance, not permission to create unnecessary abstractions.
Keep the architecture professional, clean, and maintainable.

------------------------------------------------------------------------

## 6. BACKEND

Build the Express backend professionally.

Use appropriate:

-   Express setup
-   Environment configuration
-   MongoDB connection
-   Models
-   Controllers
-   Routes
-   Services
-   Authentication middleware
-   Error middleware
-   Request validation
-   File handling
-   Gemini service
-   Real-time communication
-   Secure response handling
-   Correct HTTP status codes
-   Centralized errors

Keep substantial business logic in services where practical. Avoid
duplicated logic.

Do not expose secrets or internal errors.

------------------------------------------------------------------------

## 7. FILE HANDLING

Implement:

-   Upload
-   File metadata
-   Ownership
-   Sender/recipient access
-   Download/access authorization
-   Transfer status
-   File validation
-   Safe file naming/storage
-   Error handling
-   Appropriate cleanup

Do not commit uploaded user files to Git.

------------------------------------------------------------------------

## 8. REAL-TIME

The real-time mechanism must support the actual FileSync workflow.

Appropriate events include:

-   Transfer initiated
-   Upload/transfer progress or status
-   Transfer completed
-   Transfer failed
-   Recipient-side status
-   Relevant live communication required by file sharing

Do not add unrelated real-time features.

------------------------------------------------------------------------

## 9. GEMINI SERVICE

Create a dedicated backend Gemini service.

Support:

### File summarization

Generate useful summaries from supported file/content data.

### Content insights

Generate useful insights from provided file/content.

### Instant responses

Generate contextual responses based on file/content and the user's
request.

Rules:

-   Gemini calls remain server-side.
-   Never expose `GEMINI_API_KEY` in the browser.
-   Handle API errors and timeouts gracefully.
-   Show AI loading states.
-   Avoid unnecessary Gemini requests.
-   Do not add another AI provider.
-   Do not turn the product into a generic chatbot.

------------------------------------------------------------------------

## 10. SECURITY

Implement JWT authentication professionally.

Requirements:

-   Password hashing
-   JWT signing
-   JWT verification
-   Protected routes
-   Authorization checks
-   User-specific resource access
-   Invalid/expired-token handling
-   Secure authentication state
-   Appropriate logout behavior

Never:

-   hardcode secrets
-   expose Gemini keys
-   commit `.env`
-   trust client-provided ownership
-   allow unauthorized access to another user's private files

------------------------------------------------------------------------

## 11. API DESIGN

Create clean REST API routes around actual FileSync functionality.

Possible resource groups:

``` text
/auth
/users
/files
/transfers
/ai
```

Only create routes that are actually needed.

Every endpoint should use authentication/authorization where required,
input validation, correct status codes, and consistent error handling.

------------------------------------------------------------------------

## 12. DATABASE DESIGN

Design professional MongoDB schemas for the required entities:

-   Users
-   Files
-   Transfers/file-sharing records
-   AI analysis/results where persistence is useful

Use appropriate:

-   indexes
-   references
-   validation
-   timestamps
-   efficient queries

Avoid unnecessary redundant data.

------------------------------------------------------------------------

## 13. PERFORMANCE

Follow the description's goals of improving responsiveness and transfer
efficiency.

Use sensible practices such as:

-   asynchronous file operations
-   efficient database queries
-   indexes
-   avoiding unnecessary API calls
-   efficient React rendering
-   controlled file processing
-   appropriate loading states

Do not claim specific percentage improvements unless actually measured.

------------------------------------------------------------------------

## 14. ERROR / LOADING / EMPTY STATES

Provide useful states for:

-   Login failure
-   Registration failure
-   Upload failure
-   Transfer failure
-   Download/access failure
-   AI failure
-   Invalid file
-   Unauthorized request
-   Expired JWT
-   Empty transfer list
-   Empty shared files
-   No AI result yet

No important workflow should fail silently.

------------------------------------------------------------------------

## 15. CODE QUALITY

Write production-quality code:

-   Clean separation of concerns
-   Reusable components
-   Meaningful names
-   No duplicated business logic
-   No dead code
-   No unnecessary dependencies
-   No placeholder implementations
-   No fake API responses in the final implementation
-   No hardcoded production data
-   No unfinished required functionality
-   No commented-out obsolete code
-   No console spam
-   No exposed secrets

Use clear React/TypeScript types.

------------------------------------------------------------------------

## 16. STRICT SCOPE CONTROL

Do NOT add:

-   Social media features
-   Payments
-   Subscriptions
-   Admin dashboards
-   Unrelated analytics
-   Recommendation systems
-   AI agents
-   RAG
-   Vector databases
-   OpenAI
-   Claude
-   LangChain
-   Redis
-   PostgreSQL
-   Firebase
-   Supabase
-   AWS
-   Blockchain
-   Video/audio calling
-   Social feeds
-   Unrelated chat systems
-   Unrelated notifications
-   Microservices
-   Any feature or technology outside the supplied description

When uncertain, choose the simplest implementation that satisfies the
exact description.

------------------------------------------------------------------------

## 17. FAST DEVELOPMENT WORKFLOW

I want this project completed as fast as possible.

The implementation must still be internally organized using professional
production-level development stages, but **do not make me approve every
phase**.

Work continuously through logical chunks such as:

1.  Foundation and architecture
2.  Database/backend
3.  JWT authentication
4.  File sharing
5.  Real-time transfer tracking
6.  Gemini AI
7.  Frontend/UI integration
8.  Integration and final QA

**Do not stop after each chunk to ask for approval.**

Continue automatically unless there is a genuinely blocking issue
requiring my input.

------------------------------------------------------------------------

## 18. GIT / GITHUB

Maintain regular GitHub commits throughout development.

After each meaningful, working implementation chunk:

1.  Inspect changes.
2.  Run relevant builds/type checks.
3.  Fix errors.
4.  Review `git status`.
5.  Stage intended files.
6.  Create a meaningful commit.
7.  Push to the configured GitHub remote.
8.  Continue.

Use concise conventional commit messages such as:

``` text
feat: initialize filesync architecture
feat: implement database models
feat: implement jwt authentication
feat: implement file sharing
feat: add real-time transfer tracking
feat: integrate gemini file analysis
feat: build filesync frontend
fix: resolve transfer authorization
fix: improve ai error handling
test: finalize end-to-end validation
```

Do not create meaningless commits.

Do not commit:

-   `.env`
-   API keys
-   passwords
-   uploaded files
-   `node_modules`
-   build output
-   private/generated files

Maintain a correct `.gitignore`.

If Git is not initialized, initialize it correctly. If a remote already
exists, preserve it.

Use normal Git commit/push workflow. GitHub documents `git add`,
`git commit`, and `git push` as the standard workflow for publishing
local commits. https://docs.github.com/en/get-started/using-git

------------------------------------------------------------------------

## 19. VALIDATION

After every major implementation chunk:

### Backend

Run the appropriate install/build/start checks and ensure:

-   zero TypeScript errors
-   zero build errors
-   imports resolve
-   routes load
-   server starts

### Frontend

Ensure:

-   zero TypeScript errors
-   production build succeeds
-   routes compile
-   components render
-   API services compile

### Integration

Verify:

-   frontend ↔ backend communication
-   MongoDB connection
-   JWT authentication
-   file operations
-   real-time updates
-   Gemini integration

If something fails, fix it before continuing.

------------------------------------------------------------------------

## 20. FINAL QA

Perform a complete end-to-end review before declaring the project
finished.

### Authentication

-   Register
-   Login
-   Logout
-   Invalid credentials
-   Invalid/expired JWT
-   Protected routes

### File sharing

-   Upload
-   Metadata
-   Share/send
-   Transfer status
-   Real-time status/progress
-   Recipient access
-   Download
-   Invalid file handling
-   Transfer failure handling

### Gemini AI

-   File summarization
-   Content insights
-   Instant contextual response
-   Loading state
-   API failure handling
-   Key remains server-side

### UI

-   Desktop
-   Tablet
-   Mobile
-   Navigation
-   Forms
-   Upload workflow
-   Transfer tracking
-   AI workflow
-   Loading/error/empty states

### Security

-   No secrets committed
-   JWT protected APIs
-   Ownership/authorization checks
-   Safe file access
-   Gemini key server-side

### Code quality

-   No unnecessary features
-   No dead code
-   No placeholders
-   No broken imports
-   No build errors
-   No obvious runtime errors

------------------------------------------------------------------------

## 21. README

Create/update a professional `README.md` containing:

-   Project overview
-   Features
-   Technology stack
-   Architecture overview
-   Folder structure
-   Environment variables
-   MongoDB setup
-   Gemini API setup
-   Local setup
-   Development commands
-   Build commands
-   Authentication overview
-   File-sharing workflow
-   AI functionality
-   Real-time functionality

Do not claim unsupported features.

------------------------------------------------------------------------

## 22. ENVIRONMENT FILES

Create an example environment file such as:

``` text
server/.env.example
```

With placeholders such as:

``` env
PORT=
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
```

Never put real secrets in tracked files.

------------------------------------------------------------------------

## 23. PROMPT FILE

Create this file in the project root:

``` text
prompt.md
```

Keep it synchronized with the authoritative project requirements and
constraints.

------------------------------------------------------------------------

## 24. EXECUTION RULES

Before coding:

1.  Inspect the repository.
2.  Inspect existing files.
3.  Inspect package files.
4.  Inspect Git status.
5.  Inspect environment examples.
6.  Determine what is already implemented.
7.  Preserve correct existing work.

Then implement continuously.

Do not ask unnecessary questions.

Do not stop after one feature.

Do not add anything outside this specification.

Do not change the stack.

Do not generate fake completion reports.

Actually inspect, implement, build, test, fix, and verify.

If a decision is ambiguous, choose the most production-appropriate
solution that remains strictly within the supplied stack and scope.

------------------------------------------------------------------------

## 25. DEFINITION OF DONE

FileSync is finished only when:

-   Complete FileSync functionality is implemented.
-   React frontend works.
-   Node/Express backend works.
-   MongoDB integration works.
-   JWT authentication works.
-   File sharing works.
-   Real-time transfer tracking works.
-   Gemini summarization works.
-   Gemini content insights work.
-   Gemini contextual responses work.
-   Cross-device file-sharing workflow works.
-   UI is polished and responsive.
-   Loading/error/empty states are handled.
-   Security checks are implemented.
-   `.env` is protected.
-   `.env.example` exists.
-   README exists.
-   `prompt.md` exists.
-   Frontend build passes.
-   Backend build passes.
-   End-to-end functionality has been checked.
-   Git history contains meaningful commits.
-   Completed commits are pushed to the configured GitHub remote.
-   Final `git status` is clean.

------------------------------------------------------------------------

# START NOW

Inspect the existing FileSync repository and current Git state.

Then immediately begin implementing the project.

Work continuously and efficiently.

Do not wait for phase-by-phase approval.

Do not add anything outside this specification.

Build FileSync to a professional production-level standard while
finishing as quickly as possible.
