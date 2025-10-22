declare module 'react-native-reanimated' {
    import { ComponentType, RefAttributes } from 'react';
    import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

    export interface AnimatedProps<T> extends RefAttributes<T> {
        style?: ViewStyle | TextStyle | ImageStyle | AnimatedStyle;
        source?: any;
        resizeMode?: string;
        [key: string]: any;
    }

    export type AnimatedStyle = any;

    export const Animated: {
        View: ComponentType<AnimatedProps<any>>;
        Text: ComponentType<AnimatedProps<any>>;
        Image: ComponentType<AnimatedProps<any>>;
        ScrollView: ComponentType<AnimatedProps<any>>;
        createAnimatedComponent: (component: any) => ComponentType<AnimatedProps<any>>;
    };

    export const useSharedValue: (value: any) => any;
    export const useAnimatedStyle: (style: () => any) => any;
    export const withTiming: (value: any, config?: any) => any;
    export const withSpring: (value: any, config?: any) => any;
    export const withDelay: (delay: number, animation: any) => any;
    export const withRepeat: (animation: any, count: number, reverse?: boolean) => any;
    export const withSequence: (...animations: any[]) => any;
    export const runOnJS: (fn: Function) => any;
    export const runOnUI: (fn: Function) => any;
    export const interpolate: (value: any, inputRange: number[], outputRange: number[]) => any;
    export const interpolateColor: (value: any, inputRange: number[], outputRange: string[]) => any;
    export const Easing: {
        linear: any;
        ease: any;
        quad: any;
        cubic: any;
        sin: any;
        circle: any;
        exp: any;
        elastic: any;
        back: any;
        bounce: any;
        bezier: any;
        in: any;
        out: any;
        inOut: any;
    };

    export default Animated;
}
