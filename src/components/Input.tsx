import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TextInputProps, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, value, onFocus, onBlur, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const floatAnim = useSharedValue(value ? 1 : 0);
  const focusAnim = useSharedValue(0);
  const shakeAnim = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withTiming(isFocused || !!value ? 1 : 0, { duration: 200 });
    focusAnim.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused, value]);

  // Shake on error
  useEffect(() => {
    if (error) {
      shakeAnim.value = withTiming(1, { duration: 60 }, () => {
        shakeAnim.value = withTiming(-1, { duration: 60 }, () => {
          shakeAnim.value = withTiming(1, { duration: 60 }, () => {
            shakeAnim.value = withTiming(0, { duration: 60 });
          });
        });
      });
    }
  }, [error]);

  const labelStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(floatAnim.value, [0, 1], [0, -26], Extrapolation.CLAMP),
      },
      {
        scale: interpolate(floatAnim.value, [0, 1], [1, 0.82], Extrapolation.CLAMP),
      },
    ],
    color: error
      ? "#EF4444"
      : isFocused
      ? "#6C63FF"
      : "#9CA3AF",
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: error
      ? "#EF4444"
      : interpolate(focusAnim.value, [0, 1], [0, 1]) === 1
      ? "#6C63FF"
      : "#E5E7EB",
    borderWidth: interpolate(focusAnim.value, [0, 1], [1.5, 2], Extrapolation.CLAMP),
  }));

  const containerShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shakeAnim.value, [-1, 0, 1], [-6, 0, 6], Extrapolation.CLAMP) }],
  }));

  return (
    <Animated.View style={containerShakeStyle} className="mb-5">
      <Pressable onPress={() => inputRef.current?.focus()}>
        <Animated.View
          style={[borderStyle]}
          className="rounded-2xl bg-white px-4 pt-5 pb-3 relative"
        >
          {/* Floating Label */}
          <Animated.Text
            style={[labelStyle, { position: "absolute", left: 16, top: 16, fontSize: 15, fontWeight: "500", transformOrigin: "left center" }]}
          >
            {label}
          </Animated.Text>

          <TextInput
            ref={inputRef}
            value={value}
            onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
            className="text-base text-gray-900 mt-1"
            placeholderTextColor="transparent"
            style={{ minHeight: 28 }}
            {...props}
          />
        </Animated.View>
      </Pressable>

      {error ? (
        <Animated.Text
          entering={undefined}
          className="text-red-500 text-xs mt-1 ml-1 font-medium"
        >
          ⚠ {error}
        </Animated.Text>
      ) : null}
    </Animated.View>
  );
};