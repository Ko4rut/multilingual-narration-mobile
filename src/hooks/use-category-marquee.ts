/** Đo overflow và quản lý vòng đời animation category marquee. */
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, type LayoutChangeEvent } from "react-native";

import { MARQUEE_CONFIG } from "@/constants/marquee";

export function useCategoryMarquee(gap: number) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const isOverflowing = contentWidth > viewportWidth && viewportWidth > 0;

  function handleViewportLayout(event: LayoutChangeEvent) {
    setViewportWidth(Math.ceil(event.nativeEvent.layout.width));
  }

  function handleContentLayout(event: LayoutChangeEvent) {
    setContentWidth(Math.ceil(event.nativeEvent.layout.width));
  }

  useEffect(() => {
    translateX.stopAnimation();
    translateX.setValue(0);

    if (!isOverflowing) {
      return undefined;
    }

    const travelDistance = contentWidth + gap;
    const duration = Math.max(
      MARQUEE_CONFIG.minimumDuration,
      (travelDistance / MARQUEE_CONFIG.speed) * 1_000,
    );
    const marqueeCycle = Animated.sequence([
      Animated.timing(translateX, {
        duration,
        easing: Easing.linear,
        isInteraction: false,
        toValue: -travelDistance,
        useNativeDriver: true,
      }),
      Animated.delay(MARQUEE_CONFIG.repeatDelay),
    ]);
    const animation = Animated.sequence([
      Animated.delay(MARQUEE_CONFIG.initialDelay),
      Animated.loop(marqueeCycle),
    ]);

    animation.start();

    return () => {
      animation.stop();
      translateX.setValue(0);
    };
  }, [contentWidth, gap, isOverflowing, translateX]);

  return {
    handleContentLayout,
    handleViewportLayout,
    isOverflowing,
    translateX,
  };
}
