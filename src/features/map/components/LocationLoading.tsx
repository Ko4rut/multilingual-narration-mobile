import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";


export function LocationLoading() {

  return (
    <View style={styles.container}>

      <ActivityIndicator
        size="large"
      />

      <Text style={styles.text}>
        Đang xác định vị trí của bạn...
      </Text>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F7F2EB",
  },


  text: {
    marginTop: 12,

    fontSize: 16,
  },

});