import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeInRight,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Expense } from "../types";
import { formatCurrency } from "../utils/formatCurrency";

const CATEGORY_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  Food:          { bg: "bg-orange-50",  text: "text-orange-600",  dot: "bg-orange-400",  icon: "food-fork-drink" },
  Transport:     { bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-400",    icon: "car-outline" },
  Shopping:      { bg: "bg-pink-50",    text: "text-pink-600",    dot: "bg-pink-400",    icon: "shopping-outline" },
  Entertainment: { bg: "bg-purple-50",  text: "text-purple-600",  dot: "bg-purple-400",  icon: "movie-open-outline" },
  Health:        { bg: "bg-green-50",   text: "text-green-600",   dot: "bg-green-400",   icon: "heart-pulse" },
  Bills:         { bg: "bg-yellow-50",  text: "text-yellow-600",  dot: "bg-yellow-400",  icon: "file-document-outline" },
  Utilities:     { bg: "bg-cyan-50",    text: "text-cyan-600",    dot: "bg-cyan-400",    icon: "lightning-bolt-outline" },
  Education:     { bg: "bg-indigo-50",  text: "text-indigo-600",  dot: "bg-indigo-400",  icon: "book-open-outline" },
  Other:         { bg: "bg-gray-50",    text: "text-gray-500",    dot: "bg-gray-400",    icon: "dots-horizontal-circle-outline" },
};

// Tailwind color → hex (for icon color prop)
const ICON_HEX: Record<string, string> = {
  Food: "#EA580C", Transport: "#2563EB", Shopping: "#DB2777",
  Entertainment: "#9333EA", Health: "#16A34A", Bills: "#CA8A04",
  Utilities: "#0891B2", Education: "#4F46E5", Other: "#6B7280",
};

interface ExpenseCardProps {
  expense: Expense;
  index?: number;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, index = 0 }) => {
  const config = CATEGORY_CONFIG[expense.category] ?? CATEGORY_CONFIG["Other"];
  const iconColor = ICON_HEX[expense.category] ?? "#6B7280";

  const date = new Date(expense.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const scale = useSharedValue(0.97);
  useEffect(() => {
    scale.value = withDelay(index * 50, withSpring(1, { damping: 16, stiffness: 140 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 60).duration(350)}
      style={[
        animStyle,
        {
          shadowColor: "#6C63FF",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.07,
          shadowRadius: 8,
          elevation: 3,
        },
      ]}
      className="bg-white rounded-3xl px-4 py-4 mb-3"
    >
      <View className="flex-row items-center justify-between">
        {/* Icon Badge */}
        <View className={`${config.bg} w-12 h-12 rounded-2xl items-center justify-center mr-3`}>
          <MaterialCommunityIcons name={config.icon} size={22} color={iconColor} />
        </View>

        {/* Note + Date + Category pill */}
        <View className="flex-1 mr-3">
          <Text className="text-gray-800 font-semibold text-sm" numberOfLines={1}>
            {expense.note || "—"}
          </Text>
          <View className="flex-row items-center mt-1 gap-2">
            <Text className={`${config.text} text-xs font-bold`}>{expense.category}</Text>
            <Text className="text-gray-300 text-xs">•</Text>
            <Text className="text-gray-400 text-xs font-medium">{date}</Text>
          </View>
        </View>

        {/* Amount */}
        <View className="items-end">
          <Text className="text-gray-900 font-bold text-base">
            {formatCurrency(expense.amount)}
          </Text>
          <Text className="text-gray-400 text-[10px] mt-0.5 font-medium">INR</Text>
        </View>
      </View>
    </Animated.View>
  );
};