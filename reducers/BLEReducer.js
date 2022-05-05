const INITIAL_STATE = {
  BLEList: [],
  connectedDevice: {},
  status: "disconnected",
  mode: "off",
  cprValue: "",
  bvmValue: "",
  sessionId: "",
};

const BLEReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_BLE":
      if (
        state.BLEList.some((device) => device.id === action.device.id) ||
        action.device.name === null
      ) {
        return state;
      } else {
        const newBLE = [...state.BLEList, action.device];
        console.log("addable device found! ", action.device.name);
        return {
          ...state,
          BLEList: newBLE,
          status: action.status,
        };
      }
    case "CONNECTED_DEVICE":
      // console.log("Reducer connected device", action);
      console.log("Reducer connected device");
      return {
        ...state,
        connectedDevice: action.connectedDevice,
        status: action.status,
      };
    case "SET_SESSION":
      console.log("session set:", action.sessionId);
      return { ...state, sessionId: action.sessionId };
    case "CHANGE_STATUS":
      console.log("change status:", action.status);
      return { ...state, status: action.status };
    case "CHANGE_MODE":
      console.log("change mode:", action.mode);
      return { ...state, mode: action.mode };
    case "CHANGE_CPR_VALUE":
      console.log("CPR value changed", action.cprValue);
      return { ...state, cprValue: action.cprValue };
    case "CHANGE_BVM_VALUE":
      console.log("BVM value changed", action.bvmValue);
      return { ...state, bvmValue: action.bvmValue };
    default:
      return state;
  }
};

export default BLEReducer;
