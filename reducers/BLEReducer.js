const INITIAL_STATE = {
  BLEList: [],
  connectedDevice: {},
  status: "disconnected",
  inputString: "",
  mode: "off",
  value: 0,
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
      console.log("Reducer connected device", action);
      return {
        ...state,
        connectedDevice: action.connectedDevice,
        status: action.status,
      };
    case "CHANGE_STATUS":
      console.log("change status:", action.status);
      return { ...state, status: action.status };
    case "CHANGE_MODE":
      console.log("change mode:", action.mode);
      return { ...state, mode: action.mode };
    case "CHANGE_STRING_VALUE":
      console.log("String value changed:  ", action.inputString);
      return { ...state, inputString: action.inputString };
    default:
      return state;
  }
};

export default BLEReducer;
