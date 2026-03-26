import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ExpenseListScreen } from "../screens/ExpenseListScreen";
import { AddExpenseScreen } from "../screens/AddExpenseScreen";

export type AppStackParamList = {
  ExpenseList: undefined;
  AddExpense: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#6C63FF" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="ExpenseList"
      component={ExpenseListScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddExpense"
      component={AddExpenseScreen}
      options={{ title: "New Expense" }}
    />
  </Stack.Navigator>
);
