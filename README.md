# 💰 ExpenseTracker

A production-ready, cross-platform expense tracking mobile app built with **Expo (Bare Workflow)**, **TypeScript**, **NativeWind (Tailwind CSS)**, and **Firebase**. Features smooth animations, Google Sign-In, real-time Firestore sync, and 7+ expense categories with Expo Vector Icons.

[![Expo](https://img.shields.io/badge/Expo-55.0.8-brightgreen)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.83.2-blue)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-12.11.0-orange)](https://firebase.google.com)

## ✨ Features

- 🔐 **Secure Google Sign-In** with Firebase Auth + AsyncStorage persistence
- 📱 **Add Expenses** with amount, category (7 options), notes, and live previews
- 📊 **Real-time Expense List** synced via Firestore with totals and filtering
- 🎨 **Premium UI/UX** - Reanimated animations, NativeWind styling, Expo Vector Icons
- 📈 **Category Breakdown** with colored badges and smooth interactions
- 🧹 **Clean Architecture** - AuthContext, modular screens, type-safe TypeScript
- 🔄 **Cross-Platform** - Android, iOS, Web ready (via Expo)

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | Expo 55 (Bare), React Native 0.83, React 19 |
| **Styling** | NativeWind v4 (Tailwind CSS) |
| **Navigation** | React Navigation v7 (Native Stack) |
| **Backend** | Firebase v12 (Auth + Firestore) |
| **Auth** | Google Sign-In + AsyncStorage |
| **Animations** | React Native Reanimated |
| **Icons** | @expo/vector-icons (Ionicons, MaterialCommunityIcons) |
| **Storage** | @react-native-async-storage/async-storage |
| **Utils** | SafeAreaContext, GestureHandler, Screens |

## 📋 Prerequisites

- **Node.js** ≥ 18.x
- **Android Studio** (API 34+ emulator) or **Xcode** (iOS 17+ simulator)
- **Java JDK** 17+ (OpenJDK recommended)[cite:2]
- **Firebase Project** with Google Auth & Firestore enabled
- **Google Services Files**: `google-services.json` (Android), `GoogleService-Info.plist` (iOS)

## 🚀 Quick Start

```bash
# Clone & Install
git clone <your-repo-url>
cd expensetracker
npm install

# Prebuild (generates native folders)
npx expo prebuild --clean

# Run on Android/iOS
npx expo run:android    # or npx expo run:ios
```

**Pro Tip**: Use `npx expo start --clear` + `npx expo run:android` in dev for hot reload.[cite:17]

## 🔧 Firebase Setup (Step-by-Step)

1. **Create Project**: Go to [Firebase Console](https://console.firebase.google.com) → New Project
2. **Enable Auth**: Authentication → Sign-in method → Google → Enable + Add Web SDK client ID
3. **Firestore Database**: Firestore → Create database (Start in test mode)
4. **Download Configs**:
   - Android: Project Settings → `google-services.json` → project root
   - iOS: `GoogleService-Info.plist` → `ios/` folder
5. **Update Code**:
   ```typescript
   // src/services/firebase.ts
   const firebaseConfig = {
     apiKey: "your-api-key",
     // ... your config
   };
   ```
6. **Web Client ID**: Update `src/hooks/useAuth.ts` or AuthContext with `webClientId`
7. **Rebuild**: `npx expo prebuild --clean && npx expo run:android`

**Firestore Rules** (for testing):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if request.auth != null; }
  }
}
```

## 🏗 Project Structure
