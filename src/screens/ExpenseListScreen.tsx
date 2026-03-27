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
import { useState, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  FilterType, 
  filterExpenses, 
  formatFilterLabel,
  getFilterDates 
} from '../utils/dateFilters';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

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
        onPressIn={() => { scale.value = withSpring(0.92, { damping: 45 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 42 }); }}
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
  const [filterType, setFilterType] = useState<FilterType>('thisMonth');
const [showCustomPicker, setShowCustomPicker] = useState(false);
const [customStart, setCustomStart] = useState<Date>(new Date());
const [customEnd, setCustomEnd] = useState<Date>(new Date());
const [showStartPicker, setShowStartPicker] = useState(false);
const [showEndPicker, setShowEndPicker] = useState(false);

  const renderItem = ({ item, index }: { item: Expense; index: number }) => (
    <ExpenseCard expense={item} index={index} />
  );

  const filterOptions: { id: FilterType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'thisMonth', label: 'This Month', icon: 'today-outline' },
  { id: 'monthly', label: 'Full Month', icon: 'calendar-outline' },
  { id: 'thisWeek', label: 'This Week', icon: 'calendar' },  
  { id: 'weekly', label: 'Full Week', icon: 'calendar-number' }, 
  { id: 'custom', label: 'Custom', icon: 'calendar-clear-outline' },
];


const filteredExpenses = useMemo(() => 
  filterExpenses(expenses, filterType, 
    filterType === 'custom' ? customStart : undefined,
    filterType === 'custom' ? customEnd : undefined
  ), [expenses, filterType, customStart, customEnd]
);

const filteredTotal = useMemo(() => 
  filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0), 
  [filteredExpenses]
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
    {formatCurrency(filteredTotal)}
  </Text>
  <View className="flex-row items-center mt-3 gap-2">
    <View className="bg-white/20 rounded-full px-3 py-1 flex-row items-center gap-1">
      <Ionicons name="receipt-outline" size={11} color="rgba(255,255,255,0.8)" />
      <Text className="text-white/80 text-xs font-semibold">
        {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? "s" : ""}
      </Text>
    </View>
    <SpringButton
      onPress={() => setShowCustomPicker(true)}
      className="bg-white/20 rounded-full px-3 py-1 flex-row items-center gap-1"
    >
      <Ionicons name="filter-outline" size={11} color="rgba(255,255,255,0.8)" />
      <Text className="text-white/80 text-xs font-semibold">
  {formatFilterLabel(filterType, 
    filterType === 'custom' ? customStart : undefined,
    filterType === 'custom' ? customEnd : undefined
  )}
</Text>
    </SpringButton>
  </View>
</Animated.View>
</Animated.View>


      {/* ── List Section ── */}
      <View className="flex-1 px-5 -mt-6">

        {/* Section Header */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} className="mb-4">
  <View className="flex-row flex-wrap gap-2">
    {filterOptions.map(({ id, label, icon }) => (
      <SpringButton
        key={id}
        onPress={() => {
          if (id === 'custom') {
            setShowCustomPicker(true);
          } else {
            setFilterType(id);
          }
        }}
        className={`px-4 py-2 rounded-2xl flex-row items-center gap-2 ${
          filterType === id 
            ? 'bg-primary shadow-primary shadow-lg' 
            : 'bg-white shadow-sm shadow-gray-200'
        }`}
        style={{
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: filterType === id ? 0.4 : 0.1,
          shadowRadius: 12,
          elevation: filterType === id ? 8 : 3,
        }}
      >
        <Ionicons 
          name={icon} 
          size={16} 
          color={filterType === id ? '#fff' : '#6C63FF'} 
        />
       <Text 
  className={`font-semibold text-sm ${
    filterType === id ? 'text-white' : 'text-gray-800'
  }`}
  numberOfLines={1}
>
  {formatFilterLabel(id, 
    id === 'custom' && filterType === 'custom' ? customStart : undefined,
    id === 'custom' && filterType === 'custom' ? customEnd : undefined
  )}
</Text>
      </SpringButton>
    ))}
  </View>
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
  data={filteredExpenses}  // Changed from expenses
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 32, paddingTop: 4 }}
/>
        )}
      </View>
     {showCustomPicker && (
  <Animated.View
    entering={FadeInUp.duration(300)}
    className="absolute inset-0 bg-black/50 justify-end"
  >
    <Animated.View
      entering={FadeInDown.duration(300)}
      className="bg-white rounded-t-3xl p-6 pb-10 max-h-[80%]"
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-gray-800">Select Date Range</Text>
        <SpringButton onPress={() => setShowCustomPicker(false)}>
          <Ionicons name="close-outline" size={24} color="#666" />
        </SpringButton>
      </View>
      
      <View className="gap-4 mb-6">
        {/* Start Date */}
        <View>
          <Text className="text-sm font-semibold text-gray-600 mb-2">Start Date</Text>
          <SpringButton
            onPress={() => setShowStartPicker(true)}
            className="border border-gray-200 rounded-2xl px-4 py-4 flex-row items-center justify-between"
          >
            <Text className="text-gray-800 font-semibold">
              {format(customStart, 'MMM dd, yyyy')}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#6C63FF" />
          </SpringButton>
        </View>
        
        {/* End Date */}
        <View>
          <Text className="text-sm font-semibold text-gray-600 mb-2">End Date</Text>
          <SpringButton
            onPress={() => setShowEndPicker(true)}
            className="border border-gray-200 rounded-2xl px-4 py-4 flex-row items-center justify-between"
          >
            <Text className="text-gray-800 font-semibold">
              {format(customEnd, 'MMM dd, yyyy')}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#6C63FF" />
          </SpringButton>
        </View>

        {/* Date validation */}
        {customStart > customEnd && (
          <Text className="text-red-500 text-sm text-center font-medium">
            Start date must be before end date
          </Text>
        )}
      </View>
      
      <SpringButton
        onPress={() => {
          if (customStart <= customEnd) {
            setFilterType('custom');
          }
          setShowCustomPicker(false);
        }}
        disabled={customStart > customEnd}
        className="bg-primary rounded-2xl py-4 disabled:bg-gray-400 disabled:shadow-none"
        style={{ 
          shadowColor: "#6C63FF", 
          shadowOffset: { width: 0, height: 8 }, 
          shadowOpacity: 0.3, 
          shadowRadius: 20, 
          elevation: 12 
        }}
      >
        <Text className="text-white font-bold text-lg text-center">
          Apply Filter
        </Text>
      </SpringButton>
    </Animated.View>
  </Animated.View>
)}

// 4. Add DateTimePickers (outside modal, controlled)
{showStartPicker && (
  <DateTimePicker
    value={customStart}
    mode="date"
    display={Platform.OS === 'ios' ? 'inline' : 'default'}
    onChange={(event, selectedDate) => {
      setShowStartPicker(Platform.OS === 'ios'); // iOS needs manual close
      if (selectedDate) {
        setCustomStart(selectedDate);
      }
    }}
    maximumDate={new Date()} // No future dates
  />
)}

{showEndPicker && (
  <DateTimePicker
    value={customEnd}
    mode="date"
    display={Platform.OS === 'ios' ? 'inline' : 'default'}
    onChange={(event, selectedDate) => {
      setShowEndPicker(Platform.OS === 'ios');
      if (selectedDate) {
        setCustomEnd(selectedDate);
      }
    }}
    minimumDate={customStart} // Cannot be before start date
    maximumDate={new Date()}
  />
)}
    </SafeAreaView>
  );
};