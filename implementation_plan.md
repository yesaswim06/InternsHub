# Implementation Plan - Flutter Mobile App

This is the implementation plan for the **InternsHub Mobile Client**, a cross-platform mobile application built using **Flutter (Dart)** connecting to our existing Node.js + Express backend.

---

## User Review Required

Please review the proposed mobile architecture, libraries, and connection configurations.

> [!IMPORTANT]
> - **API Connection Configs**: When running on mobile devices or emulators, pointing to `localhost` will fail because the device resolves `localhost` to itself.
>   - **Android Emulator**: Resolves the host loopback to IP `10.0.2.2`. We will configure the API service to route requests to `http://10.0.2.2:5000/api` during local runs.
>   - **iOS Simulator / Physical Devices**: Resolves host via host IP address (e.g. `http://192.168.1.50:5000/api`). We will add a configuration parameter in a settings file.
> - **State Management**: We will use the **Provider** package for state management. It is lightweight, standard, and highly readable.
> - **Storage & Token Persistence**: We will use **SharedPreferences** to securely store and retrieve the JWT authentication token across app restarts.
> - **PDF Uploads (Resumes)**: We will use the **FilePicker** package to let students choose PDF resume documents from their device storage and upload them via multipart/form-data.

---

## Open Questions

> [!IMPORTANT]
> 1. **Testing Environment**: Will you be testing this on an **Android Emulator**, an **iOS Simulator**, or a **Physical Device**? (This helps us configure the default base URL for the API connection).
> 2. **Flutter SDK Setup**: Do you have the Flutter SDK and Dart installed on your computer, or should we prepare the files for you to compile on your system later?

---

## Proposed Changes

We will create a new directory `mobile/` in the root of the workspace.

### 1. Project Specifications (`mobile/pubspec.yaml`)
Configures the Flutter application identity, assets, and packages:
- `dio`: For HTTP client operations (handling JWT interceptors, base URLs, file uploads).
- `provider`: For reactive state management (managing authentication state, dashboard statistics, active filters).
- `shared_preferences`: Persistent local disk storage for auth tokens.
- `file_picker`: File choice handles to let students select `.pdf` resumes.
- `google_fonts`: Incorporates `Inter` and `Outfit` fonts.
- `lucide_icons`: Standard icon sets matching the React web client.

---

### 2. Core Modules & Configuration

#### [NEW] [mobile/lib/main.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/main.dart)
Main entry point. Boots the state providers, configures MaterialApp parameters, and initializes theme settings (indigo-based theme with custom dark/light color rules).

#### [NEW] [mobile/lib/services/api_service.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/services/api_service.dart)
A central HTTP client using `Dio`. Auto-injects bearer token headers from shared preferences on outgoing requests, handles 401 unauthenticated expirires, and handles multipart form data upload payloads.

#### [NEW] [mobile/lib/providers/auth_provider.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/providers/auth_provider.dart)
Maintains current session states. Handles `login()`, `register()`, `logout()`, profile query requests, and local token updates.

---

### 3. Page Views

#### [NEW] [mobile/lib/views/landing_view.dart](file:///c:/Users/tarun/Downloads/New%2520folder/mobile/lib/views/landing_view.dart)
Public starter dashboard explaining portal features.

#### [NEW] [mobile/lib/views/login_view.dart](file:///c:/Users/tarun/Downloads/New%2520folder/mobile/lib/views/login_view.dart) & [mobile/lib/views/register_view.dart](file:///c:/Users/tarun/Downloads/New%2520folder/mobile/lib/views/register_view.dart)
Form validation inputs with tab selectors for role logins (Student, Company, Admin).

#### **Student Pages (`mobile/lib/views/student/`)**
- `student_dashboard_view.dart`: Home metrics, calendar schedules list, profile completion tracking.
- `search_internships_view.dart`: Live filter grids (stipends, work modes, and tags search).
- `internship_detail_view.dart`: Single posting info with quick application forms and custom PDF uploads.
- `student_profile_view.dart`: Edit bio, skills lists, education items, and upload resumes.
- `saved_internships_view.dart` & `applied_internships_view.dart`.

#### **Company Pages (`mobile/lib/views/company/`)**
- `company_dashboard_view.dart`: Active jobs lists, total counts, and applicants grid.
- `post_internship_view.dart`: Modular form to create or update internship vacancies.
- `internship_applicants_view.dart`: Coordinate candidates, view resumes, modify status, and schedule interviews via sheets.
- `company_profile_view.dart`: Manage organization info.

#### **Admin Pages (`mobile/lib/views/admin/`)**
- `admin_dashboard_view.dart`: Analytics counts, growth graphs, and pending approvals lists.
- `manage_users_view.dart` & `manage_companies_view.dart`: Admin user grid management.

---

## Verification Plan

### Compilation Check
- Run compilation checks (`flutter build apk` or analytical syntax checkers) if Flutter tools are installed locally.
- Confirm all imports, Dart class definitions, state providers, and controllers compile cleanly.
