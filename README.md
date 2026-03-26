# 💰 ExpenseTracker

A production-ready, cross-platform expense tracking mobile app built with **Expo (Bare Workflow)**, **TypeScript**, **NativeWind (Tailwind CSS)**, and **Firebase**. Features smooth animations, Google Sign-In, real-time Firestore sync, and 7+ expense categories with Expo Vector Icons.

[![Expo](https://img.shields.io/badge/Expo-55.0.8-brightgreen)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.83.2-blue)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-12.11.0-orange)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🔐 **Secure Google Sign-In** via Firebase Auth with AsyncStorage persistence
- 📱 **Add Expenses** with amount, category (7 options), notes, and live header preview
- 📊 **Real-time Expense List** synced via Firestore with totals
- 🎨 **Premium UI/UX** — Reanimated animations, NativeWind styling, Expo Vector Icons
- 📈 **Category Breakdown** with colored badges and smooth micro-interactions
- 🧹 **Clean Architecture** — AuthContext, modular screens, fully type-safe TypeScript
- 🔄 **Cross-Platform** — Android, iOS, and Web support via Expo

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | Expo 55 (Bare Workflow), React Native 0.83, React 19 |
| **Language** | TypeScript 5.9 |
| **Styling** | NativeWind v4 (Tailwind CSS) |
| **Navigation** | React Navigation v7 (Native Stack) |
| **Backend** | Firebase v12 (Auth + Firestore) |
| **Auth** | Google Sign-In + AsyncStorage session persistence |
| **Animations** | React Native Reanimated |
| **Icons** | @expo/vector-icons (Ionicons, MaterialCommunityIcons) |
| **Storage** | @react-native-async-storage/async-storage |
| **Utilities** | SafeAreaContext, GestureHandler, Screens |

---

## 📋 Prerequisites

Before getting started, make sure you have the following installed:

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Java JDK 17+** (OpenJDK 17 recommended)
- **Android Studio** (API 34+ emulator) or **Xcode** (iOS 17+ simulator)
- **Firebase Project** with Google Auth & Firestore enabled
- **Google Services Config Files**:
  - `google-services.json` — Android (place in project root)
  - `GoogleService-Info.plist` — iOS (place in `ios/` folder)

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd expensetracker

# 2. Install dependencies
npm install

# 3. Prebuild native folders (required for bare workflow)
npx expo prebuild --clean

# 4. Run on device or emulator
npx expo run:android    # Android
npx expo run:ios        # iOS
```

> **💡 Pro Tip:** `npx expo run:android` automatically starts Metro bundler. Only re-run `prebuild` when you add new native packages or change `app.json`.

---

## 🔧 Firebase Setup (Step-by-Step)

### 1. Create a Firebase Project
Go to [Firebase Console](https://console.firebase.google.com) → **Add Project** → follow the wizard.

### 2. Enable Google Authentication
**Authentication** → **Sign-in method** → **Google** → Toggle Enable → Copy **Web SDK Client ID**.

### 3. Create Firestore Database
**Firestore Database** → **Create database** → Select **Start in test mode** → Choose region.

### 4. Download Config Files
- **Android:** Project Settings → `google-services.json` → place in project **root**
- **iOS:** Project Settings → `GoogleService-Info.plist` → place in `ios/` folder

### 5. Update Firebase Config in Code

```typescript
// src/services/firebase.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
```

### 6. Update Web Client ID

```typescript
// src/hooks/useAuth.ts  OR  src/context/AuthContext.tsx
GoogleSignin.configure({
  webClientId: "YOUR_WEB_CLIENT_ID_FROM_FIREBASE",
});
```

### 7. Rebuild the App

```bash
npx expo prebuild --clean
npx expo run:android
```

### Firestore Security Rules (Authenticated Users Only)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🏗 Project Structure

```
expensetracker/
├── src/
│   ├── context/            # AuthContext — onAuthStateChanged + AsyncStorage sync
│   ├── screens/            # LoginScreen, HomeScreen, AddExpenseScreen
│   ├── services/           # firebase.ts (Auth + Firestore init)
│   ├── hooks/              # useAuth.ts — Google Sign-In, signOut logic
│   ├── components/         # Button, ExpenseCard (Reanimated animations)
│   ├── navigation/         # AppNavigator, AuthStack, AppStack
│   ├── types/              # User, Expense TypeScript interfaces
│   └── utils/              # formatCurrency helper
├── android/                # Auto-generated after prebuild
├── ios/                    # Auto-generated after prebuild
├── app.json                # Expo configuration
├── tailwind.config.js      # NativeWind / Tailwind CSS config
├── babel.config.js         # Babel + Reanimated plugin
├── tsconfig.json           # TypeScript config
└── package.json
```

---

## 🎮 Screen Flow

```
App Launch
    │
    ▼
AppNavigator (checks AuthContext)
    │
    ├── No User ──▶ LoginScreen ──▶ Google Sign-In ──▶ Firebase Auth
    │                                                        │
    └── User Exists ◀─────────────────────────────────────◀─┘
            │
            ▼
        HomeScreen (Real-time Firestore expense list + totals)
            │
            ├── FAB (+) ──▶ AddExpenseScreen ──▶ Save to Firestore
            │
            └── Sign Out ──▶ Clear Auth + Google Session ──▶ LoginScreen
```

---

## 📱 UI & Demo Highlights

- **Live Amount Preview** — Amount updates in real-time inside the AddExpense header
- **Staggered Entry Animations** — `FadeInDown` + `withSpring` for natural screen loads
- **Category Icons** — Each category has a unique icon and color using `Ionicons` & `MaterialCommunityIcons`
- **Haptic Feedback** — Button and chip presses with tactile response
- **Error Handling** — Shake animations with warning icons on invalid input
- **Sign-Out Flow** — Full cleanup: Firebase Auth + Google session + AsyncStorage

### Recording a Demo

**Android Emulator:**
```bash
adb shell screenrecord /sdcard/demo.mp4
# Press Ctrl+C to stop
adb pull /sdcard/demo.mp4
```

**iOS Simulator:** `Device → Record Screen`

---

## 🔍 Troubleshooting

| Issue | Fix |
|-------|-----|
| Firebase persistence fails | Use `getReactNativePersistence(AsyncStorage)` from `firebase/auth` in `firebase.ts` |
| `SafeAreaView` deprecated warning | Replace with `SafeAreaView` from `react-native-safe-area-context` + wrap root in `<SafeAreaProvider>` |
| Build fails after `npm install` | Run `npx expo install --fix` then `npx expo prebuild --clean` |
| Google Sign-In crash on launch | Confirm `webClientId` is set and `google-services.json` is in project root, then rebuild |
| Animations lag / janky | Ensure `react-native-reanimated` Babel plugin is in `babel.config.js` and Metro cache is cleared |
| Metro bundler error | `npx expo start --clear` to reset cache |

---

## 🚢 Deployment

### Setup EAS (Expo Application Services)

```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Android (APK / AAB)

```bash
# Internal testing APK
eas build --platform android --profile preview

# Production AAB (Play Store)
eas build --platform android --profile production
```

### iOS (TestFlight / App Store)

```bash
# TestFlight build
eas build --platform ios --profile preview

# App Store build
eas build --platform ios --profile production
```

---

## 🤝 Contributing

1. Fork this repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature`
5. Commit with conventional commits: `git commit -m "feat: add dark mode"`
6. Push and open a Pull Request

> **Code Standards:** Follow existing patterns — TypeScript strict mode, NativeWind classes, Reanimated for animations, no inline StyleSheet where avoidable.

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.
See [LICENSE](./LICENSE) for details.

---

## 👨‍💻 Author

**Harsh** — Full-Stack Developer, Delhi, India

- 🏗 Building: Pronoto (Real Estate SaaS), HRMS, Service Booking Platform
- 💼 Stack: React, Next.js, Node.js, React Native, MongoDB, Firebase

---

> ⭐ **If this project helped you, drop a star!** Found a bug? Open an issue.
