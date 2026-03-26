import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../services/firebase";
import { User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut:() => Promise<void>; 
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
      return;
    }

    // fallback Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  };

  checkUser();
}, []);


const signOut = async () => {
    try {
      // Firebase signout
      await auth.signOut();
      
      // Google signout
      // import GoogleSignin from "@react-native-google-signin/google-signin";
      await GoogleSignin.signOut();
      
      // Clear storage
      await AsyncStorage.removeItem('user');
      
      // Clear state
      setUser(null);
    } catch (error) {
      console.log('Signout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);