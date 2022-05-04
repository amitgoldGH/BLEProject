import React, { useEffect } from "react";
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
  PERIPHERAL_SERVICE_UUID,
  PERIPHERAL_CHARACTERISTIC_UUID,
} from "./PairingPage";
import { changeMode, changeStringValue, sendChangeMode } from "../actions";

function CPRMeasurementPage() {
  const store = useStore();

  const [currentRead, setCurrentRead] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  React.useEffect(() => {
    // if (char != null) console.log("currentRead changed: ", char.value);
    return () => {
      if (monitorSub != null) monitorSub.remove();
    };
  }, [monitorSub]);

  var char; // updated via monitor with new value from manikin
  var monitorSub; // holds subscription to manikin monitor to remove, use monitorSub.remove()

  const monitorInput = (callDevice) => {
    console.log("monitor input, checking if null device: ", callDevice.name);
    if (callDevice && !isSubscribed) {
      console.log("requested device is not null! starting monitor");
      setIsSubscribed(true);
      return callDevice.monitorCharacteristicForService(
        PERIPHERAL_SERVICE_UUID,
        PERIPHERAL_CHARACTERISTIC_UUID,
        (error, char) => {
          if (error != null) console.log(error);

          setCurrentRead(Buffer.from(char.value, "base64").toString("ascii"));

          //   console.log("New read!");
          //   store.dispatch(
          //     changeStringValue(
          //       Buffer.from(char.value, "base64").toString("ascii")
          //     )
          //   );
        }
      );
    }
  };
  let storeState = store.getState();

  const startPress = () => {
    store.dispatch(sendChangeMode("CPR"));
    if (
      (storeState.BLEs.status == "Connected" ||
        storeState.BLEs.status == "Listeniing") &&
      !isSubscribed
    ) {
      monitorSub = monitorInput(storeState.BLEs.connectedDevice);
    }
  };

  const stopPress = () => {
    store.dispatch(sendChangeMode("off"));
    if (monitorSub) {
      monitorSub.remove();
      setIsSubscribed(false);
    }
  };
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.topView}>
        <TouchableOpacity style={styles.button} onPress={startPress}>
          <Text>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stopPress}>
          <Text>Stop</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.middleView}>
        <View style={styles.statisticsTextBox}>
          <Text>statistics text placeholder : {currentRead}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  button: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 3,
    width: "70%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  topView: {
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
});

export default CPRMeasurementPage;
