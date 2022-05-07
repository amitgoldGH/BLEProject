import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import { calculateSession } from "../actions/index";

function ExerciseResultPage({ route }) {
  const [currentStatusText, setCurrentStatusText] = React.useState("Idle");
  const [wasResultCalculated, setWasResultCalculated] = React.useState(false);
  const [currentSessionData, setCurrentSessionData] = React.useState({
    session_id: "",
    username: "",
    session_type: "",
    measurements: [],
    creation_date: "",
  });

  //   // RUNS ON PAGE LOAD
  //   React.useEffect(() => {
  //     if (wasResultCalculated == false && route.params.sessionId != null) {
  //       //   setCurrentSessionId(route.params.sessionId);
  //       calculateSession(route.params.sessionId, setCurrentSessionData);
  //       setWasResultCalculated(true);
  //     }
  //   }, [wasResultCalculated, route.params.sessionId]);

  const calculatePress = () => {
    if (wasResultCalculated == false && route.params.sessionId != null) {
      calculateSession(
        route.params.sessionId,
        setCurrentSessionData,
        setCurrentStatusText
      );
      setWasResultCalculated(true);
    } else {
      console.log("Previously calculated already.");
    }
  };

  const _renderBvmMeasurements = (measurements) => {
    return (
      <View style={styles.statisticsTextContent}>
        <Text>pressure rate score: {measurements[0]}</Text>
        <Text>opening airway score: {measurements[1]}</Text>
        <Text>mask sealing score: {measurements[2]}</Text>
      </View>
    );
  };

  const _renderCprMeasurements = (measurements) => {
    return (
      <View style={styles.statisticsTextContent}>
        <Text>depth score: {measurements[0]}</Text>
        <Text>cpr rate score: {measurements[1]}</Text>
        <Text>avoiding side touch score: {measurements[2]}</Text>
        <Text>center touch score: {measurements[3]}</Text>
      </View>
    );
  };
  //   };
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.topView}>
        <View style={styles.statisticsTextBox}>
          <Text style={styles.statisticsTextContent}>
            Username: {route.params.username}
          </Text>
          <Text style={styles.statisticsTextContent}>
            Session_ID: {route.params.sessionId}
          </Text>
          <Text style={styles.statisticsTextContent}>
            Type: {route.params.type}
          </Text>
          {route.params.type == "CPR"
            ? _renderCprMeasurements(currentSessionData.measurements)
            : _renderBvmMeasurements(currentSessionData.measurements)}
        </View>
      </View>

      <View style={styles.bottomView}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.calculateButton]}
            onPress={() => {
              console.log("Calculate");
              calculatePress();
            }}
          >
            <Text style={styles.calculateText}>Calculate exercise</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.appState}>
          <Text>State: {currentStatusText}</Text>
        </View>
      </View>
      {/* <View style={styles.statisticsTextBox}>
        <Text>statistics text placeholder</Text>
      </View>

      <View style={styles.bottomButtonView}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            console.log("save button pressed");
          }}
        >
          <Text>Save / Export</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainMenuButton}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <Text>Go back to main menu</Text>
        </TouchableOpacity>
      </View> */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },

  topView: { flex: 3 },
  bottomView: { flex: 1 },
  buttonContainer: {},

  statisticsTextBox: {
    top: "10%",
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 3,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "flex-start",
    borderColor: "black",
    height: "70%",
    width: "95%",
  },
  statisticsTextContent: {
    left: "10%",
  },

  button: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 3,
    width: "50%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  calculateButton: {
    alignSelf: "center",
  },

  appState: {
    backgroundColor: "white",
    top: "30%",
    width: "100%",
    borderRadius: 3,
  },
});
export default ExerciseResultPage;
