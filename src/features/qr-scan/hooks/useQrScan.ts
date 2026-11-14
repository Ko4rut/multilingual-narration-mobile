/**
 * Chịu trách nhiệm xin quyền camera và nhận dữ liệu QR từ expo-camera.
 * Chống callback quét lặp cho tới khi người dùng chủ động chọn "Quét mã khác".
 * Hook này không gọi API và không xử lý audio.
 */
import { useCameraPermissions, type ScanningResult } from "expo-camera";
import { useCallback, useEffect, useRef } from "react";

export function useQrScan(onQrCodeScanned: (qrCode: string) => void) {
  const [permission, requestPermission] = useCameraPermissions();
  const requestedPermissionRef = useRef<boolean>(false);
  const scanLockedRef = useRef<boolean>(false);

  useEffect(function requestCameraPermissionEffect() {
    if (permission === null) {
      return;
    }

    if (permission.granted) {
      return;
    }

    if (!permission.canAskAgain) {
      return;
    }

    if (requestedPermissionRef.current) {
      return;
    }

    requestedPermissionRef.current = true;
    void requestPermission();
  }, [permission, requestPermission]);

  const handleBarcodeScanned = useCallback(
    function handleBarcodeScanned(result: ScanningResult): void {
      if (scanLockedRef.current) {
        return;
      }

      const scannedValue = result.data.trim();

      if (scannedValue.length === 0) {
        return;
      }

      // Khóa ngay, trước khi gọi callback, vì CameraView có thể gửi nhiều event.
      scanLockedRef.current = true;
      onQrCodeScanned(scannedValue);
    },
    [onQrCodeScanned],
  );

  const resetScan = useCallback(function resetScan(): void {
    // Chỉ mở khóa khi màn hình đã sẵn sàng nhận một QR mới.
    scanLockedRef.current = false;
  }, []);

  let hasPermission = false;

  if (permission !== null) {
    if (permission.granted) {
      hasPermission = true;
    } else {
      hasPermission = false;
    }
  }

  return {
    hasPermission,
    requestPermission,
    handleBarcodeScanned,
    resetScan,
  };
}
