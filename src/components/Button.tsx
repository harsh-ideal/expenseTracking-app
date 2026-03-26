import React from "react";
import {
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "danger" | "outline";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = "primary",
  disabled,
  onPress,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.95, { damping: 15, stiffness: 300 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 12, stiffness: 200 }); };

  const bgStyle = {
    primary: "bg-primary shadow-lg shadow-indigo-300",
    danger: "bg-red-500 shadow-lg shadow-red-300",
    outline: "bg-transparent border-2 border-primary",
  }[variant];

  const textStyle = {
    primary: "text-white font-bold text-base tracking-wide",
    danger: "text-white font-bold text-base",
    outline: "text-primary font-bold text-base tracking-wide",
  }[variant];

  return (
    <AnimatedPressable
      style={[animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={disabled || loading ? undefined : (onPress as any)}
      className={`rounded-2xl py-4 px-6 items-center justify-center flex-row ${bgStyle} ${
        disabled || loading ? "opacity-50" : ""
      }`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#6C63FF" : "#fff"} size="small" />
      ) : (
        <Text className={textStyle}>{title}</Text>
      )}
    </AnimatedPressable>
  );
};