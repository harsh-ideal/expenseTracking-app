import React from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, loading, error } = useAuth();

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["left", "right", "bottom"]}
    >
      {/* Background soft gradient block */}
      <View className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white" />

      <View className="flex-1 justify-center px-8 relative">

        {/* Logo block */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          className="w-20 h-20 bg-primary rounded-3xl items-center justify-center mb-4 mx-auto shadow-xl"
        >
          <Ionicons name="wallet-outline" size={32} color="#fff" />
        </Animated.View>

        {/* Title & subtitle */}
        <Animated.View entering={FadeInUp.duration(400)}>
          <Text className="text-2xl font-bold text-center text-gray-900 mb-1">
            Expense Tracker
          </Text>
          <Text className="text-muted text-center text-sm mb-8 -mt-0.5">
            Track your spending. Take control of your finances.
          </Text>
        </Animated.View>

        {/* Error banner */}
        {error ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3"
          >
            <Text className="text-red-500 text-center text-sm">{error}</Text>
          </Animated.View>
        ) : null}

        {/* Google Sign‑in */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Pressable
            onPress={signInWithGoogle}
            disabled={loading}
            className={`flex-row items-center justify-center rounded-2xl bg-white border-2 border-gray-200 px-5 py-4 shadow-md active:opacity-95 ${
              loading ? "opacity-70" : ""
            }`}
            style={{
              shadowColor: "#00000020",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#3B82F6" size="small" />
            ) : (
              <>
                <Ionicons name="logo-google" size={22} color="#3B82F6" />
                <Text className="text-blue-600 font-bold text-sm ml-2">
                  Continue with Google
                </Text>
              </>
            )}
          </Pressable>
        </Animated.View>

        {/* Terms */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(400)}
          className="mt-8"
        >
          <Text className="text-gray-400 text-[11px] text-center leading-4">
            By continuing, you agree to our{" "}
            <Text className="text-gray-500 underline font-medium">
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text className="text-gray-500 underline font-medium">
              Privacy Policy
            </Text>
            .
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};