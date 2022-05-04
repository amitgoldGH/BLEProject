import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

function SettingsPage(props) {
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.topButtonsView}>
        <TouchableOpacity style={styles.exportButton} onPress={exportOnPress}>
          <Text>Export</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutButton} onPress={aboutOnPress}>
          <Text>About</Text>
        </TouchableOpacity>
      </View>
      {/* 
            <View style={styles.bottomSegmentView}>
                <TouchableOpacity style={styles.goBackButton} onPress={goBackOnPress}>
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </View>
            */}
    </ImageBackground>
  );
}

const exportOnPress = () => {
  console.log("Export press");
};

const aboutOnPress = () => {
  console.log("About press");
};

const goBackOnPress = () => {
  console.log("Go Back press");
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  topButtonsView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  exportButton: {
    //flex: 1,
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 1,
    width: "100%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },

  aboutButton: {
    //flex: 1,
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 1,
    width: "100%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },

  goBackButton: {
    backgroundColor: "white",
    width: "30%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    position: "absolute",
    bottom: "10%",
    left: "10%",
  },

  bottomSegmentView: {
    flex: 4,
    flexDirection: "row-reverse",
  },
});
export default SettingsPage;
