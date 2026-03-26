/// <reference types="nativewind/types" />

declare module "*.png" {
  const value: any;
  export default value;
}

declare global {
  namespace ReactNative {
    interface NamedStyles<T> {
      [key: string]: ReactNative.ViewStyle | ReactNative.TextStyle;
    }
  }
}