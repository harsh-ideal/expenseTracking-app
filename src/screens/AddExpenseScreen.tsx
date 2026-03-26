import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/AppStack";
import { useAuthContext } from "../context/AuthContext";
import { addExpense } from "../services/expenseService";
import { EXPENSE_CATEGORIES, ExpenseCategory } from "../types";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

type Props = NativeStackScreenProps<AppStackParamList, "AddExpense">;

// ─── Category Icon Config ──────────────────────────────────────────────────────
type IconLib = "Ionicons" | "MaterialCommunityIcons";

interface CategoryConfig {
  lib: IconLib;
  icon: string;
  color: string;
  bg: string;
  border: string;
  selectedBg: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  Food:          { lib: "MaterialCommunityIcons", icon: "food-fork-drink",               color: "#EA580C", bg: "bg-orange-50",  border: "border-orange-200", selectedBg: "bg-orange-500" },
  Transport:     { lib: "MaterialCommunityIcons", icon: "car-outline",                   color: "#2563EB", bg: "bg-blue-50",    border: "border-blue-200",   selectedBg: "bg-blue-500" },
  Shopping:      { lib: "MaterialCommunityIcons", icon: "shopping-outline",              color: "#DB2777", bg: "bg-pink-50",    border: "border-pink-200",   selectedBg: "bg-pink-500" },
  Entertainment: { lib: "MaterialCommunityIcons", icon: "movie-open-outline",            color: "#9333EA", bg: "bg-purple-50",  border: "border-purple-200", selectedBg: "bg-purple-500" },
  Health:        { lib: "MaterialCommunityIcons", icon: "heart-pulse",                   color: "#16A34A", bg: "bg-green-50",   border: "border-green-200",  selectedBg: "bg-green-500" },
  Bills:         { lib: "MaterialCommunityIcons", icon: "file-document-outline",         color: "#CA8A04", bg: "bg-yellow-50",  border: "border-yellow-200", selectedBg: "bg-yellow-500" },
  Utilities:     { lib: "MaterialCommunityIcons", icon: "lightning-bolt-outline",        color: "#0891B2", bg: "bg-cyan-50",    border: "border-cyan-200",   selectedBg: "bg-cyan-500" },
  Education:     { lib: "MaterialCommunityIcons", icon: "book-open-outline",             color: "#4F46E5", bg: "bg-indigo-50",  border: "border-indigo-200", selectedBg: "bg-indigo-500" },
  Other:         { lib: "Ionicons",               icon: "ellipsis-horizontal-circle-outline", color: "#6B7280", bg: "bg-gray-50", border: "border-gray-200", selectedBg: "bg-gray-500" },
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const AddExpenseScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuthContext();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [amountError, setAmountError] = useState<string | undefined>();

  const headerOpacity = useSharedValue(0);
  const amountScale = useSharedValue(0.85);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    amountScale.value = withSpring(1, { damping: 14, stiffness: 120 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const amountScaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: amountScale.value }] }));

  const validate = (): boolean => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setAmountError("Please enter a valid amount.");
      return false;
    }
    setAmountError(undefined);
    return true;
  };

  const handleSave = async () => {
    if (!validate() || !user) return;
    setLoading(true);
    try {
      await addExpense(user.uid, {
        amount: parseFloat(amount),
        category,
        note: note.trim(),
      });
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to save expense.");
    } finally {
      setLoading(false);
    }
  };

  const selectedConfig = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG["Other"];

  return (
    <SafeAreaView className="flex-1 bg-[#F4F3FF]" edges={["top","bottom"]}>

      <ScrollView
        className="flex-1 px-5"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ── Amount Input ── */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="">
          <Input
            label="Amount (₹)"
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            error={amountError}
          />
        </Animated.View>

        {/* ── Category ── */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="grid-outline" size={14} color="#6B7280" />
            <Text className="text-sm font-semibold text-gray-500 tracking-widest uppercase">
              Category
            </Text>
          </View>
          <View className="flex-row flex-wrap mb-5">
            {EXPENSE_CATEGORIES.map((cat, index) => (
              <CategoryChip
                key={cat}
                cat={cat}
                selected={category === cat}
                config={CATEGORY_CONFIG[cat] ?? CATEGORY_CONFIG["Other"]}
                index={index}
                onSelect={() => setCategory(cat)}
              />
            ))}
          </View>
        </Animated.View>

        {/* ── Note Input ── */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Input
            label="Note (optional)"
            placeholder="What was this for?"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: "top" }}
          />
        </Animated.View>

        {/* ── Buttons ── */}
         <Animated.View
      entering={FadeInDown.delay(400).duration(400)}
      className="px-5 pb-5 pt-3 bg-[#F4F3FF]"
      style={{
        borderTopWidth: 1,
        borderTopColor: "rgba(148,163,184,0.2)",
      }}
    >
      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
        <View className="flex-1">
          <Button
            title="Save"
            onPress={handleSave}
            loading={loading}
            variant="primary"
          />
        </View>
      </View>
    </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Category Chip ─────────────────────────────────────────────────────────────
interface ChipProps {
  cat: string;
  selected: boolean;
  config: CategoryConfig;
  index: number;
  onSelect: () => void;
}

const CategoryChip: React.FC<ChipProps> = ({ cat, selected, config, index, onSelect }) => {
  const scale = useSharedValue(1);

  const chipStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconColor = selected ? "#fff" : config.color;

  return (
    <Animated.View
      entering={ZoomIn.delay(index * 40).duration(300)}
      style={chipStyle}
    >
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.9, { damping: 15 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 10 }); }}
        onPress={onSelect}
        className={`mr-2 mb-2 px-3 py-2 rounded-2xl flex-row items-center gap-2 border-2 ${
          selected
            ? `${config.selectedBg} border-transparent`
            : `bg-white ${config.border}`
        }`}
        style={selected ? {
          shadowColor: config.color,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.35,
          shadowRadius: 6,
          elevation: 5,
        } : {}}
      >
        {/* Icon */}
        {config.lib === "Ionicons" ? (
          <Ionicons name={config.icon as any} size={15} color={iconColor} />
        ) : (
          <MaterialCommunityIcons name={config.icon as any} size={15} color={iconColor} />
        )}

        {/* Label */}
        <Text
          className={`text-xs font-bold ${
            selected ? "text-white" : "text-gray-600"
          }`}
        >
          {cat}
        </Text>
      </Pressable>
    </Animated.View>
  );
};