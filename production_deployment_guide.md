# production_deployment_guide.md

This guide walks you through deploying the **Internship Management System** live to production using **MongoDB Atlas** (Database), **Render** (Backend API), **Vercel** (React Frontend), and compiling the **Flutter Mobile & Web Clients**.

---

## 📦 Stage 1: MongoDB Atlas (Live Database)
Your database runs live on MongoDB Atlas using the connection string configured in `.env`. For clean production builds:
1. Log in to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. Under **Network Access**, ensure you have whitelisted access IPs:
   - For Render servers to connect freely, add `0.0.0.0/0` (Allow Access from Anywhere).
3. Whitelist your personal IP to continue local administrative updates.
4. Production connection string format:
   ```text
   mongodb+srv://yesaswim2006_db_user:<password>@interndb.tkawrlv.mongodb.net/InternLink?retryWrites=true&w=majority
   ```

---

## 🚀 Stage 2: Deploy Backend Node.js API to Render
[Render](https://render.com/) is a hosting platform ideal for Node.js backend web services.

### Setup Steps:
1. Push your project folder to your GitHub repository.
2. Log in to your Render Dashboard and click **New > Web Service**.
3. Link your GitHub repository.
4. Set the following build options:
   - **Name**: `internlink-backend`
   - **Root Directory**: `backend` *(if running from a monorepo workspace)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Advanced** and add the following **Environment Variables**:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://yesaswim2006_db_user:Ku3GnT7VIfUUGU8u@interndb.tkawrlv.mongodb.net/InternLink?retryWrites=true&w=majority`
   - `JWT_SECRET`: `super_secure_production_secret_key_1234`
   - `JWT_EXPIRE`: `30d`
   - `EMAIL_HOST`: `smtp.gmail.com`
   - `EMAIL_PORT`: `587`
   - `EMAIL_USER`: `myselfadmin123@gmail.com`
   - `EMAIL_PASS`: `myng pigh awuh royr`
   - `EMAIL_FROM`: `myselfadmin123@gmail.com`
6. Click **Create Web Service**. Once deployed, Render will output your backend URL:
   - **Live API Endpoint URL**: `https://internlink-backend.onrender.com`

---

## 💻 Stage 3: Deploy Frontend React SPA to Vercel
[Vercel](https://vercel.com/) is the premium hosting solution for Vite/React applications.

### Routing Configuration:
Vite routes are managed on the client side. Reloading path URLs (like `/dashboard/student`) directly on a static host will return a `404` error. We resolved this by creating [vercel.json](file:///c:/Users/tarun/Downloads/New%20folder/frontend/vercel.json) in the `frontend/` folder:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Setup Steps:
1. Log in to Vercel and click **Add New > Project**.
2. Select your GitHub repository.
3. Set the following build options:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variable**:
   - `VITE_API_URL`: Set this to your live Render API path:
     `https://internlink-backend.onrender.com/api`
5. Click **Deploy**. Vercel will output your live URL:
   - **Live React Portal URL**: `https://internlink-frontend.vercel.app`

---

## 📱 Stage 4: Deploy & Build Flutter Client App
To make the Flutter application live, we must point its HTTP queries to the production URL instead of `localhost` and compile the release bundles.

### 1. Update Production base URL
In [api_service.dart](file:///c:/Users/tarun/Downloads/New%20folder/mobile/lib/services/api_service.dart), update the `baseUrl` method:
```dart
  static String get baseUrl {
    // Set your production Render backend API URL
    return 'https://internlink-backend.onrender.com/api';
  }
```

---

### 2. Compile Flutter Client Builds

#### 🌐 Option A: Compile for Flutter Web
To compile the web version and host it on Vercel or Netlify:
1. Run the compilation command:
   ```bash
   flutter build web --release
   ```
2. This creates a production-ready web bundle in:
   `mobile/build/web/`
3. Drag & drop the `build/web` directory directly into [Vercel](https://vercel.com/) or Netlify's deployment portal to host your mobile client as a responsive web app.

#### 🤖 Option B: Compile for Android (APK / App Bundle)
To generate the Android installation binary:
1. Run the release compilation:
   ```bash
   flutter build apk --release
   ```
2. The generated, ready-to-install app binary will be saved to:
   `mobile/build/app/outputs/flutter-apk/app-release.apk`
3. Send this APK directly to test devices or download platforms.
4. To compile the optimized package for Google Play Store upload, run:
   ```bash
   flutter build appbundle --release
   ```
   *This outputs an `.aab` file to `mobile/build/app/outputs/bundle/release/app-release.aab`.*

#### 🍎 Option C: Compile for iOS (Apple App Store)
Requires a macOS terminal environment with Xcode installed:
1. Build the iOS archive:
   ```bash
   flutter build ipa
   ```
2. Open the workspace in Xcode (`mobile/ios/Runner.xcworkspace`), archive, sign, and upload to App Store Connect.
