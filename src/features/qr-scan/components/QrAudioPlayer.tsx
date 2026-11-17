/** Gắn analytics QR vào player audio dùng chung. */
import { useCallback } from "react";

import { NarrationAudioPlayer } from "@/features/audio/components/NarrationAudioPlayer";

import { recordQrListeningStart } from "../services/qr-listening.api";

interface QrAudioPlayerProps {
  qrCode: string;
  contentId: string;
  audioUrl: string;
  durationSeconds: number;
}

export function QrAudioPlayer({
  qrCode,
  contentId,
  audioUrl,
  durationSeconds,
}: QrAudioPlayerProps) {
  const handlePlaybackStarted = useCallback(function recordListening(): void {
    // Analytics chỉ là best-effort, không được làm gián đoạn phát audio.
    void recordQrListeningStart({ qrCode, poiContentId: contentId })
      .then((ack) => {
        if (__DEV__) {
          console.log("[QR LISTENING] saved", ack.id, ack.result);
        }
      })
      .catch((error: unknown) => {
        console.warn("[QR LISTENING] could not save listening session:", error);
      });
  }, [contentId, qrCode]);

  return (
    <NarrationAudioPlayer
      audioUrl={audioUrl}
      durationSeconds={durationSeconds}
      onPlaybackStarted={handlePlaybackStarted}
    />
  );
}
