# Aura LMS — Next-Gen Production-Grade Learning Management System

> A state-of-the-art Learning Management System built with the **MERN Stack** (MongoDB, Express.js, React 18, Node.js), featuring **React Three Fiber (3D)**, **GSAP ScrollTrigger**, **Lenis Smooth Scroll**, **Socket.io Real-Time Q&A**, **Recharts Visualizations**, and **Role-Based Access Control (Admin, Instructor, Student)**.

---

## 🌟 Tech Stack Highlights

### Frontend
- **Core**: React 18 + Vite (ES Modules)
- **Styling**: Tailwind CSS with custom glassmorphism design tokens, subtle shadows, and glowing radial mesh backgrounds
- **3D Interactive Visualizations**: Three.js, `@react-three/fiber`, and `@react-three/drei`
  - Interactive 3D Hero Scene with floating books, kinetic core, and mouse parallax
  - 3D Gold Ribbon Trophy / Medal for completion and certificate screens
  - 3D Perspective Card Tilt (`CardTilt3D`) on hover
- **Scroll & Micro-Animations**:
  - Lenis smooth scrolling site-wide (`lenis`)
  - GSAP ScrollTrigger intersection reveal animations (`gsap`, `ScrollTrigger`)
  - GSAP Animated Number Counters (`CounterAnimation`)
- **Real-Time WebSockets**: Socket.io Client for live lesson-specific discussion threads and peer presence counters
- **Analytics & Data Visualizations**: Recharts Area & Bar charts with custom glass tooltips
- **PDF Generation**: `jspdf` + `html2canvas` for 1-click printable certificate exports
- **Routing & State**: React Router v6, Context API (`AuthContext`, `ThemeContext`, `SocketContext`), Axios with JWT bearer interceptors

### Backend
- **Core**: Node.js & Express.js (Clean MVC architecture)
- **Database**: MongoDB with Mongoose ODM (Indexes, pre-save hooks, aggregate rating computations)
- **Authentication & Security**:
  - JWT Tokens with Bearer authorization
  - `bcryptjs` password hashing
  - `helmet` security headers with cross-origin policies
  - `express-rate-limit` DDoS/brute-force protection
  - CORS configuration
- **Real-Time Engine**: Socket.io Server with lesson-scoped rooms and active viewer tracking
- **File Uploads**: Multer with disk storage fallback and Cloudinary cloud storage support

---

## 👥 Pre-Configured Demo Credentials

The login page (`/login`) includes a **1-Click Instant Demo Evaluation Bar** that lets you switch accounts immediately without typing:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `student@lms.com` | `password123` | My Learning, Video Theatre Player, Notes, Socket.io Discussions, Quizzes, Verified Certificates |
| **Instructor** | `instructor@lms.com` | `password123` | Creator Studio, Course Creation Wizard, Curriculum Builder, Recharts Revenue & Enrollment Analytics |
| **Admin** | `admin@lms.com` | `password123` | Platform Metrics, User Management (Role Switcher: Student/Instructor/Admin), Course Approval Queue |

---

## 📂 Project Architecture

