import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { useQrScan } from "../hooks/useQrScan";
import { QrScanInstructions } from "./QrScanInstructions";
import { QrScanViewfinder } from "./QrScanViewfinder";

export default function QrScanScreen() {
  const { hasPermission, requestPermission, handleBarcodeScanned } = useQrScan();

  return (
    <ThemedView style={styles.container}>
      <QrScanViewfinder
        hasPermission={hasPermission}
        requestPermission={requestPermission}
        handleBarcodeScanned={handleBarcodeScanned}
      />
      <QrScanInstructions />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
