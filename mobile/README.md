# InternsHub | Flutter Mobile Client

A premium, cross-platform mobile and web client application built using **Flutter (Dart)** connecting to our Express + MongoDB API.

---

## 💎 Design System & Glassmorphism (iOS 27 Look)
The user interface has been tailored with a modern, elegant **Apple iOS-style light-glassmorphic aesthetic**:
- **Radial-Linear Backdrop Canvas**: Pages render over a smooth, multi-stop light gradient (Soft Slate to Lavender to Light Indigo) which contrasts beautifully with transparent panels.
- **BackdropFilter Blurs**: High-density blurs (`sigmaX: 20.0`, `sigmaY: 20.0`) with translucent border highlights.
- **Glass Card Overlays**: The core forms and statistics panels leverage a custom reusable `GlassCard` widget that adapts dynamically.
- **Forced Theme**: Standardized on a gorgeous Light Mode design theme across both pre-login (landing, login, registration) and post-login student views.

---

## 🛠️ Architecture & Core Components

1. **State Management (`Provider`)**:
   - **`AuthProvider`**: Manages login, signup, session recovery on boot, and profile updates.
   - **`ThemeProvider`**: Configured to force light mode app-wide.

2. **Network Layer (`Dio`)**:
   - **`api_service.dart`**: Singleton API client with automatic JWT header interceptors and dynamic base url resolution:
     - **Web Browser (Edge/Chrome)**: Automatically resolves loopback requests to `http://localhost:5000/api` (dev) or your live backend API URL (production).
     - **Android Emulator**: Automatically routes loopbacks to `http://10.0.2.2:5000/api`.

3. **External Profile Redirect**:
   - Local edit text inputs are removed from the mobile profile view. Clicking **Edit Profile on Web** opens a secure redirection link to your profile dashboard on the React web portal where you can edit skills, biography, and education history.
   - To refresh local parameters after editing on the web, click the **Sync Icon** in the top right of the Profile AppBar.

4. **Profile Resume Submissions**:
   - Applications must use the student's profile resume synced from the server. If a resume is missing, the application button is disabled and warns the user to upload their CV via the web portal.

---

## 🚀 Getting Started

### Prerequisites
- Flutter SDK installed on your system.
- Target device/emulator or a web browser (e.g. Edge/Chrome).
- The InternsHub backend API running on `http://localhost:5000`.

### Setup & Run
1. Open a terminal in the `mobile/` directory:
   ```bash
   cd mobile
   ```

2. Download Dart dependencies:
   ```bash
   flutter pub get
   ```

3. Run the application on your desired target:
   - **Web browser (Edge)**:
     ```bash
     flutter run -d edge
     ```
   - **Android Emulator**:
     ```bash
     flutter run -d android
     ```

---

## 📦 Core Package Dependencies
- **`lucide_icons_flutter`**: Clean, modern vector icons for iOS aesthetic (supports Flutter 3.x final `IconData` restrictions).
- **`provider`**: Lightweight, reactive state management tree.
- **`dio`**: High-performance HTTP networking client.
- **`google_fonts`**: Renders Outfit and Inter typographies.
- **`shared_preferences`**: Local key-value storage for JWT sessions.
- **`url_launcher`**: Launches external URLs in browser windows.
