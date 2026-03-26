import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { auth } from "../services/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your Web Client ID from google-services.json
GoogleSignin.configure({
  webClientId: "552887560228-k9pit2dhankeo5isghb7q3k46fppbalo.apps.googleusercontent.com",
});

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const idToken =
        (signInResult as any).data?.idToken ?? (signInResult as any).idToken;
      if (!idToken) throw new Error("No ID token received from Google.");
      const credential = GoogleAuthProvider.credential(idToken);
      const result =await signInWithCredential(auth, credential);
      // await AsyncStorage.setItem('userUid', result.user.uid);
      await AsyncStorage.setItem("user", JSON.stringify(result.user));
    } catch (err: any) {
      setError(err.message ?? "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('user');
    } catch (err: any) {
      setError(err.message ?? "Sign-out failed.");
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, signOut, loading, error };
};
