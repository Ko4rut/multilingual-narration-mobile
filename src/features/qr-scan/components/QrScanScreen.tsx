/**
 * Ghép QR Scanner, QR Resolve hook và phần hiển thị audio đã tìm được.
 * UI không thực hiện fetch trực tiếp; camera chỉ hoạt động ở trạng thái idle.
 */
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";

import { useQrResolution } from "../hooks/useQrResolution";
import { useQrScan } from "../hooks/useQrScan";
import { QrNarrationResult } from "./QrNarrationResult";
import { QrScanInstructions } from "./QrScanInstructions";
import { QrScanViewfinder } from "./QrScanViewfinder";

export default function QrScanScreen() {
  const theme = useTheme();

  const {
    status,
    resolvedAudio,
    errorMessage,
    resolveScannedQr,
    resetResolution,
  } = useQrResolution();

  const handleQrCodeScanned = useCallback(
    function handleQrCodeScanned(qrCode: string): void {
      // Mặc định tiếng Anh theo cấu hình demo hiện tại.
      // Khi app có preference ngôn ngữ dùng chung, truyền code đó vào đây.
      void resolveScannedQr(qrCode, "en");
    },
    [resolveScannedQr],
  );

  const {
    hasPermission,
    requestPermission,
    handleBarcodeScanned,
    resetScan,
  } = useQrScan(handleQrCodeScanned);

  function handleScanAgain(): void {
    // Reset response trước khi mở camera, tránh xử lý lại kết quả cũ.
    resetResolution();
    resetScan();
  }

  function renderScreenContent() {
    if (status === "idle") {
      return (
        <QrScanViewfinder
          hasPermission={hasPermission}
          requestPermission={requestPermission}
          handleBarcodeScanned={handleBarcodeScanned}
        />
      );
    } else if (status === "loading") {
      return (
        <View style={styles.feedbackArea}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText style={styles.message}>
            Đang xác minh mã QR và tìm audio đã xuất bản...
          </ThemedText>
        </View>
      );
    } else if (status === "error") {
      return (
        <View style={styles.feedbackArea}>
          <View style={[styles.errorPanel, { backgroundColor: theme.colors.card }]}>
            <ThemedText style={[theme.typography.sectionTitle, styles.message]}>
              Không thể xác định audio
            </ThemedText>
            <ThemedText color="textSecondary" style={styles.message}>
              {errorMessage}
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={handleScanAgain}
              style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            >
              <ThemedText style={[styles.retryButtonText, { color: theme.colors.white }]}>
                Quét lại
              </ThemedText>
            </Pressable>
          </View>
        </View>
      );
    } else if (status === "success") {
      if (resolvedAudio !== null) {
        return (
          <ScrollView
            contentContainerStyle={styles.resultContent}
            style={styles.resultScroll}
            showsVerticalScrollIndicator={false}
          >
            <QrNarrationResult audio={resolvedAudio} onScanAgain={handleScanAgain} />
          </ScrollView>
        );
      } else {
        return (
          <View style={styles.feedbackArea}>
            <ThemedText>Không tìm thấy dữ liệu audio để hiển thị.</ThemedText>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.feedbackArea}>
          <ThemedText>Trạng thái quét QR không hợp lệ.</ThemedText>
        </View>
      );
    }
  }

  function renderInstructions() {
    if (status === "idle") {
      return <QrScanInstructions />;
    } else {
      return null;
    }
  }

  return (
    <ThemedView style={styles.container}>
      {renderScreenContent()}
      {renderInstructions()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  feedbackArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  errorPanel: {
    borderRadius: 18,
    padding: 20,
    width: "100%",
    gap: 12,
  },
  message: {
    textAlign: "center",
    lineHeight: 23,
  },
  retryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 8,
    alignItems: "center",
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  resultScroll: {
    flex: 1,
  },
  resultContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
});
