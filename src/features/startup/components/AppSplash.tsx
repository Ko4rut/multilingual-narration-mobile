import {
  Animated,
  Image,
  StyleSheet,
  View,
} from "react-native";

import { useSplashLoading } from "../hooks/useSplashLoading";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { startupImages } from "@/features/startup/constants/startup-assets";

export default function AppSplash() {

  const theme = useTheme();


  const {
    activeDot,
    loadingText,
    opacity,
  } = useSplashLoading();



  return (

    <ThemedView
      style={styles.container}
    >


      <View
        style={styles.imageContainer}
      >

        <Image
          source={startupImages.splashLogo}
          style={styles.image}
          resizeMode="contain"
        />

      </View>



      <View
        style={styles.content}
      >


        <ThemedText
          style={[
            theme.typography.title,
            styles.title,
          ]}
        >

          Multilingual Automatic{"\n"}
          Narration System

        </ThemedText>



        <ThemedText
          color="textSecondary"
          style={[
            theme.typography.subtitle,
            styles.subtitle,
          ]}
        >

          Stories of every place, spoken in your{"\n"}
          language

        </ThemedText>



        <View
          style={styles.dots}
        >

          {[0, 1, 2].map((dot) => (

            <Animated.View
              key={dot}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    activeDot === dot
                      ? theme.colors.primary
                      : theme.colors.primaryLight,

                  opacity:
                    activeDot === dot
                      ? opacity
                      : 1,
                },
              ]}
            />

          ))}


        </View>



        <ThemedText
          color="textSecondary"
          style={[
            theme.typography.caption,
            styles.loadingText,
          ]}
        >

          {loadingText}

        </ThemedText>


      </View>


    </ThemedView>

  );
}



const styles = StyleSheet.create({

  container: {
    flex: 1,
  },


  imageContainer: {
    height: "60%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },


  image: {
    width: "100%",
    height: "100%",
  },


  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 32,
  },


  title: {
    textAlign: "center",
  },


  subtitle: {
    marginTop: 12,
    textAlign: "center",
  },


  dots: {
    flexDirection: "row",
    marginTop: 65,
    gap: 8,
  },


  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
  },


  loadingText: {
    marginTop: 16,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

});