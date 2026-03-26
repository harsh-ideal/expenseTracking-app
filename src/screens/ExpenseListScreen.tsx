import React from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/AppStack";
import { useAuthContext } from "../context/AuthContext";
import { useExpenses } from "../hooks/useExpenses";
import { useAuth } from "../hooks/useAuth";
import { ExpenseCard } from "../components/ExpenseCard";
import { formatCurrency } from "../utils/formatCurrency";
import { Expense } from "../types";

type Props = NativeStackScreenProps<AppStackParamList, "ExpenseList">;

const SpringButton: React.FC<{
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  style?: object; 
}> = ({ onPress, disabled, className, children,style }) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.92, { damping: 15 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12 }); }}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        style={style}
        className={className}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export const ExpenseListScreen: React.FC<Props> = ({ navigation }) => {
  const { user , signOut} = useAuthContext();
  const { expenses, total, loading } = useExpenses(user?.uid);
  const {  loading: signOutLoading } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] ?? "User";

  const renderItem = ({ item, index }: { item: Expense; index: number }) => (
    <ExpenseCard expense={item} index={index} />
  );

  

  return (
    <SafeAreaView className="flex-1 bg-[#F4F3FF]" edges={["top"]}>

      {/* ── Header ── */}
      <Animated.View
        entering={FadeInDown.duration(450)}
        className="bg-primary px-6 pt-4 pb-14 rounded-b-[36px]"
        style={{
          shadowColor: "#6C63FF",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 12,
        }}
      >
        {/* Top Row */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center gap-3">
            {user?.photoURL ? (
  <Image
    source={{ uri: user.photoURL }}
    className="w-10 h-10 rounded-2xl"
  />
) : (
  <View className="bg-white/20 w-10 h-10 rounded-2xl items-center justify-center">
    <Ionicons name="person-outline" size={18} color="#fff" />
  </View>
)}
            <View>
              <Text className="text-white/60 text-xs font-medium tracking-widest uppercase">
                Welcome back
              </Text>
              <Text className="text-white font-bold text-lg mt-0.5">{firstName}</Text>
            </View>
          </View>

          <SpringButton
            onPress={signOut}
            disabled={signOutLoading}
            className="bg-white/15 border border-white/20 rounded-2xl px-4 py-2 flex-row items-center gap-2"
          >
            {signOutLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={16} color="#fff" />
                <Text className="text-white text-sm font-semibold">Sign Out</Text>
              </>
            )}
          </SpringButton>
        </View>

        {/* Total Card */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          className="bg-white/15 border border-white/20 rounded-3xl px-5 py-5"
        >
          <View className="flex-row items-center gap-2 mb-1">
            <Ionicons name="wallet-outline" size={14} color="rgba(255,255,255,0.6)" />
            <Text className="text-white/60 text-xs font-semibold tracking-widest uppercase">
              Total Spent
            </Text>
          </View>
          <Text className="text-white font-bold mt-1" style={{ fontSize: 38, letterSpacing: -1 }}>
            {formatCurrency(total)}
          </Text>
          <View className="flex-row items-center mt-3 gap-2">
            <View className="bg-white/20 rounded-full px-3 py-1 flex-row items-center gap-1">
              <Ionicons name="receipt-outline" size={11} color="rgba(255,255,255,0.8)" />
              <Text className="text-white/80 text-xs font-semibold">
                {expenses.length} transaction{expenses.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <View className="bg-white/20 rounded-full px-3 py-1 flex-row items-center gap-1">
              <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.8)" />
              <Text className="text-white/80 text-xs font-semibold">This Month</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      {/* ── List Section ── */}
      <View className="flex-1 px-5 -mt-6">

        {/* Section Header */}
        <Animated.View
          entering={FadeInDown.delay(250).duration(400)}
          className="flex-row justify-between items-center mb-4"
        >
          <View
            className="bg-white rounded-2xl px-4 py-3 flex-1 mr-3 flex-row items-center gap-2"
            style={{
              shadowColor: "#6C63FF",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Ionicons name="time-outline" size={16} color="#6C63FF" />
            <Text className="text-gray-800 font-bold text-base">Recent Expenses</Text>
          </View>

     <SpringButton
  onPress={() => navigation.navigate("AddExpense")}
  className="rounded-2xl px-4 py-3 flex-row items-center gap-1"
  style={{
    backgroundColor: "#FF6B35",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  }}
>
  <Ionicons name="add" size={18} color="#fff" />
  <Text className="text-white font-bold text-sm">Add</Text>
</SpringButton>
        </Animated.View>

        {/* States */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text className="text-gray-400 text-sm mt-3 font-medium">Loading expenses...</Text>
          </View>
        ) : expenses.length === 0 ? (
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            className="flex-1 items-center justify-center pb-20"
          >
            <View className="w-24 h-24 rounded-full bg-indigo-100 items-center justify-center mb-5">
              <Ionicons name="receipt-outline" size={40} color="#6C63FF" />
            </View>
            <Text className="text-gray-700 font-bold text-lg">No expenses yet</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center px-8">
              Tap "Add" above to record your first expense
            </Text>
          </Animated.View>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32, paddingTop: 4 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};