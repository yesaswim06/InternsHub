
***

# InternsHub | Full-Stack Internship Management System & Mobile App

InternsHub is a production-ready, feature-rich **Internship Management System** connecting students, companies, and administrators. 

## 🚀 Live Deployment
*   **Web Frontend**: [https://internshub-06.vercel.app](https://internshub-06.vercel.app)
*   **Backend API**: [https://internshub-06.up.railway.app](https://internshub-06.up.railway.app)
*   **API Health Status**: [https://internshub-06.up.railway.app/api/health](https://internshub-06.up.railway.app/api/health)

---

## 📁 Workspace Directory Structure

```text
├── backend/            # Express Server, Mongoose Models, Controllers, Email & File uploads
├── frontend/           # React SPA client with platform features, modals, and charts
├── mobile/             # Flutter Mobile Client with providers, services, and views
│   ├── lib/            # Dart source files
│   └── README.md       # Specialized Flutter setup and compiling guides
├── README.md           # Workspace-wide system description (this file)
└── walkthrough.md      # Summary of modifications, patches, and features
```

---

## 🛠️ Tech Stack & Key Configs

### 🟢 Backend (API Server)
*   **Live Endpoint**: `https://internshub-06.up.railway.app`
*   **Stack**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Multer, Nodemailer.
*   **Database**: Hosted on MongoDB Atlas.
*   **SMTP Channel**: Configured via Google App Passwords for automated interview scheduling and application alerts.
*   **CORS**: Configured to whitelist `internshub-06.vercel.app`.

### 🔵 Web Frontend (React Client)
*   **Live URL**: [https://internshub-06.vercel.app](https://internshub-06.vercel.app)
*   **Stack**: React.js (Vite), Tailwind CSS (v3), React Router, Framer Motion, React Hot Toast.
*   **UX**: Features a glassmorphic pulsing splash loader and responsive dashboard for all three roles.

### 🟣 Mobile Client (Flutter App)
*   **Stack**: Flutter (Dart), Provider state, Dio, SharedPreferences, url_launcher.
*   **Visuals**: High-blur `BackdropFilter` card panels with an iOS-style Light Mode layout.
*   **Redirection**: Deep-links to the React Web Client for profile editing and complex document management.

---

## 💻 Local Development Setup

### 1. Run the Backend API
```bash
cd backend
npm install
npm run seed     # Seeds test accounts and sample internships
npm run dev      # Runs server on http://localhost:5000
```

### 2. Run the React Web SPA
```bash
cd frontend
npm install
npm run dev      # Runs client on http://localhost:5173
```

### 3. Run the Flutter Mobile App
```bash
cd mobile
flutter pub get
flutter run -d chrome  # For Web testing
# OR
flutter run -d android # For Mobile testing
```

---

## 👥 Seed Test Accounts

Use these pre-configured credentials to explore the platform:

| Portal Role | Login Email | Login Password | Description |
| :--- | :--- | :--- | :--- |
| **System Admin** | `myselfadmin123@gmail.com` | `admin123` | Manage users, verify companies, view analytics. |
| **Hiring Partner** | `company@internshub.com` | `company123` | Post internships, review CVs, schedule interviews. |
| **Student Candidate** | `student@internshub.com` | `student123` | Search jobs, apply with PDF, track applications. |

---

## 🛡️ Deployment Notes
*   **Backend Hosting**: Railway (Automated CI/CD from `/backend` directory).
*   **Frontend Hosting**: Vercel (Production-ready React build).
*   **Environment Variables**: Ensure `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, and `EMAIL_PASS` are configured in the Railway dashboard for the API to function.