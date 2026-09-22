import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { CameraView, type ScanningResult } from "expo-camera";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { getStartupImage } from "@/features/startup/services/startup-images";
import { useScanAnimation } from "../hooks/useScanAnimation";

type Props = {
  hasPermission: boolean;
  requestPermission: () => void;
  handleBarcodeScanned: (result: ScanningResult) => void;
};

export function QrScanViewfinder({ hasPermission, requestPermission, handleBarcodeScanned }: Props) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const translateY = useScanAnimation();

  return (
    <View style={styles.viewfinderContainer}>
      <Image
        source={getStartupImage("qrViewfinder")}
        style={styles.viewfinderImage}
        contentFit="cover"
        transition={0}
      />
      <View style={styles.overlayContainer} pointerEvents="box-none">
        <View style={styles.scanFrame}>
          {hasPermission ? (
            <CameraView
              style={styles.cameraInsideFrame}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={handleBarcodeScanned}
            />
          ) : (
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
                tintColor={theme.colors.white}
              />
              <ThemedText style={styles.permissionPromptText}>
                Bật Camera
              </ThemedText>
            </TouchableOpacity>
          )}
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
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  viewfinderContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.surface,
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
    // zIndex: 100,
    elevation: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderRadius: 44,
    borderWidth: 3.5,
    borderColor: `${theme.colors.white}F2`,
    overflow: "hidden",
    position: "relative",
    backgroundColor: `${theme.colors.white}1A`,
    shadowColor: theme.colors.black,
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
    backgroundColor: `${theme.colors.black}4D`,
  },
  permissionPromptText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  laserLine: {
    position: "absolute",
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: theme.colors.error,
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },

});
