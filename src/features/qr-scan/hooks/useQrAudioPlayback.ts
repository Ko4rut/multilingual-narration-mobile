/**
 * Quản lý phát audio thuyết minh cho kết quả QR.
 *
 * Mỗi lần mở kết quả QR sẽ có một player riêng. useAudioPlayer tự giải phóng
 * player khi component unmount, tránh phát chồng sau khi chọn "Quét mã khác".
 *
 * Hook chỉ phụ trách audio native và vòng đời màn hình, không gọi API Resolve.
 */
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioStatus,
} from "expo-audio";
import { useIsFocused } from "expo-router";
import { useEffect, useRef, useState } from "react";

export interface QrAudioPlaybackController {
  status: AudioStatus;
  errorMessage: string | null;
  pausePlayback: () => void;
  resumePlayback: () => Promise<void>;
  replayPlayback: () => Promise<void>;
}

export function useQrAudioPlayback(audioUrl: string): QrAudioPlaybackController {
  // Chỉ tạo một player cho URL hiện tại, dùng streaming từ backend.
  const player = useAudioPlayer(audioUrl, {
    updateInterval: 500,
    downloadFirst: false,
  });

  const status = useAudioPlayerStatus(player);
  const isFocused = useIsFocused();
  const autoPlayRequestedRef = useRef<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(function startAudioAfterLoadEffect() {
    // Không tự phát trước khi nguồn âm thanh được load thành công.
    if (!status.isLoaded) {
      return;
    }

    // Không phát âm thanh của tab QR khi người dùng đã rời màn hình.
    if (!isFocused) {
      return;
    }

    // Chỉ tự phát một lần sau khi quét. Pause thủ công không kích hoạt auto-play.
    if (autoPlayRequestedRef.current) {
      return;
    }

    autoPlayRequestedRef.current = true;
    let effectActive = true;

    async function startPlayback(): Promise<void> {
      try {
        // Bật âm thanh trong silent mode (iOS) và không yêu cầu phát nền.
        // Thiết lập session trước khi gọi play để tránh mất tiếng trên iPhone.
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: "doNotMix",
        });

        if (!effectActive) {
          return;
        }

        player.play();
      } catch (cause) {
        if (!effectActive) {
          return;
        }

        if (cause instanceof Error) {
          setErrorMessage("Không thể tự phát audio: " + cause.message);
        } else {
          setErrorMessage("Không thể tự phát audio trên thiết bị.");
        }
      }
    }

    void startPlayback();

    return function cancelPendingAutoplay(): void {
      // Tránh gọi play sau khi người dùng quét lại hoặc chuyển tab.
      effectActive = false;
    };
  }, [isFocused, player, status.isLoaded]);

  useEffect(function pauseWhenLeavingQrTabEffect() {
    if (isFocused) {
      return;
    }

    // Tabs của Expo Router có thể vẫn giữ component mounted khi chuyển tab.
    // Tạm dừng rõ ràng thay vì để audio tiếp tục phát ngoài màn hình QR.
    player.pause();
  }, [isFocused, player]);

  function pausePlayback(): void {
    player.pause();
  }

  async function resumePlayback(): Promise<void> {
    try {
      setErrorMessage(null);

      if (!status.isLoaded) {
        throw new Error("Audio vẫn đang được tải.");
      }

      // Nếu bài đã kết thúc, nhấn Phát sẽ phát lại từ đầu.
      if (status.didJustFinish) {
        await player.seekTo(0);
      } else if (status.duration > 0 && status.currentTime >= status.duration) {
        await player.seekTo(0);
      }

      player.play();
    } catch (cause) {
      if (cause instanceof Error) {
        setErrorMessage("Không thể tiếp tục phát: " + cause.message);
      } else {
        setErrorMessage("Không thể tiếp tục phát âm thanh.");
      }
    }
  }

  async function replayPlayback(): Promise<void> {
    try {
      setErrorMessage(null);

      if (!status.isLoaded) {
        throw new Error("Audio vẫn đang được tải.");
      }

      await player.seekTo(0);
      player.play();
    } catch (cause) {
      if (cause instanceof Error) {
        setErrorMessage("Không thể phát lại: " + cause.message);
      } else {
        setErrorMessage("Không thể phát lại âm thanh.");
      }
    }
  }

  return {
    status,
    errorMessage,
    pausePlayback,
    resumePlayback,
    replayPlayback,
  };
}
