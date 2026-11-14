/**
 * Trình phát MP3 native dành riêng cho kết quả quét QR.
 *
 * Component được mount sau khi API Resolve thành công, vì thế hook audio
 * có thể tự tải và phát URL mà không cần người dùng nhấn nút Play.
 */
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

import { useQrAudioPlayback } from "../hooks/useQrAudioPlayback";

interface QrAudioPlayerProps {
  audioUrl: string;
  durationSeconds: number;
}

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

export function QrAudioPlayer({
  audioUrl,
  durationSeconds,
}: QrAudioPlayerProps) {
  const theme = useTheme();
  const {
    status,
    errorMessage,
    pausePlayback,
    resumePlayback,
    replayPlayback,
  } = useQrAudioPlayback(audioUrl);

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

  function handlePlayOrPause(): void {
    if (status.playing) {
      pausePlayback();
    } else {
      void resumePlayback();
    }
  }

  function handleReplay(): void {
    void replayPlayback();
  }

  let playButtonText = "Phát";

  if (status.playing) {
    playButtonText = "Tạm dừng";
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
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
        {formatAudioTime(status.currentTime)} / {formatAudioTime(durationToDisplay)}
      </ThemedText>

      {visibleError !== null ? (
        <ThemedText style={[styles.errorText, { color: theme.colors.error }]}>
          {visibleError}
        </ThemedText>
      ) : null}

      <View style={styles.buttonRow}>
        <Pressable
          accessibilityRole="button"
          disabled={!status.isLoaded}
          onPress={handlePlayOrPause}
          style={[
            styles.controlButton,
            {
              backgroundColor: theme.colors.primary,
              opacity: status.isLoaded ? 1 : 0.5,
            },
          ]}
        >
          <ThemedText style={[styles.controlButtonText, { color: theme.colors.white }]}>
            {playButtonText}
          </ThemedText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={!status.isLoaded}
          onPress={handleReplay}
          style={[
            styles.controlButton,
            styles.replayButton,
            {
              borderColor: theme.colors.border,
              opacity: status.isLoaded ? 1 : 0.5,
            },
          ]}
        >
          <ThemedText style={styles.controlButtonText}>
            Phát lại
          </ThemedText>
        </Pressable>
      </View>
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
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  replayButton: {
    borderWidth: 1,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
