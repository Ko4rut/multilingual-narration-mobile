/**
 * Trình phát MP3 dùng chung cho narration từ QR và Explore.
 * Component tự tải và phát URL sau khi narration được resolve thành công.
 */
import { SymbolView } from "expo-symbols";
import type { ComponentProps } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

import { useAudioPlayback } from "../hooks/useAudioPlayback";

interface NarrationAudioPlayerProps {
  audioUrl: string;
  durationSeconds: number;
  onPlaybackStarted?(): void;
}

type SymbolName = ComponentProps<typeof SymbolView>["name"];

function ignorePlaybackStart(): void {}

/** Định dạng giây thành mm:ss, bảo đảm không hiển thị NaN khi chưa load. */
function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  if (seconds < 0) {
    return "00:00";
  }

  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;

  const minuteText = String(minutes).padStart(2, "0");
  const secondText = String(remainingSeconds).padStart(2, "0");

  return minuteText + ":" + secondText;
}

export function NarrationAudioPlayer({
  audioUrl,
  durationSeconds,
  onPlaybackStarted,
}: NarrationAudioPlayerProps) {
  const theme = useTheme();
  const handlePlaybackStarted = onPlaybackStarted ?? ignorePlaybackStart;

  const {
    status,
    errorMessage,
    pausePlayback,
    resumePlayback,
    replayPlayback,
  } = useAudioPlayback(audioUrl, handlePlaybackStarted);

  let durationToDisplay = durationSeconds;

  if (status.duration > 0) {
    durationToDisplay = status.duration;
  }

  let playbackText = "Đang tải file thuyết minh...";

  if (status.error !== null) {
    playbackText = "Không thể tải MP3.";
  } else if (!status.isLoaded) {
    playbackText = "Đang tải file thuyết minh...";
  } else if (status.isBuffering) {
    playbackText = "Đang đệm dữ liệu âm thanh...";
  } else if (status.playing) {
    playbackText = "Đang phát thuyết minh";
  } else if (status.didJustFinish) {
    playbackText = "Đã phát xong";
  } else {
    playbackText = "Đã tạm dừng hoặc đang chờ phát";
  }

  let visibleError: string | null = null;

  if (status.error !== null) {
    visibleError = status.error;
  } else if (errorMessage !== null) {
    visibleError = errorMessage;
  }

  const hasFinished =
    status.didJustFinish ||
    (status.duration > 0 && status.currentTime >= status.duration);

  function handleControlPress(): void {
    if (status.playing) {
      pausePlayback();
    } else if (hasFinished) {
      void replayPlayback();
    } else {
      void resumePlayback();
    }
  }

  const controlLabel = status.playing
    ? "Tạm dừng"
    : hasFinished
      ? "Phát lại"
      : "Phát";
  const controlIcon: SymbolName = status.playing
    ? { ios: "pause.fill", android: "pause", web: "pause" }
    : hasFinished
      ? {
          ios: "arrow.counterclockwise",
          android: "replay",
          web: "replay",
        }
      : { ios: "play.fill", android: "play_arrow", web: "play_arrow" };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.playerRow}>
        <View style={styles.playerDetails}>
          <ThemedText style={theme.typography.sectionTitle}>
            Trình phát thuyết minh
          </ThemedText>

          <View style={styles.playbackStatus}>
            {status.isBuffering || !status.isLoaded ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : null}

            <ThemedText color="textSecondary" style={styles.playbackLabel}>
              {playbackText}
            </ThemedText>
          </View>

          <ThemedText color="textSecondary" style={styles.timeText}>
            {formatAudioTime(status.currentTime)} /{" "}
            {formatAudioTime(durationToDisplay)}
          </ThemedText>
        </View>

        <Pressable
          accessibilityLabel={controlLabel}
          accessibilityRole="button"
          disabled={!status.isLoaded}
          onPress={handleControlPress}
          style={[
            styles.controlButton,
            {
              backgroundColor: theme.colors.primary,
              opacity: status.isLoaded ? 1 : 0.5,
            },
          ]}
        >
          <SymbolView
            name={controlIcon}
            size={26}
            tintColor={theme.colors.white}
          />
        </Pressable>
      </View>

      {visibleError !== null ? (
        <ThemedText style={[styles.errorText, { color: theme.colors.error }]}>
          {visibleError}
        </ThemedText>
      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  playbackStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  playbackLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 13,
    lineHeight: 19,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  playerDetails: {
    flex: 1,
    gap: 12,
  },
  controlButton: {
    alignItems: "center",
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
});
