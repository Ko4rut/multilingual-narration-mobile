import {
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

import {  IMAGES } from "../constants/images";
type Props = {
  onPress: () => void;
};


export function FocusLocationButton({
  onPress,
}: Props) {

  return (

    <Pressable
      style={styles.button}
      onPress={onPress}
    >

      <Image
        source={IMAGES.targetIcon}
        style={styles.icon}
      />

    </Pressable>

  );
}


const styles = StyleSheet.create({

  button: {

    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: "white",

    justifyContent: "center",
    alignItems: "center",

    elevation: 4,

  },


  icon: {

    width: 28,
    height: 28,

  },

});