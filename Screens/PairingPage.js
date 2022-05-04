import React, { useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  PermissionsAndroid,
  FlatList,
} from "react-native";

import {
  BleManager,
  Characteristic,
  Device,
  Service,
} from "react-native-ble-plx";
import { Buffer } from "buffer";
import { useStore, connect } from "react-redux";

import {
  connectDevice,
  startScan,
  changeMode,
  changeStringValue,
} from "../actions";
import { start } from "repl";
import { callbackify } from "util";

// import {
//     BluetoothManager,
//     connect,
//     disconnect,
//     doDeviceScan,
//     stopScanning,
//     useDevicesStore,
//   } from "../Bluetooth/BluetoothManager";

const DEVICE_ADVERTISED_NAME = "Manikin";
const DEVICE_MAC_ADDRESS = "18:93:D7:07:D7:1E";
export const PERIPHERAL_SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
export const PERIPHERAL_CHARACTERISTIC_UUID =
  "0000ffe1-0000-1000-8000-00805f9b34fb";

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

// function onlyUnique(value, index, self) {
//   return self.indexOf(value) === index;
// }

const deviceList = [];
const DATA = [];

function PairingPage({ navigation }) {
  const store = useStore();
  const [manikinDetectionState, setManikinDetectionState] =
    React.useState(false);
  const [connectState, setConnectState] = React.useState(false);

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
    while (
      currStoreState.BLEs.status != "Finished scanning" ||
      currStoreState.BLEs.status == "Scanning"
    ) {
      currStoreState = store.getState();
      console.log(
        "Waiting in async function for devices to scan, status: ",
        currStoreState.BLEs.status
      );
      await sleep(1000);
    }

    // Declare a variable for the manikin
    let wantedDevice;

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
    // Stay in while loop until finishing connection.
    while (
      currStoreState.BLEs.status != "Listening" &&
      currStoreState.BLEs.status != "Connected"
    ) {
      currStoreState = store.getState();
      console.log(
        "Waiting in async function for device to connect, status: ",
        currStoreState.BLEs.status
      );
      await sleep(500);
    }
    setConnectState(true);
  };

  const testFunction = () => {
    const currState = store.getState();
    currState.BLEs.BLEList.forEach((device) => {
      console.log("in for each, device: ", device.name);
      if (!DATA.some((item) => item.id === device.id))
        DATA.push({ name: device.name, id: device.id });
    });
    console.log(DATA);
  };

  const discoverOnPress = async () => {
    checkLocationPermission().then((res) => {
      console.log("Location permission ", res);
      if (!res) {
        requestLocationPermission();
      }
    });

    let currStoreState = store.getState();
    let wantedDevice;
    currStoreState.BLEs.BLEList.forEach((device) => {
      console.log("in for each, device: ", device.name);
      if (
        device.id === DEVICE_MAC_ADDRESS ||
        device.name === DEVICE_ADVERTISED_NAME
      ) {
        setManikinDetectionState(true);
        wantedDevice = store.dispatch(connectDevice(device));
      }
    });
    console.log("Exited for each");

    console.log("In async function before while loop");
    while (
      currStoreState.BLEs.status != "Listening" &&
      currStoreState.BLEs.status != "Connected"
    ) {
      currStoreState = store.getState();
      console.log(
        "Waiting in async function for device to discover, status: ",
        currStoreState.BLEs.status
      );
      await sleep(200);
    }
    setConnectState(true);
    // monitorInput(currStoreState.BLEs.connectedDevice);
  };

  // setCurrentState({ subscription: charSubscription, isSubscribed: true });

  // testFunction();
  //console.log("requested perms");

  //console.log(checkLocationPermission());
  // if (manager.state() === 'PoweredOn') {
  //     scanAndConnect();
  // }

  // console.log("bluetooth state: " + currentBluetoothState);
  // console.log("discover press");
  // scanAndConnect();

  const testSendCPRButton = () => {
    console.log("Send CPR test button, connect state: " + connectState);
    if (connectState == true) {
      // Sends "TEST TEXT" in base64
      // deviceList[0].writeCharacteristicWithResponseForService('FFE0', 'FFE1', 'VEVTVCBURVhU');
      deviceList[0].writeCharacteristicWithResponseForService(
        "FFE0",
        "FFE1",
        Buffer.from("0", "ascii").toString("base64")
      );
    }
  };
  const testSendBVMButton = () => {
    console.log("Send BVM test button, connect state: " + connectState);
    if (connectState == true) {
      // Sends "TEST TEXT" in base64
      // deviceList[0].writeCharacteristicWithResponseForService('FFE0', 'FFE1', 'VEVTVCBURVhU');
      deviceList[0].writeCharacteristicWithResponseForService(
        "FFE0",
        "FFE1",
        Buffer.from("1", "ascii").toString("base64")
      );
    }
  };
  const testSendStopModeButton = () => {
    console.log("Send Stop test button, connect state: " + connectState);
    if (connectState == true) {
      // Sends "TEST TEXT" in base64
      // deviceList[0].writeCharacteristicWithResponseForService('FFE0', 'FFE1', 'VEVTVCBURVhU');
      deviceList[0].writeCharacteristicWithResponseForService(
        "FFE0",
        "FFE1",
        Buffer.from("2", "ascii").toString("base64")
      );
    }
  };

  const testReadButton = async () => {
    console.log("Read test button, connect state: ", connectState);
    if (connectState == true && deviceList[0] != null) {
      // if(!currentState.isSubscribed) {
      //     const charSubscription = deviceList[0].monitorCharacteristicForService(PERIPHERAL_SERVICE_UUID, PERIPHERAL_CHARACTERISTIC_UUID, (error, char) => {
      //                 if (error != null)
      //                     console.log(error);
      //                 console.log("New read!");
      //                 setCurrentState({value: Buffer.from(char.value, 'base64').toString('ascii')})
      //                 // console.log(Buffer.from(char.value, 'base64').toString('ascii'));
      //             });
      //             setCurrentState({subscription : charSubscription, isSubscribed : true})
      // }
      // deviceList[0].readCharacteristicForService('FFE0', 'FFE1').then((characteristics) => {
      //     console.log(characteristics);
      // })
      // const discoveredDevice = await deviceList[0].discoverAllServicesAndCharacteristics();
      // const services = await discoveredDevice.services();
      // services.forEach(async service =>
      //     {
      //     const characteristics = await discoveredDevice.characteristicsForService(service.uuid);
      //     characteristics.forEach(characteristic => {
      //         if (characteristic.uuid.startsWith('0000FFE1')) {
      //             console.log(characteristic);
      //         }})
      //     });
    }
  };

  const testDisconnectButton = () => {
    console.log("store state ", store.getState());
    // console.log("Disconnect button, connect state: " + connectState);
    // console.log("Disconnect button devicelist[0]: ", deviceList[0].name);
    // // if (connectState == true)

    // if (deviceList[0] != null) {
    //   if (currentState.isSubscribed) currentState.subscription.remove();
    //   console.log("Disconnect button myDevice != null");
    //   deviceList[0].cancelConnection();
    //   setConnectState(false);
    //   setCurrentState({
    //     ...currentState,
    //     isSubscribed: false,
    //     subscription: null,
    //   });
    // }
  };
  const testButton = () => {
    // console.log(store.getState());
    // store.dispatch(changeMode("1"));

    store.dispatch(startScan());
    // let currStore = store.getState();
    // currStore.BLEs.BLEList.forEach((device) => {
    //   console.log("in for each, device: ", device.name);
    //   if (
    //     device.id === DEVICE_MAC_ADDRESS ||
    //     device.name === DEVICE_ADVERTISED_NAME
    //   )
    //     setManikinDetectionState(true);
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
          <TouchableOpacity
            style={styles.discoverButton}
            onPress={scanForDevices}
          >
            <Text>Scan and Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.discoverButton}
            onPress={discoverOnPress}
          >
            <Text>Discover nearby devices button</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.discoverButton}
            onPress={testReadButton}
          >
            <Text>test read</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.discoverButton}
            onPress={testDisconnectButton}
          >
            <Text>test disconnect</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.discoverButton} onPress={testButton}>
            <Text>test button</Text>
          </TouchableOpacity>
          <View style={styles.selectLabel}>
            {/* <Text>Select the manikin device and pair</Text> */}
            {/* <Text>Value:</Text> */}
          </View>

          {/* <View style={styles.discoveredDevicesBox}>
                        <Text>placeholder devices</Text>
                    </View> */}
        </View>

        <View style={styles.bottomSegment}>
          <TouchableOpacity
            style={styles.pairButton}
            onPress={() => navigation.navigate("CPR_Measurement")}
          >
            <Text>CPR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pairButton}
            onPress={() => navigation.navigate("BVM_Measurement")}
          >
            <Text>BVM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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

  background: {
    flex: 1,
  },

  topSegment: {
    flex: 4,
    flexDirection: "column",
    // justifyContent: 'space-between',
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  discoverButton: {
    backgroundColor: "cyan",
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

  bottomSegment: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  pairButton: {
    backgroundColor: "green",
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
