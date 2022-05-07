import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  PermissionsAndroid,
} from "react-native";

import { useStore } from "react-redux";

import { connectDevice, setUsername, startScan } from "../actions";

import {
  CPR_MEASUREMENT_PAGE_TITLE,
  BVM_MEASUREMENT_PAGE_TITLE,
  DEVICE_ADVERTISED_NAME,
  DEVICE_MAC_ADDRESS,
  TIMEOUT_COUNT,
  SLEEP_TIME_MS,
} from "../constants/constants";

export async function checkLocationPermission() {
  const locationPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  return locationPermission;
}

export async function requestLocationPermission() {
  const locationPermissionGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  return locationPermissionGranted;
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function PairingPage({ navigation, route }) {
  const store = useStore();
  const [manikinDetectionState, setManikinDetectionState] =
    React.useState(false);

  React.useEffect(() => {
    if (route.params.username != null)
      store.dispatch(setUsername(route.params.username));
  }, [route.params.username, store]);
  const [connectState, setConnectState] = React.useState(false);

  const [statusTextState, setStatusTextState] = React.useState("Idle");

  // SCAN AND CONNECT FUNCTION
  const scanForDevices = async () => {
    // Check if location permissions are allowed
    checkLocationPermission().then((res) => {
      console.log("Location permission ", res);
      if (!res) {
        requestLocationPermission();
      }
    });

    // Start scan for devices
    store.dispatch(startScan());

    // Stay in loop until scanning is complete.
    let currStoreState = store.getState();
    let scanLoopCounter = 0; // Counter to insure not stuck in loop.
    while (
      currStoreState.BLEs.status != "Finished scanning" ||
      currStoreState.BLEs.status == "Scanning"
    ) {
      currStoreState = store.getState();

      // if scan doesn't finish in 20 seconds stop the function.
      scanLoopCounter += 1;
      if (scanLoopCounter >= TIMEOUT_COUNT) {
        setStatusTextState(
          "Failed to finish scan in " + TIMEOUT_COUNT + " seconds, try again."
        );
        return;
      }

      console.log(
        "Waiting in async function for devices to scan, status: ",
        currStoreState.BLEs.status,
        "scan loop counter: ",
        scanLoopCounter
      );
      setStatusTextState("Scanning... time:" + scanLoopCounter);

      await sleep(SLEEP_TIME_MS);
    }

    let wantedDevice; // Declare a variable for the manikin

    // Iterate over all scanned BLE devices to find our manikin
    currStoreState.BLEs.BLEList.forEach((device) => {
      console.log("in for each, device: ", device.name);
      if (
        device.id === DEVICE_MAC_ADDRESS ||
        device.name === DEVICE_ADVERTISED_NAME
      ) {
        // Change Manikin detection status to true and green
        setManikinDetectionState(true);

        // Connect to Manikin
        wantedDevice = store.dispatch(connectDevice(device));
      }
    });

    let connectionLoopCounter = 0; // Counter to insure not stuck in connection loop in case device gets disconnected.

    // Stay in while loop until finishing connection.
    while (
      currStoreState.BLEs.status != "Listening" &&
      currStoreState.BLEs.status != "Connected"
    ) {
      currStoreState = store.getState();

      // If stuck in loop trying to connect to device for over 20 seconds stop the function.
      connectionLoopCounter += 1;
      if (connectionLoopCounter >= TIMEOUT_COUNT) {
        setStatusTextState(
          "Failed to connect in " + TIMEOUT_COUNT + " seconds, try again."
        );
        return;
      }

      console.log(
        "Waiting in async function for device to connect, status: ",
        currStoreState.BLEs.status,
        " connection loop counter: ",
        connectionLoopCounter
      );
      setStatusTextState("Connecting... time:" + connectionLoopCounter);

      await sleep(SLEEP_TIME_MS);
    }
    setConnectState(true);
    setStatusTextState("Connected!");
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(255,255,255, 0.4)" }}>
        <View style={styles.topSegment}>
          <View
            style={[
              manikinDetectionState ? styles.detected : styles.notDetected,
            ]}
          >
            <Text>Manikin Detection Status</Text>
          </View>
          <View style={[connectState ? styles.connected : styles.disconnected]}>
            <Text>Manikin Connection Status</Text>
          </View>
          <View style={{ backgroundColor: "white", borderRadius: 3 }}>
            <Text>State: {statusTextState}</Text>
          </View>
        </View>
        <View style={styles.middleSegment}>
          <TouchableOpacity style={styles.scanButton} onPress={scanForDevices}>
            <Text style={styles.scanButtonText}>Scan and Connect</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSegment}>
          <TouchableOpacity
            style={styles.pairButton}
            onPress={() =>
              navigation.navigate(CPR_MEASUREMENT_PAGE_TITLE, {
                username: route.params.username,
                type: "CPR",
              })
            }
          >
            <Text style={styles.buttonText}>CPR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pairButton}
            onPress={() =>
              navigation.navigate(BVM_MEASUREMENT_PAGE_TITLE, {
                username: route.params.username,
                type: "BVM",
              })
            }
          >
            <Text style={styles.buttonText}>BVM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  detected: {
    backgroundColor: "green",
    borderRadius: 3,
  },

  notDetected: {
    backgroundColor: "grey",
    borderRadius: 3,
  },
  connected: {
    backgroundColor: "green",
    borderRadius: 3,
  },
  disconnected: {
    backgroundColor: "red",
    borderRadius: 3,
  },
  scanButtonText: {
    color: "white",
    fontFamily: "Roboto",
  },
  scanButton: {
    backgroundColor: "black",
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: "20%",
  },
  discoverButton: {
    backgroundColor: "red",
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: "10%",
    top: "20%",
  },
  selectLabel: {
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    top: "10%",
  },

  discoveredDevicesBox: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 3,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    height: "60%",
    width: "75%",
  },
  topSegment: {
    flex: 4,
    flexDirection: "column",
    top: 30,
    // justifyContent: 'space-between',
    // justifyContent: "space-evenly",
    alignItems: "center",
  },
  middleSegment: {
    flex: 5,
    flexDirection: "column",
    // justifyContent: 'space-between',
    // justifyContent: "space-evenly",
    alignItems: "center",
  },
  bottomSegment: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "white",
  },
  pairButton: {
    backgroundColor: "black",
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 3,
    width: "40%",
    height: "45%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },

  goBackButton: {
    backgroundColor: "cyan",
    width: "30%",
    height: "25%",
    alignItems: "center",
    justifyContent: "center",
    right: "10%",
  },
});

export default PairingPage;
