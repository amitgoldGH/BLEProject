import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Image,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SETTING_PAGE_TITLE, PAIRING_PAGE_TITLE } from "../constants/constants";

function LandingPage({ navigation, route }) {
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.topView}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <TouchableOpacity
          title="Settings button"
          style={styles.settingsButton}
          onPress={() => {
            console.log("Landing page");
            navigation.navigate(SETTING_PAGE_TITLE);
          }}
        >
          <Image
            style={styles.cogIcon}
            source={require("../assets/cogwheel.png")}
          />
          <Text style={styles.settingFont}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.middleView}>
        {/* <View style={styles.statisticsTextBox}>
          <Text>statistics text placeholder</Text>
        </View> */}
      </View>

      <View style={styles.bottomView}>
        <TouchableOpacity
          title="Pair button"
          style={styles.pairButton}
          onPress={() =>
            navigation.navigate(PAIRING_PAGE_TITLE, {
              username: route.params.username,
            })
          }
        >
          <Text>Pair and Start!</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  topView: {
    //backgroundColor: 'red',
    flexDirection: "column",
    width: "100%",
    height: "25%",
  },
  settingFont: {
    flex: 1.5,
  },
  logo: {
    alignSelf: "baseline",
    height: "100%",
    width: "35%",
    left: -10,
    top: 0,
  },
  cogIcon: {
    height: "100%",
    width: "50%",
    alignSelf: "flex-start",
    flex: 1,
  },
  settingsButton: {
    backgroundColor: "teal",
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 3,
    width: "30%",
    height: "30%",
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    right: 40,
    bottom: 100,
  },

  middleView: {
    //backgroundColor: 'blue',
    width: "100%",
    height: "50%",
    justifyContent: "center",
  },

  statisticsTextBox: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 3,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    height: "70%",
    width: "90%",
  },

  bottomView: {
    //backgroundColor: 'green',
    width: "100%",
    height: "25%",
    justifyContent: "center",
  },

  pairButton: {
    backgroundColor: "green",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 10,
    width: "70%",
    height: "45%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
});

export default LandingPage;
