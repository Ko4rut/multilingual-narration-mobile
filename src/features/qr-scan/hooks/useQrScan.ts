import { useCameraPermissions, type ScanningResult } from "expo-camera";
import { useCallback, useEffect, useRef } from "react";

export function useQrScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const requestedPermission = useRef(false);
  const lastScannedData = useRef<string | null>(null);

  useEffect(() => {
    if (!permission) {
      return;
    }
    if (permission.granted) {
      return;
    }
    if (!permission.canAskAgain) {
      return;
    }
    if (requestedPermission.current) {
      return;
    }

    requestedPermission.current = true;
    void requestPermission();
  }, [permission, requestPermission]);

  const handleBarcodeScanned = useCallback((result: ScanningResult) => {
    if (lastScannedData.current === result.data) {
      return;
    }

    lastScannedData.current = result.data;
    console.log("[QR Scanner] Nhận diện mã:", result.data);
  }, []);

  const hasPermission = Boolean(permission && permission.granted);

  return {
    hasPermission,
    requestPermission,
    handleBarcodeScanned,
  };
}
