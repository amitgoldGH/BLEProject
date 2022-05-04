import { Buffer } from "buffer";
import {
  PERIPHERAL_CHARACTERISTIC_UUID,
  PERIPHERAL_SERVICE_UUID,
} from "../Screens/PairingPage";

export const addBLE = (device) => ({
  type: "ADD_BLE",
  device,
});

export const connectedDevice = (device) => ({
  type: "CONNECTED_DEVICE",
  connectedDevice: device,
  status: "Connected",
});

export const changeStatus = (status) => ({
  type: "CHANGE_STATUS",
  status: status,
});

export const changeMode = (mode) => ({
  type: "CHANGE_MODE",
  mode: mode,
});

export const changeStringValue = (inputString) => ({
  type: "CHANGE_STRING_VALUE",
  inputString: inputString,
});

//some thunks to control the BLE Device

export const startScan = () => {
  return (dispatch, getState, DeviceManager) => {
    // you can use Device Manager here
    // console.log("thunk startScan: ", DeviceManager);
    console.log("thunk startScan");
    const subscription = DeviceManager.onStateChange((state) => {
      if (state === "PoweredOn") {
        dispatch(scan());
        subscription.remove();
      }
    }, true);
  };
};

export const scan = () => {
  return (dispatch, getState, DeviceManager) => {
    //console.log("thunk Scan: ", DeviceManager);
    let counter = 0;
    DeviceManager.startDeviceScan(null, null, (error, device) => {
      //this.setState({"status":"Scanning..."});
      // console.log("scanning...");
      counter += 1;
      if (counter > 10) {
        console.log("Finished scanning");
        dispatch(changeStatus("Finished scanning"));
        DeviceManager.stopDeviceScan();
      } else if (counter < 10) dispatch(changeStatus("Scanning"));

      if (error) {
        console.log(error);
        console.log("Error during scan");
        DeviceManager.stopDeviceScan();
      }
      if (device !== null) {
        console.log(device.name);
        dispatch(addBLE(device));
      }
    });
  };
};

export const connectDevice = (device) => {
  return (dispatch, getState, DeviceManager) => {
    //console.log('thunk connectDevice',device['BLE']);

    dispatch(changeStatus("Connecting"));
    DeviceManager.stopDeviceScan();
    // this.device = device['BLE'];
    device.isConnected().then((isConnected) => {
      if (!isConnected) {
        device
          .connect()
          .then((device) => {
            dispatch(changeStatus("Discovering"));
            let characteristics =
              device.discoverAllServicesAndCharacteristics();
            console.log("characteristics:", characteristics);
            return characteristics;
          })
          .then((device) => {
            dispatch(changeStatus("Setting Notifications"));
            return device;
          })
          .then(
            (device) => {
              dispatch(changeStatus("Listening"));
              dispatch(connectedDevice(device));
              return device;
            },
            (error) => {
              console.log(this._logError("SCAN", error));
              //return null;
            }
          );
      } else console.log("Device is already connected, cancelling");
    });
  };
};

export const sendChangeMode = (newMode) => {
  return (dispatch, getState, DeviceManager) => {
    const state = getState();
    console.log("Sending change mode command");
    console.log("State: ", state);
    try {
      if (
        state.BLEs.status == "Connected" ||
        state.BLEs.status == "Listening"
      ) {
        switch (newMode) {
          case "CPR":
            console.log("sendChangeMode mode:CPR");
            state.BLEs.connectedDevice.writeCharacteristicWithResponseForService(
              PERIPHERAL_SERVICE_UUID,
              PERIPHERAL_CHARACTERISTIC_UUID,
              Buffer.from("0", "ascii").toString("base64")
            );
            dispatch(changeMode("CPR"));
            break;
          case "BVM":
            console.log("sendChangeMode mode:BVM");
            state.BLEs.connectedDevice.writeCharacteristicWithResponseForService(
              PERIPHERAL_SERVICE_UUID,
              PERIPHERAL_CHARACTERISTIC_UUID,
              Buffer.from("1", "ascii").toString("base64")
            );
            dispatch(changeMode("BVM"));
            break;
          default:
            console.log("sendChangeMode default");
            state.BLEs.connectedDevice.writeCharacteristicWithResponseForService(
              PERIPHERAL_SERVICE_UUID,
              PERIPHERAL_CHARACTERISTIC_UUID,
              Buffer.from("2", "ascii").toString("base64")
            );
            dispatch(changeMode("off"));
            break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
};
