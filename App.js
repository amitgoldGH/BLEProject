/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import type { Node } from "react";
// import { StyleSheet, Text, View } from "react-native";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginPage from "./Screens/LoginPage";
import RegistrationPage from "./Screens/RegistrationPage";
import LandingPage from "./Screens/LandingPage";
import PairingPage from "./Screens/PairingPage";
import SettingsPage from "./Screens/SettingsPage";
import BVMMeasurementPage from "./Screens/BVMMeasurementPage";
import CPRMeasurementPage from "./Screens/CPRMeasurementPage";
import ExerciseResultPage from "./Screens/ExerciseResultPage";

import {
  LOGIN_PAGE_TITLE,
  REGISTRATION_PAGE_TITLE,
  SETTING_PAGE_TITLE,
  LANDING_PAGE_TITLE,
  PAIRING_PAGE_TITLE,
  RESULT_PAGE_TITLE,
  BVM_MEASUREMENT_PAGE_TITLE,
  CPR_MEASUREMENT_PAGE_TITLE,
} from "./constants/constants";
import { BleManager } from "react-native-ble-plx";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["new NativeEventEmitter"]); // Ignore log notification by message

// import { render } from "react-native/Libraries/Renderer/implementations/ReactNativeRenderer-dev";

const DeviceManager = new BleManager();

const Stack = createNativeStackNavigator();

const store = createStore(
  rootReducer,
  applyMiddleware(thunk.withExtraArgument(DeviceManager))
);
// store.subscribe(render);

const App: () => Node = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={LOGIN_PAGE_TITLE}>
          <Stack.Screen name={LOGIN_PAGE_TITLE} component={LoginPage} />
          <Stack.Screen
            name={REGISTRATION_PAGE_TITLE}
            component={RegistrationPage}
          />
          <Stack.Screen name={LANDING_PAGE_TITLE} component={LandingPage} />
          <Stack.Screen name={SETTING_PAGE_TITLE} component={SettingsPage} />
          <Stack.Screen name={PAIRING_PAGE_TITLE} component={PairingPage} />
          <Stack.Screen
            name={CPR_MEASUREMENT_PAGE_TITLE}
            component={CPRMeasurementPage}
          />
          <Stack.Screen
            name={BVM_MEASUREMENT_PAGE_TITLE}
            component={BVMMeasurementPage}
          />
          <Stack.Screen
            name={RESULT_PAGE_TITLE}
            component={ExerciseResultPage}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

// const styles = StyleSheet.create({});

export default App;