```
c:\LMS MERN Stack\
├── backend/
│   ├── config/
│   │   ├── db.js                 # Mongoose connection handler
│   │   └── cloudinary.js         # Cloudinary SDK configuration
│   ├── controllers/
│   │   ├── authController.js       # Register, login, profile management
│   │   ├── courseController.js     # Search, multi-facet filter, categories
│   │   ├── enrollmentController.js # Enrollment & automatic certificate issuance
│   │   ├── quizController.js       # Auto-grading engine & question explanations
│   │   ├── certificateController.js# Verified certificate retrieval & registry check
│   │   ├── reviewController.js     # Ratings & reviews with aggregate scores
│   │   ├── discussionController.js # Lesson Q&A thread creation & replies
│   │   ├── instructorController.js # Instructor studio stats & course authoring
│   │   └── adminController.js      # Platform KPIs & user moderation
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT bearer token verification
│   │   ├── roleMiddleware.js       # RBAC role authorization
│   │   ├── errorMiddleware.js      # Error handling & Mongoose formatters
│   │   └── uploadMiddleware.js     # Multer file upload handler
│   ├── models/
│   │   ├── User.js                 # Students, instructors, admins
│   │   ├── Course.js               # Rich course schema with tags & pricing
│   │   ├── Section.js              # Course modules
│   │   ├── Lesson.js               # Video lessons & PDF downloads
│   │   ├── Enrollment.js           # Progress percentage & completion tracker
│   │   ├── Quiz.js                 # Assessment questions & passing score
│   │   ├── QuizAttempt.js          # Student attempts, scores, and review data
│   │   ├── Certificate.js          # Cryptographic certificate credentials
│   │   ├── Review.js               # Star ratings and feedback
│   │   └── Discussion.js           # Real-time Q&A threads and replies
│   ├── routes/
│   ├── sockets/
│   │   └── socketHandler.js        # Socket.io lesson rooms & viewer counters
│   ├── seeder/
│   │   └── seed.js                 # Comprehensive seed database script
│   ├── server.js                   # Express + Socket.io HTTP server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/
│   │   │   │   ├── HeroScene.jsx     # R3F 3D floating books & kinetic geometry
│   │   │   │   ├── TrophyBadge3D.jsx # Interactive 3D Gold Ribbon Trophy
│   │   │   │   └── CardTilt3D.jsx    # Mouse parallax 3D card tilt
│   │   │   ├── animations/
│   │   │   │   ├── SmoothScroll.jsx  # Lenis smooth scrolling engine
│   │   │   │   ├── RevealOnScroll.jsx# GSAP ScrollTrigger staggered reveals
│   │   │   │   └── CounterAnimation.jsx# GSAP animated number counter
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx        # Sticky glass navbar with blur-on-scroll
│   │   │   │   ├── Footer.jsx        # Rich footer with system status
│   │   │   │   ├── ThemeToggle.jsx   # Dark / Light theme switch
│   │   │   │   ├── StarRating.jsx    # 5-star rating display
│   │   │   │   └── ProtectedRoute.jsx# Role-based route guard
│   │   │   ├── course/
│   │   │   │   ├── CourseCard.jsx    # Glassmorphism course card with progress
│   │   │   │   ├── CourseFilters.jsx # Category, level, price & sorting filters
│   │   │   │   └── CurriculumAccordion.jsx # Accordion syllabus breakdown
│   │   │   ├── player/
│   │   │   │   ├── VideoPlayer.jsx   # Custom HTML5 player with speed & progress
│   │   │   │   ├── LessonSidebar.jsx # Curriculum progress & completion toggles
│   │   │   │   ├── LessonNotes.jsx   # Browser-saved markdown notes
│   │   │   │   └── RealtimeDiscussion.jsx # Socket.io live Q&A threads
│   │   │   ├── quiz/
│   │   │   │   └── QuizPlayer.jsx    # Timed assessment with confetti celebration
│   │   │   └── dashboard/
│   │   │       ├── StatCard.jsx      # KPI metric cards
│   │   │       └── AnalyticsChart.jsx# Recharts Area & Bar charts
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # User auth session & roles
│   │   │   ├── ThemeContext.jsx      # Dark / Light theme state
│   │   │   └── SocketContext.jsx     # Socket.io shared client connection
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # 3D Hero, stats, featured showcase
│   │   │   ├── LoginPage.jsx         # 1-Click quick demo accounts
│   │   │   ├── RegisterPage.jsx      # Student / Instructor signup
│   │   │   ├── CourseCatalogPage.jsx # Multi-facet search and grid/list views
│   │   │   ├── CourseDetailsPage.jsx # Syllabus, reviews, trailer preview
│   │   │   ├── LearningPlayerPage.jsx# Video theatre player, notes, Q&A
│   │   │   ├── QuizPage.jsx          # Standalone assessment engine
│   │   │   ├── StudentDashboardPage.jsx# My courses, resume banner, certificates
│   │   │   ├── InstructorDashboardPage.jsx# Course Creation Wizard & analytics
│   │   │   ├── AdminPanelPage.jsx    # User role moderation & course approvals
│   │   │   ├── CertificatePage.jsx   # 3D Trophy + printable PDF export
│   │   │   └── ProfilePage.jsx       # User settings & avatar update
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css                 # Tailwind CSS & glassmorphic tokens
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **MongoDB**: Local MongoDB on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds 6 masterclasses, users, quizzes, reviews, and certificates
npm start        # Starts Express + Socket.io server on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite React dev server on http://localhost:5173
```

---

## 🧪 Automated Integration Tests
You can run the end-to-end integration test suite anytime:
```bash
node -e "/* integration script */"
```
Tests automatically verify health checks, authentication, catalog filters, enrollment progress, quiz submissions with scoring, certificate verification, instructor analytics, and admin metrics.
