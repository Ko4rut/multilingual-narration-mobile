import { version } from "expo/package.json";

import { Image } from "expo-image";

import { StyleSheet } from "react-native";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

import { useTheme } from "@/hooks/use-theme";


export function WebBadge() {

  const theme = useTheme();


  return (

    <ThemedView
      style={styles.container}
    >

      <ThemedText
        color="textSecondary"
        style={[
          theme.typography.caption,
          styles.versionText
        ]}
      >
        v{version}
      </ThemedText>


      <Image

        source={require(
          "@/assets/images/expo-badge.png"
        )}

        style={styles.badgeImage}

      />

    </ThemedView>

  );

}


const styles = StyleSheet.create({

  container: {

    alignItems:"center",

    gap:8,

  },


  versionText: {

    textAlign:"center",

  },


  badgeImage: {

    width:123,

    aspectRatio:123 / 24,

  },

});