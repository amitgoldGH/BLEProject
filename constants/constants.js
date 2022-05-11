// BACKEND
export const SPRING_SERVER_ADDRESS = "http://10.100.102.18:8091";
export const SAMPLE_CREATE = "/api/samples";
export const SESSION_CREATE = "/api/sessions";
export const SESSION_GET = "/api/sessions";
export const SESSION_CALCULATE = "/api/sessions/calculate/";
export const USER_CREATE = "/api/users";
export const USER_LOGIN = "/api/users/login";

// MANIKIN
export const DEVICE_ADVERTISED_NAME = "Manikin";
export const DEVICE_MAC_ADDRESS = "18:93:D7:07:D7:1E";
export const PERIPHERAL_SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
export const PERIPHERAL_CHARACTERISTIC_UUID =
  "0000ffe1-0000-1000-8000-00805f9b34fb";
export const BVM_TRANSACTION_ID = "BVM_TRANSACTION_ID";
export const CPR_TRANSACTION_ID = "CPR_TRANSACTION_ID";

// PAIRING
export const TIMEOUT_COUNT = 20;
export const SLEEP_TIME_MS = 1000;
export const NUMBER_OF_DEVICES_TO_SCAN = 10;

// BVM
export const BVM_READ_DELAY = 0.8; // 800 milliseconds
export const PRESSURE_TOP = 1.7;
export const PRESSURE_BOT = 0.9;
// export const PRESSURE_SAMPLE_COUNT = 10;
export const PRESSURE_SAMPLE_COUNT = 8;
export const GOOD_BVM_VOLUME_MESSAGE =
  "(Good: " + PRESSURE_BOT + "-" + PRESSURE_TOP + ")";
// export const GOOD_BVM_RATE_MESSAGE =
//   "(Good: 1 peak in " + BVM_READ_DELAY * PRESSURE_SAMPLE_COUNT + " seconds)";
export const GOOD_BVM_RATE_MESSAGE = "(Good: 1 peak in 6 seconds)";

// CPR
export const GOOD_RATE_TOP = 120;
export const GOOD_RATE_BOTTOM = 70;
export const GOOD_DEPTH_TOP = 6;
export const GOOD_DEPTH_BOT = 4;
export const GOOD_CPR_MESSAGE =
  "(Good: " + GOOD_RATE_BOTTOM + "-" + GOOD_DEPTH_TOP + ")";

// SCREEN TITLES
export const LOGIN_PAGE_TITLE = "Login";
export const REGISTRATION_PAGE_TITLE = "Registration";
export const LANDING_PAGE_TITLE = "Home";
export const SETTING_PAGE_TITLE = "Settings";
export const PAIRING_PAGE_TITLE = "Pairing";
export const CPR_MEASUREMENT_PAGE_TITLE = "CPR Measurement";
export const BVM_MEASUREMENT_PAGE_TITLE = "BVM Measurement";
export const RESULT_PAGE_TITLE = "Exercise Result";

// SHAPES
export const CIRCLE_DIM = 35;
export const CIRCLE_BORDER_RADIUS = 1000;
export const CIRCLE_BORDER_WIDTH = 2;
