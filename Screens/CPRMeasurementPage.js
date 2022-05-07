import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useStore } from "react-redux";
import { Buffer } from "buffer";

import {
  sendChangeMode,
  changeCprValue,
  createSession,
  sendSample,
  cancelMonitor,
} from "../actions";

import {
  GOOD_RATE_TOP,
  GOOD_RATE_BOTTOM,
  GOOD_DEPTH_TOP,
  GOOD_DEPTH_BOT,
  CIRCLE_DIM,
  CIRCLE_BORDER_RADIUS,
  CIRCLE_BORDER_WIDTH,
  PERIPHERAL_SERVICE_UUID,
  PERIPHERAL_CHARACTERISTIC_UUID,
  RESULT_PAGE_TITLE,
  CPR_TRANSACTION_ID,
} from "../constants/constants";

function CPRMeasurementPage({ navigation, route }) {
  // REDUX STORE SHARED ACROSS APP
  const store = useStore();

  // USE STATES

  // BLE INPUT FORMAT: DEPTH[0], RATE[1], LEFT_TOUCH[2], TOP_TOUCH[3], BOTTOM_TOUCH[4], RIGHT_TOUCH[5], CENTER_SENSOR[6]
  const [currentRead, setCurrentRead] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const [currentStatusText, setCurrentStatusText] = React.useState("Idle");
  const [isCenterTouched, setIsCenterTouched] = React.useState(false);
  const [isTopTouched, setIsTopTouched] = React.useState(false);
  const [isLeftTouched, setIsLeftTouched] = React.useState(false);
  const [isRightTouched, setIsRightTouched] = React.useState(false);
  const [isBottomTouched, setIsBottomTouched] = React.useState(false);
  const [currentRate, setCurrentRate] = React.useState(0);
  const [currentDepth, setCurrentDepth] = React.useState(0);

  const [sessionCreated, setSessionCreated] = React.useState(false);
  const [currentSessionId, setCurrentSessionId] = React.useState("");

  // USE EFFECTS

  // On mount create session: // TODO: Get username from navigation route
  React.useEffect(() => {
    if (sessionCreated == false) {
      createSession(
        route.params.username,
        route.params.type,
        setCurrentSessionId
      ).then((response) => {
        // console.log("Response: ", response);
      });
      setSessionCreated(true);
    }
  }, [sessionCreated]);

  // Responsible to make sure BLE monitor is closed when unmounting.
  React.useEffect(() => {
    return () => {
      if (monitorSub != null) {
        // console.log("Unsubbing from monitor sub");
        store.dispatch(cancelMonitor(CPR_TRANSACTION_ID));
        setIsSubscribed(false);
      }
    };
  }, [monitorSub]);

  React.useEffect(() => {
    // Executed any time currentRead is changed.

    let measurements = currentRead.split(",");
    // console.log("In cpr current read use effect, array length: ", arr.length);
    if (measurements.length >= 7) {
      setCurrentDepth(measurements[0]);
      setCurrentRate(measurements[1]);
      measurements[2] == "1" ? setIsLeftTouched(true) : setIsLeftTouched(false);
      measurements[3] == "1" ? setIsTopTouched(true) : setIsTopTouched(false);
      measurements[4] == "1"
        ? setIsBottomTouched(true)
        : setIsBottomTouched(false);
      measurements[5] == "1"
        ? setIsRightTouched(true)
        : setIsRightTouched(false);
      measurements[6].length >= 4
        ? setIsCenterTouched(true)
        : setIsCenterTouched(false);

      // Sending sample block
      if (currentSessionId != "") {
        sendSample(currentSessionId, measurements);
      }
    }

    return () => {
      // Executed when screen is unmounted
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRead]);

  // VARIABLES //
  var monitorSub; // holds subscription to manikin monitor to remove, use monitorSub.remove()
  var storeState = store.getState();

  // FUNCTIONS

  const monitorInput = (callDevice) => {
    // console.log("monitor input, checking if null device: ", callDevice.name);
    if (callDevice && !isSubscribed) {
      console.log("requested device is not null! starting monitor");
      setIsSubscribed(true);
      return callDevice.monitorCharacteristicForService(
        PERIPHERAL_SERVICE_UUID,
        PERIPHERAL_CHARACTERISTIC_UUID,
        (error, char) => {
          if (error != null) console.log(error);

          // TODO: SEND ALL READ INPUT TO SERVER

          console.log("In CPR subscription monitor");
          if (char != null) {
            let convertedRead = Buffer.from(char.value, "base64").toString(
              "ascii"
            );
            // Update store status
            store.dispatch(changeCprValue(convertedRead));
            // Update current page state and refresh (if it's different from previous read.)
            setCurrentRead(convertedRead);
          }
        },
        CPR_TRANSACTION_ID
      );
    }
  };

  const startPress = () => {
    if (
      storeState.BLEs.status == "Connected" ||
      storeState.BLEs.status == "Listeniing"
    ) {
      store.dispatch(sendChangeMode("CPR"));
      setCurrentStatusText("Running...");
      if (!isSubscribed)
        monitorSub = monitorInput(storeState.BLEs.connectedDevice);
    } else {
      setCurrentStatusText("Not connected!");
    }
  };

  // const pausePress = () => {
  //   if (
  //     storeState.BLEs.status == "Connected" ||
  //     storeState.BLEs.status == "Listeniing"
  //   ) {
  //     store.dispatch(cancelMonitor(CPR_TRANSACTION_ID));
  //     setIsSubscribed(false);
  //     store.dispatch(sendChangeMode("off"));
  //     setCurrentStatusText("Paused...");
  //   } else {
  //     setCurrentStatusText("Not connected!");
  //   }
  // };

  const stopPress = () => {
    if (
      storeState.BLEs.status == "Connected" ||
      storeState.BLEs.status == "Listeniing"
    ) {
      store.dispatch(cancelMonitor(CPR_TRANSACTION_ID));
      setIsSubscribed(false);
      store.dispatch(sendChangeMode("off"));
      setCurrentStatusText("Stopped...");
    } else {
      setCurrentStatusText("Not connected!");
    }
  };

  const resultPress = () => {
    // If session ID exists pass it as route var else pass null
    let session_id = currentSessionId != "" ? currentSessionId : null;
    navigation.navigate(RESULT_PAGE_TITLE, {
      sessionId: session_id,
      type: route.params.type,
      username: route.params.username,
    });
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.bottomView}>
        <View style={styles.buttonContainer}>
          <View style={styles.controlButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={startPress}>
              <Text>Start</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button} onPress={pausePress}>
              <Text>Pause</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.button} onPress={stopPress}>
              <Text>Stop</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resultButtonView}>
            <TouchableOpacity
              style={[styles.button, styles.resultButton]}
              onPress={resultPress}
            >
              <Text>Results</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ backgroundColor: "white", borderRadius: 3 }}>
          <Text>State: {currentStatusText}</Text>
        </View>
      </View>
      <View style={styles.manikinImageBackground}>
        <ImageBackground
          style={{ width: "100%", height: "100%" }}
          source={require("../assets/CPRposition.jpg")}
        >
          <View style={styles.rateView}>
            <Text
              style={[
                styles.rateText,
                currentRate >= GOOD_RATE_BOTTOM && currentRate <= GOOD_RATE_TOP
                  ? { color: "green" }
                  : { color: "red" },
              ]}
            >
              CPR Rate: {currentRate}
            </Text>
            <Text
              style={[
                styles.depthText,
                currentDepth >= GOOD_DEPTH_BOT && currentDepth <= GOOD_DEPTH_TOP
                  ? styles.goodColor
                  : styles.badColor,
              ]}
            >
              Depth: {currentDepth}
            </Text>
          </View>
          <View style={styles.circleContainer}>
            <View
              style={[
                styles.centerCircle,
                styles.circleSettings,
                isCenterTouched ? styles.unTouchedCircle : styles.touchedCircle,
              ]}
            ></View>
            <View
              style={[
                styles.topCircle,
                styles.circleSettings,
                isTopTouched ? styles.touchedCircle : styles.unTouchedCircle,
              ]}
            ></View>
            <View
              style={[
                styles.bottomCircle,
                styles.circleSettings,
                isBottomTouched ? styles.touchedCircle : styles.unTouchedCircle,
              ]}
            ></View>
            <View
              style={[
                styles.leftCircle,
                styles.circleSettings,
                isLeftTouched ? styles.touchedCircle : styles.unTouchedCircle,
              ]}
            ></View>
            <View
              style={[
                styles.rightCircle,
                styles.circleSettings,
                isRightTouched ? styles.touchedCircle : styles.unTouchedCircle,
              ]}
            ></View>
          </View>
        </ImageBackground>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column-reverse",
  },

  rateText: {
    fontSize: 18,
  },
  rateView: {
    position: "absolute",
    width: 150,
    height: 100,
    top: 0,
    left: 0,
  },
  depthText: {
    fontSize: 18,
  },

  circleContainer: {
    top: "2%",
  },
  centerCircle: {
    position: "absolute",
    top: 235,
    left: 150,
  },
  topCircle: {
    position: "absolute",
    top: 190,
    left: 148,
  },
  leftCircle: {
    position: "absolute",
    top: 235,
    left: 105,
  },
  rightCircle: {
    position: "absolute",
    top: 244,
    left: 198,
  },
  bottomCircle: {
    position: "absolute",
    top: 283,
    left: 145,
  },
  circleSettings: {
    borderColor: "black",
    borderWidth: CIRCLE_BORDER_WIDTH,
    width: CIRCLE_DIM,
    height: CIRCLE_DIM,
    borderRadius: CIRCLE_BORDER_RADIUS,
  },
  touchedCircle: {
    backgroundColor: "red",
  },
  unTouchedCircle: {
    backgroundColor: "green",
  },
  goodColor: {
    color: "green",
  },
  badColor: {
    color: "red",
  },

  button: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 3,
    width: "50%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    width: "130%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  controlButtonContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },

  resultButtonView: {
    width: "30%",
    justifyContent: "center",
    right: "20%",
  },

  resultButton: {
    width: "100%",
    right: "30%",
  },
  bottomView: {
    //backgroundColor: 'red',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "25%",
  },
  middleView: {
    //backgroundColor: 'blue',
    width: "100%",
    height: "75%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  manikinImageBackground: {
    //backgroundColor: 'blue',
    width: "100%",
    height: "75%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default CPRMeasurementPage;
