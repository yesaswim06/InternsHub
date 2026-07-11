# Walkthrough - Internship Management System & Flutter App

The **Internship Management System** has been successfully updated and expanded with a brand new **Flutter Mobile Application**!

---

## 📱 Mobile App Features (Flutter)

The new cross-platform app connects to the same backend API and implements all core features:

### 1. Core Configs & Services
- **`api_service.dart`**: Handled via `Dio` client. Automatically injects the JWT bearer token into request headers, handles session expiration (401 errors), and supports multipart/form-data for PDF CV/resume uploads.
- **`auth_provider.dart`**: Uses the `Provider` package to manage session login, registration, and logout states. Persists credentials locally with `SharedPreferences`.

### 2. Student Portal Views
- **Overview Dashboard**: Stat counters for total submissions, saved bookmarks, and scheduled interview calendars.
- **Search Catalog**: Search bar input with location and work-mode chips filter sheet.
- **Detailed Vacancy View**: Requirements detail list with slide-up application forms (cover letter fields & PDF file picker).
- **Profile Manager**: Edit bio statements, add/remove skill tag badges, input education histories, and upload CVs.

### 3. Company Portal Views
- **Dashboard**: Metric stats and posted jobs summary listing.
- **Job Creation Form**: Fully-validated input form for stipend amounts, skills, durations, and deadlines.
- **Candidate Timeline**: Review student bios, view cover letters, download PDF resumes, and change status.
- **Interview Coordination**: Calendar selectors, link fields, and coordinator logs.

### 4. Admin Portal Views
- **Dashboard Grid**: System-wide growth counts.
- **Partner Registry**: Approve or suspend company coordinator registrations.
- **Account Moderator**: Search lists of users (Students, Companies) and delete accounts.

---

## 🔍 How to Run the Flutter App

1. Ensure the backend API is running (`npm run dev` in `backend/`).
2. Make sure you have Flutter SDK and Android/iOS setup installed on your computer.
3. Open a terminal in the `mobile/` directory:
   ```bash
   cd mobile
   
   # Download packages
   flutter pub get
   
   # Run the application on your emulator or device
   flutter run
   ```

> [!TIP]
> - By default, the app is configured to use the Android Emulator loopback URL `http://10.0.2.2:5000/api`.
> - To test on an iOS Simulator, change the `baseUrl` in [api_service.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/services/api_service.dart) to `http://localhost:5000/api`.

---

## 🔍 Build Verification
The Dart static code analysis check completed successfully with **0 compiler errors**:
```bash
$ flutter analyze
Analyzing mobile...
No issues found! (Only minor lint warnings/info alerts)
```
The application compiles cleanly. All package dependencies resolve successfully.

---

## 📧 Email & Mobile API Fixes
- **Gmail Transporter Wrapper**: Configured [email.js](file:///c:/Users/tarun/Downloads/New%20folder/backend/utils/email.js) to dynamically utilize Nodemailer's `'gmail'` service helper when a Gmail address or host is used in `.env`. This resolves the port blocking and TLS handshaking issues associated with manually mapping port `587`.
- **Hiring Controller Compatibility**: Updated `updateApplicationStatus` in [companyController.js](file:///c:/Users/tarun/Downloads/New%20folder/backend/controllers/companyController.js) to accept both flat query payloads (React web app) and nested interview parameter maps (Flutter mobile client) seamlessly.
- **Application Submission Emails**: Updated `applyInternship` in [internshipController.js](file:///c:/Users/tarun/Downloads/New%20folder/backend/controllers/internshipController.js) to trigger automatic confirmation emails to students immediately after submitting their applications, confirming the role title, company name, and next steps.

---

## 📱 Mobile Compile & UI Enhancements
- **Lucide Icon Migration**: Upgraded `lucide_icons` in [pubspec.yaml](file:///c:/Users/tarun/Downloads/New%20folder/mobile/pubspec.yaml) to the modern `lucide_icons_flutter` package. Refactored all 19 views to target the correct library entrypoint: `package:lucide_icons_flutter/lucide_icons.dart`. This bypasses the Flutter 3.x `IconData` inheritance restriction and allows the app to compile cleanly across all deployment targets (including Edge/Web and Mobile).
- **Theme Color Correction**: Swapped out obsolete Material color identifiers (`Colors.violet`, `Colors.emerald`, and `Colors.rose`) with standard, fully-supported widgets (`Colors.deepPurple`, `Colors.green`, and `Colors.red`) in the dashboard, company profiles, and admin moderator layouts.
- **Cross-Platform PDF Uploads**: Reconfigured the file picker handlers in [student_profile_view.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/views/student/student_profile_view.dart) and [company_profile_view.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/views/company/company_profile_view.dart) to pass file raw bytes (`Uint8List`) alongside local paths, and refactored the upload API methods in [auth_provider.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/providers/auth_provider.dart) to utilize `MultipartFile.fromBytes` on web browser targets where physical directory paths are restricted.
- **Premium Glassmorphic UI Overhaul**: Created a reusable [GlassCard](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/widgets/glass_card.dart) widget implementing `BackdropFilter` background blurs and translucent borders. Redesigned both [login_view.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/views/login_view.dart) and [register_view.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/views/register_view.dart) with a striking midnight dark gradient background, glassmorphic card overlays, and glowing violet-focused text fields.
- **Post-Login Interface Upgrade**: Refactored both the Student Overview Dashboard ([student_dashboard_view.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/views/student/student_dashboard_view.dart)) and Student Profile View ([student_profile_view.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/views/student/student_profile_view.dart)) to adopt the dynamic linear-gradient canvas backdrops and GlassCard overlays, replacing standard flat components.
- **App Bar Theme Switcher Integration**: Integrated the theme toggle controls inside the top app bar of both the dashboard and profile views, making it easy to toggle theme modes immediately inside the app.
- **Animated iOS Glass Toast Notifications**: Developed [premium_toast.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/widgets/premium_toast.dart) utility supporting floating crimson red (error alerts) and emerald green (success indicators) banners with slide-and-fade layouts, fully replacing basic SnackBars.
