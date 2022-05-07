/* globals fetch */
import { Buffer } from "buffer";
import {
  SPRING_SERVER_ADDRESS,
  SESSION_CREATE,
  SAMPLE_CREATE,
  SESSION_CALCULATE,
  PERIPHERAL_CHARACTERISTIC_UUID,
  PERIPHERAL_SERVICE_UUID,
  NUMBER_OF_DEVICES_TO_SCAN,
} from "../constants/constants";

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

export const setSession = (sessionId) => ({
  type: "SET_SESSION",
  sessionId: sessionId,
});

export const changeMode = (mode) => ({
  type: "CHANGE_MODE",
  mode: mode,
});

export const changeCprValue = (cprValue) => ({
  type: "CHANGE_CPR_VALUE",
  cprValue: cprValue,
});

export const changeBvmValue = (bvmValue) => ({
  type: "CHANGE_BVM_VALUE",
  bvmValue: bvmValue,
});

export const setUsername = (username) => ({
  type: "SET_USERNAME",
  username: username,
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
      if (counter > NUMBER_OF_DEVICES_TO_SCAN) {
        console.log("Finished scanning");
        dispatch(changeStatus("Finished scanning"));
        DeviceManager.stopDeviceScan();
      } else if (counter < NUMBER_OF_DEVICES_TO_SCAN)
        dispatch(changeStatus("Scanning"));

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
              console.log(("SCAN ERROR", error));
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

export const createSession = async (
  username,
  sessionMode,
  setSessionIdFunc
) => {
  let date = new Date();
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sessionId: null,
      username: username,
      type: sessionMode,
      measurementSummary: [],
      creationDate: date,
    }),
  };
  const postFunc = async () => {
    try {
      await fetch(SPRING_SERVER_ADDRESS + SESSION_CREATE, requestOptions).then(
        (response) => {
          // console.log(response.status);
          if (response.status === 200) {
            response.json().then((data) => {
              console.log(
                "in postfunc response 200, type: ",
                data.type,
                "session id: ",
                data.sessionId
              );
              setSessionIdFunc(data.sessionId);
            });
          } else {
            response.json().then((data) => {
              console.log(data.message);
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  postFunc();
};

export const sendSample = (sessionId, measurements) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sampleId: null,
      sessionId: sessionId,
      measurements: measurements,
    }),
  };
  const postFunc = async () => {
    try {
      await fetch(SPRING_SERVER_ADDRESS + SAMPLE_CREATE, requestOptions).then(
        (response) => {
          // console.log(response.status);
          if (response.status === 200) {
            response.json().then((data) => {
              console.log(
                "in send sample response 200, sample Id: ",
                data.sampleId
              );
            });
          } else {
            response.json().then((data) => {
              console.log(data.message);
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  postFunc();
};

export const cancelMonitor = (transaction_id) => {
  return (dispatch, getState, DeviceManager) => {
    console.log("Cancel monitor, ID: ", transaction_id);
    DeviceManager.cancelTransaction(transaction_id);
  };
};

export const calculateSession = (
  sessionId,
  setCurrentSessionDataFunc,
  setStatusTextFunc
) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  const postFunc = async () => {
    try {
      await fetch(
        SPRING_SERVER_ADDRESS + SESSION_CALCULATE + sessionId,
        requestOptions
      ).then((response) => {
        // console.log(response.status);
        if (response.status === 200) {
          response.json().then((data) => {
            console.log(
              "In calculate Session response 200",
              data.type,
              " ",
              data.sessionId
            );
            setCurrentSessionDataFunc({
              session_id: data.sessionId,
              username: data.username,
              session_type: data.type,
              measurements: data.measurementSummary,
              creation_date: data.creation_Date,
            });
          });
        } else {
          response.json().then((data) => {
            console.log(data.message);
            setStatusTextFunc(data.message);
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  postFunc();
};
