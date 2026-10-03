import { FadeIn, FadeInDown, FadeInUp, FadeOut, ReduceMotion } from 'react-native-reanimated';

/** One set of motion values for the whole app, so every screen moves the same way. */
export const spring = { damping: 18, stiffness: 260, mass: 0.7 } as const;

/** Entrance for the nth item in a list: a short stagger, capped so long lists never feel slow. */
export const reveal = (index = 0) =>
  FadeInDown.delay(Math.min(index, 8) * 45)
    .springify()
    .damping(20)
    .stiffness(220)
    .reduceMotion(ReduceMotion.System);

export const revealUp = FadeInUp.springify().damping(20).reduceMotion(ReduceMotion.System);
export const fadeIn = FadeIn.duration(220).reduceMotion(ReduceMotion.System);
export const fadeOut = FadeOut.duration(140).reduceMotion(ReduceMotion.System);
