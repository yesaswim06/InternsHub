# InternsHub | Full-Stack Internship Management System & Mobile App

InternsHub is a production-ready, feature-rich **Internship Management System** connecting students, companies, and administrators. 

The workspace consists of three core applications:
1. **`backend/`**: Secure Node.js & Express API with a MongoDB database (configured for MongoDB Atlas cloud hosting).
2. **`frontend/`**: Responsive React Web client built with Vite, Tailwind CSS, and Framer Motion.
3. **`mobile/`**: Cross-platform Flutter client app featuring a premium glassmorphic Apple iOS interface.

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
* **Stack**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Multer, Nodemailer.
* **Database Connection**: Linked to your live online MongoDB Atlas cluster.
* **SMTP Gmail Channel**: Setup inside `backend/.env` using Google App Passwords to trigger email confirmations upon candidate applications and interview scheduling coordinates.

### 🔵 Web Frontend (React Client)
* **Stack**: React.js (Vite), Tailwind CSS (v3), React Router, Framer Motion, React Hot Toast.
* **Loading Screen**: Configured with a CSS-animated glassmorphic pulsing splash loader inside the root index file for responsive UX transitions.

### 🟣 Mobile Client (Flutter App)
* **Stack**: Flutter (Dart), Provider state, Dio, SharedPreferences, url_launcher.
* **Visuals**: Features high-blur `BackdropFilter` card panels in an apple-style Light Mode Glassmorphism layout.
* **External Redirection**: The profile edit fields are replaced with a single call-to-action redirecting candidates to their profile edit portal on the React Web Client.
* **Profile Resume Applying**: Local resume uploading is disabled inside the app; students apply to roles using their whitelisted profile resume synced from the server database.

---

## 🚀 How to Run the System

### 1. Run the Backend API
```bash
cd backend
npm install
npm run seed     # Seeds test accounts and sample internships in MongoDB Atlas
npm run dev      # Runs server on http://localhost:5000
```

### 2. Run the React Web SPA
```bash
cd frontend
npm install
npm run dev      # Runs hot-reloading client on http://localhost:5173
```

### 3. Run the Flutter Mobile/Web App
```bash
cd mobile
flutter pub get
flutter run -d edge    # Runs on Edge Web browser
# OR
flutter run -d android # Runs on Android emulator
```

---

## 👥 Seed Test Accounts (MongoDB Atlas)

If you ran `npm run seed`, you can log in immediately using these pre-configured credentials:

| Portal Role | Login Email | Login Password | Description |
| :--- | :--- | :--- | :--- |
| **System Admin** | `myselfadmin123@gmail.com` | `admin123` | Moderate users, verify company registries, check system metrics. |
| **Hiring Partner** | `company@internshub.com` | `company123` | Post new internships, review CV uploads, schedule interview video links. |
| **Student Candidate** | `student@internshub.com` | `student123` | Search internships, apply with PDF documents, check interview schedules. |
