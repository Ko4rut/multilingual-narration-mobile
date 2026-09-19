import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { CameraView, useCameraPermissions, type ScanningResult } from "expo-camera";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

export default function QrScanScreen() {
  // ==========================================================================
  // 1. HOOKS & STATE MANAGEMENT
  // ==========================================================================
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);

  // Giá trị animation cho tia laser quét QR
  const scanAnim = useRef(new Animated.Value(0)).current;

  // ==========================================================================
  // 2. EFFECTS & ANIMATIONS
  // ==========================================================================

  // Tự động kiểm tra và yêu cầu cấp quyền Camera khi mở màn hình
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Vòng lặp animation: Tia laser đỏ chuyển động lên xuống liên tục
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [scanAnim]);

  // Nội suy giá trị khoảng cách di chuyển của tia laser trong khung quét (280px)
  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 245],
  });

  // ==========================================================================
  // 3. EVENT HANDLERS
  // ==========================================================================
  const handleBarcodeScanned = (result: ScanningResult) => {
    if (scannedData === result.data) return;
    setScannedData(result.data);
    console.log("[QR Scanner] Nhận diện mã:", result.data);
  };

  // ==========================================================================
  // 4. RENDER GIAO DIỆN
  // ==========================================================================
  return (
    <ThemedView style={styles.container}>
      {/* ---------------------------------------------------------------------- */}
      {/* 4.1. KHU VỰC VIEWFINDER PHÍA TRÊN (Ảnh nền chùa + Khung Camera trực tiếp) */}
      {/* ---------------------------------------------------------------------- */}
      <View style={styles.viewfinderContainer}>
        {/* Hình nền phong cảnh/ngôi chùa giữ nguyên phía sau */}
        <Image
          source={require("@/assets/images/camera-viewfinder.png")}
          style={styles.viewfinderImage}
          contentFit="cover"
        />

        {/* Lớp phủ chứa khung quét Camera bo góc ở chính giữa */}
        <View style={styles.overlayContainer} pointerEvents="box-none">
          <View style={styles.scanFrame}>
            {/* Nếu đã cấp quyền -> hiển thị luồng Camera thật */}
            {permission?.granted ? (
              <CameraView
                style={styles.cameraInsideFrame}
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={handleBarcodeScanned}
              />
            ) : (
              /* Nếu chưa cấp quyền -> hiển thị nút chạm để xin cấp quyền */
              <TouchableOpacity
                style={styles.permissionTouchArea}
                onPress={requestPermission}
                activeOpacity={0.8}
              >
                <SymbolView
                  name={{
                    ios: "camera.fill",
                    android: "camera_alt",
                    web: "camera_alt",
                  }}
                  size={28}
                  tintColor="#FFFFFF"
                />
                <ThemedText style={styles.permissionPromptText}>
                  Bật Camera
                </ThemedText>
              </TouchableOpacity>
            )}

            {/* Tia quét laser màu đỏ */}
            <Animated.View
              style={[
                styles.laserLine,
                {
                  transform: [{ translateY }],
                },
              ]}
              pointerEvents="none"
            />
          </View>
        </View>
      </View>

      {/* ---------------------------------------------------------------------- */}
      {/* 4.2. PANEL THÔNG TIN HƯỚNG DẪN PHÍA DƯỚI (Chuẩn thiết kế Figma)        */}
      {/* ---------------------------------------------------------------------- */}
      <View style={[styles.bottomPanel, { backgroundColor: theme.colors.background }]}>
        {/* Tiêu đề tính năng */}
        <ThemedText
          style={[
            theme.typography.title,
            styles.title,
            { color: theme.colors.textPrimary },
          ]}
        >
          Direct Scan Feature
        </ThemedText>

        {/* Mô tả phụ - Cố định hiển thị trên 1 dòng */}
        <ThemedText
          color="textSecondary"
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            theme.typography.body,
            styles.subtitle,
          ]}
        >
          Tap instantly on any local physical signpost QR codes
        </ThemedText>

        {/* Hộp gợi ý cơ chế tự động tải gói ngôn ngữ (Tip Box) */}
        <View style={[styles.tipBox, { backgroundColor: theme.colors.card }]}>
          <View style={styles.iconWrapper}>
            <SymbolView
              name={{
                ios: "lightbulb",
                android: "lightbulb",
                web: "lightbulb",
              }}
              size={20}
              tintColor={theme.colors.primaryDark}
            />
          </View>
          <ThemedText
            color="textSecondary"
            style={[
              theme.typography.caption,
              styles.tipText,
            ]}
          >
            Scanning automatically downloads the correct language package and begins the audio narrative immediately.
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

// ==========================================================================
// 5. STYLESHEET (ĐỊNH NGHĨA KIỂU DÁNG)
// ==========================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // --- Khung Viewfinder phía trên ---
  viewfinderContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#1A1A1A",
    position: "relative",
    overflow: "hidden",
  },
  viewfinderImage: {
    width: "100%",
    height: "100%",
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderRadius: 44,
    borderWidth: 3.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 101,
  },
  cameraInsideFrame: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  permissionTouchArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  permissionPromptText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  laserLine: {
    position: "absolute",
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: "#FF3B30",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 102,
  },

  // --- Panel thông tin phía dưới ---
  bottomPanel: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.3,
    lineHeight: 29,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13.5,
    letterSpacing: -0.15,
    lineHeight: 19,
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    gap: 10,
  },
  iconWrapper: {
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
