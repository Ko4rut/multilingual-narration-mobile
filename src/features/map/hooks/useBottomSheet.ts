/** Đóng gói snap points, pan gesture và animated style của bottom sheet. */
import { useEffect } from "react";
import {
  Gesture,
  type GestureStateChangeEvent,
  type GestureUpdateEvent,
  type PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  BOTTOM_SHEET_COLLAPSED_HEIGHT,
  BOTTOM_SHEET_EXPANDED_HEIGHT_RATIO,
  BOTTOM_SHEET_SPRING_CONFIG,
  BOTTOM_SHEET_VELOCITY_THRESHOLD,
} from "../constants/bottomSheet";

export function useBottomSheet(screenHeight: number) {
  const sheetHeight = Math.round(
    screenHeight * BOTTOM_SHEET_EXPANDED_HEIGHT_RATIO,
  );
  const collapsedOffset = Math.max(
    sheetHeight - BOTTOM_SHEET_COLLAPSED_HEIGHT,
    0,
  );
  const translateY = useSharedValue(collapsedOffset);
  const gestureStartY = useSharedValue(collapsedOffset);

  useEffect(() => {
    translateY.value = collapsedOffset;
    gestureStartY.value = collapsedOffset;
  }, [collapsedOffset, gestureStartY, translateY]);

  function snapTo(position: number) {
    "worklet";

    translateY.value = withSpring(position, BOTTOM_SHEET_SPRING_CONFIG);
  }

  function handleGestureBegin() {
    "worklet";

    gestureStartY.value = translateY.value;
  }

  function handleGestureUpdate(
    event: GestureUpdateEvent<PanGestureHandlerEventPayload>,
  ) {
    "worklet";

    translateY.value = clamp(
      gestureStartY.value + event.translationY,
      0,
      collapsedOffset,
    );
  }

  function handleGestureEnd(
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) {
    "worklet";

    if (event.velocityY < -BOTTOM_SHEET_VELOCITY_THRESHOLD) {
      snapTo(0);
      return;
    }

    if (event.velocityY > BOTTOM_SHEET_VELOCITY_THRESHOLD) {
      snapTo(collapsedOffset);
      return;
    }

    snapTo(translateY.value < collapsedOffset / 2 ? 0 : collapsedOffset);
  }

  const panGesture = Gesture.Pan()
    .onBegin(handleGestureBegin)
    .onUpdate(handleGestureUpdate)
    .onEnd(handleGestureEnd);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  function toggleSheet() {
    snapTo(translateY.value < collapsedOffset / 2 ? collapsedOffset : 0);
  }

  return {
    animatedSheetStyle,
    panGesture,
    sheetHeight,
    toggleSheet,
  };
}
