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
  changeBvmValue,
  createSession,
  sendSample,
  cancelMonitor,
} from "../actions";

import {
  RESULT_PAGE_TITLE,
  PERIPHERAL_SERVICE_UUID,
  PERIPHERAL_CHARACTERISTIC_UUID,
  PRESSURE_TOP,
  PRESSURE_BOT,
  PRESSURE_SAMPLE_COUNT,
  CIRCLE_DIM,
  CIRCLE_BORDER_RADIUS,
  CIRCLE_BORDER_WIDTH,
  GOOD_BVM_RATE_MESSAGE,
  GOOD_BVM_VOLUME_MESSAGE,
  BVM_TRANSACTION_ID,
} from "../constants/constants";

function BVMMeasurementPage({ navigation, route }) {
  const store = useStore();

  // BLE INPUT FORMAT: PRESSURE[0] (sample 10 times to get rate),AIRWAY[1], SEAL[2]
  const [currentRead, setCurrentRead] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const [isPressureRateGood, setIsPressureRateGood] = React.useState(false);
  const [isCurrentPressureGood, setIsCurrentPressureGood] =
    React.useState(false);

  const [isAirwayOpen, setIsAirwayOpen] = React.useState(false);
  const [isMaskSealed, setIsMaskSealed] = React.useState(false);

  const [currentStatusText, setCurrentStatusText] = React.useState("Idle");
  const [wasPressureUpdated, setWasPressureUpdated] = React.useState(false);

  const [sessionCreated, setSessionCreated] = React.useState(false);
  const [currentSessionId, setCurrentSessionId] = React.useState("");

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

  // Unmount clear monitor
  React.useEffect(() => {
    // if (char != null) console.log("currentRead changed: ", char.value);
    // console.log("In BVM useEffect");
    return () => {
      if (monitorSub != null) {
        console.log("Unsubbing from monitor sub");
        monitorSub.remove();
        setIsSubscribed(false);
      }
    };
  }, [monitorSub]);

  //Update indicators on screen
  React.useEffect(() => {
    // Executed any time currentRead is changed.
    // TODO: currentRead.split() then change the touch per the array cells.

    let measurements = currentRead.split(",");
    // console.log("In BVM current read use effect, array length: ", arr.length);
    if (measurements.length >= 3) {
      measurements[0] <= PRESSURE_TOP && measurements[0] >= PRESSURE_BOT
        ? setIsCurrentPressureGood(true)
        : setIsCurrentPressureGood(false);
      measurements[1] == "1" ? setIsAirwayOpen(true) : setIsAirwayOpen(false);
      measurements[2] == "1" ? setIsMaskSealed(true) : setIsMaskSealed(false);
    }

    return () => {
      // Executed when screen is unmounted
    };
  }, [currentRead]);

  // when pressure rate finishes sampling 10 times.
  React.useEffect(() => {
    // Executed any time isPressureGood is changed. to send sample to server
    // CODE HERE TO SEND SAMPLE TO SERVER
    // console.log("was pressure updated useffect!", new Date());
    let state = store.getState();
    if (state.BLEs.status == "Connected") {
      let measurements = [
        isPressureRateGood ? 1 : 0,
        isAirwayOpen ? 1 : 0,
        isMaskSealed ? 1 : 0,
      ];
      if (currentSessionId != "") {
        sendSample(currentSessionId, measurements);
      }
    }

    return () => {
      // Executed when screen is unmounted.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wasPressureUpdated]);

  // VARIABLES //
  var monitorSub; // holds subscription to manikin monitor to remove, use monitorSub.remove()
  var storeState = store.getState();
  var pressure_count = 0;
  var pressure_sample = [];

  // FUNCTIONS

  const monitorInput = (callDevice) => {
    // console.log("monitor input, checking if null device: ", callDevice.name);
    if (callDevice && !isSubscribed) {
      // console.log("requested device is not null! starting monitor");
      setIsSubscribed(true);
      return callDevice.monitorCharacteristicForService(
        PERIPHERAL_SERVICE_UUID,
        PERIPHERAL_CHARACTERISTIC_UUID,
        (error, char) => {
          if (error != null) console.log(error);

          // CODE EXECUTED WHENEVER BLE READ IS DETECTED //
          // console.log("In BVM subscription monitor");

          // TODO: SEND ALL READ INPUT TO SERVER
          // console.log("In BVM monitor input");
          if (char != null) {
            let convertedRead = Buffer.from(char.value, "base64").toString(
              "ascii"
            );
            pressure_count += 1;
            if (pressure_count >= PRESSURE_SAMPLE_COUNT) {
              var peak_count = 0;
              pressure_sample.forEach((sample) => {
                let parsedSample = parseInt(sample);
                if (
                  parsedSample >= PRESSURE_BOT &&
                  parsedSample <= PRESSURE_TOP
                )
                  peak_count += 1;
              });

              if (peak_count == 1) {
                // GOOD RATE
                setIsPressureRateGood(true);
              } else {
                // BAD RATE
                setIsPressureRateGood(false);
              }
              // console.log(
              //   "In monitor, wasPressueUpdated:",
              //   wasPressureUpdated,
              //   " pressure_sample:",
              //   pressure_sample,
              //   "pressure_count:",
              //   pressure_count,
              //   " peak_count:",
              //   peak_count
              // );
              // Initiate useEffect to send sample to server
              setWasPressureUpdated((old) => !old);

              pressure_sample = [];
              pressure_count = 0;
              peak_count = 0;
            } else {
              pressure_sample.push(convertedRead[0]);
            }
            // Update store status
            store.dispatch(changeBvmValue(convertedRead));
            // Update current page state and refresh (if it's different from previous read.)
            setCurrentRead(convertedRead);
          }
        },
        BVM_TRANSACTION_ID
      );
    }
  };

  const startPress = () => {
    if (
      storeState.BLEs.status == "Connected" ||
      storeState.BLEs.status == "Listeniing"
    ) {
      store.dispatch(sendChangeMode("BVM"));
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
  //     store.dispatch(cancelMonitor(BVM_TRANSACTION_ID));
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
      store.dispatch(cancelMonitor(BVM_TRANSACTION_ID));
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
          style={{ width: "100%", height: undefined, aspectRatio: 1 }}
          source={require("../assets/BVM.jpg")}
        >
          <View style={styles.statusView}>
            <Text
              style={[
                styles.statusText,
                isCurrentPressureGood ? styles.goodColor : styles.badColor,
              ]}
            >
              Ventilation volume {GOOD_BVM_VOLUME_MESSAGE}
            </Text>
            <Text
              style={[
                styles.statusText,
                isPressureRateGood ? styles.goodColor : styles.badColor,
              ]}
            >
              Ventilation rate {GOOD_BVM_RATE_MESSAGE}
            </Text>
            <Text
              style={[
                styles.statusText,
                isMaskSealed ? styles.goodColor : styles.badColor,
              ]}
            >
              Mask seal
            </Text>
            <Text
              style={[
                styles.statusText,
                isAirwayOpen ? styles.goodColor : styles.badColor,
              ]}
            >
              Airway: {isAirwayOpen ? "Open" : "Closed"}
            </Text>
          </View>
          <View
            style={[
              styles.airWayCircle,
              styles.circle,
              isAirwayOpen ? styles.touchedCircle : styles.unTouchedCircle,
            ]}
          ></View>
        </ImageBackground>
        {/* <View style={styles.middleView}>
        <View style={styles.statisticsTextBox}>
          <Text>statistics text placeholder : {currentRead}</Text>
  </View> */}
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  statusText: { fontSize: 15 },
  statusView: {
    position: "absolute",
    width: 300,
    height: 100,
    top: 0,
    left: 70,
  },
  airWayCircle: {
    position: "absolute",
    top: 244,
    left: 250,
  },
  circle: {
    borderColor: "black",
    borderWidth: CIRCLE_BORDER_WIDTH,
    width: CIRCLE_DIM,
    height: CIRCLE_DIM,
    borderRadius: CIRCLE_BORDER_RADIUS,
  },
  touchedCircle: {
    backgroundColor: "green",
  },
  unTouchedCircle: {
    backgroundColor: "yellow",
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
    justifyContent: "center",
  },
  manikinImageBackground: {
    //backgroundColor: 'blue',
    width: "100%",
    height: "75%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // alignSelf: "center",
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
});

export default BVMMeasurementPage;
