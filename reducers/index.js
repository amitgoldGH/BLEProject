import { combineReducers } from "redux";

import BLEReducer from "./BLEReducer";
// import mainReducer from "./mainReducer";
export default combineReducers({
  BLEs: BLEReducer,
});
