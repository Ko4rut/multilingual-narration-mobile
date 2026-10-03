/** Ảnh bìa và nút quay lại của màn hình chi tiết POI. */
import { Image, Pressable, StyleSheet, View } from "react-native";

import { EXPLORE_IMAGES } from "../constants/explore-assets";

type PoiDetailHeroProps = {
  imageUrl: string;
  poiName: string;
  onBack(): void;
};

export function PoiDetailHero({
  imageUrl,
  poiName,
  onBack,
}: PoiDetailHeroProps) {
  return (
    <View style={styles.container}>
      <Image
        accessibilityLabel={`Photo of ${poiName}`}
        resizeMode="cover"
        source={{ uri: imageUrl }}
        style={styles.image}
      />

      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={12}
        onPress={onBack}
        style={styles.backButton}
      >
        <Image source={EXPLORE_IMAGES.back} style={styles.backButtonImage} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    position: "relative",
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  backButton: {
    left: 16,
    position: "absolute",
    top: 32,
  },
  backButtonImage: {
    height: 70,
    resizeMode: "contain",
    width: 70,
  },
});
