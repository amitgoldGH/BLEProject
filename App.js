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
// import MeasurementPage from "./Screens/MeasurementPage";
import BVMMeasurementPage from "./Screens/BVMMeasurementPage";
import CPRMeasurementPage from "./Screens/CPRMeasurementPage";
import { BleManager } from "react-native-ble-plx";
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
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Registration" component={RegistrationPage} />
          <Stack.Screen name="Home" component={LandingPage} />
          <Stack.Screen name="Settings" component={SettingsPage} />
          <Stack.Screen name="Pairing" component={PairingPage} />
          <Stack.Screen name="CPR_Measurement" component={CPRMeasurementPage} />
          <Stack.Screen name="BVM_Measurement" component={BVMMeasurementPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

// const styles = StyleSheet.create({});

export default App;
