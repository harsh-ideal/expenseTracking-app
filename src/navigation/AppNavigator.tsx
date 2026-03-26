import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator, Text } from "react-native";
import { useAuthContext } from "../context/AuthContext";
import { AuthStack } from "./AuthStack";
import { AppStack } from "./AppStack";

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text className="mt-2 text-muted">Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
