import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import { useStore } from "react-redux";
import { Buffer } from "buffer";
import {
  PERIPHERAL_CHARACTERISTIC_UUID,
  PERIPHERAL_SERVICE_UUID,
} from "./PairingPage";

// import SpeedoMeterPage from './SpeedoMeterPage';
// import RNSpeedometer from 'react-native-speedometer'

function MeasurementPage({ navigation }) {
  const store = useStore();
  // let started = false;
  const [started, setStartedvalue] = useState(false);
  //   const [spdvalue, setSpdvalue] = React.useState(50);

  const startOnPress = () => {
    // started = true;
    // setSpdvalue(14);
    setStartedvalue(true);
    // setSpdvalue(Math.floor(Math.random() * 100) + 1); // TODO: Change to the value read from the sensors
    console.log(`measure start pressed (before: ${started}), now set to true`);
  };
  const stopOnPress = () => {
    // if (started)
    //     navigation.navigate('Result');
    console.log(`measure stop pressed (before: ${started}), now set to false`);
    setStartedvalue(false);
  };

  const resultOnPress = () => {
    setStartedvalue(false);
    navigation.navigate("Result");
    console.log("Result button pressed");
  };

  const startCPRPress = () => {
    const currStore = store.getState();
    currStore.BLEs.connectedDevice.writeCharacteristicWithResponseForService(
      PERIPHERAL_SERVICE_UUID,
      PERIPHERAL_CHARACTERISTIC_UUID,
      Buffer.from("0", "ascii").toString("base64")
    );
  };
  const startBVMPress = () => {
    const currStore = store.getState();
    currStore.BLEs.connectedDevice.writeCharacteristicWithResponseForService(
      PERIPHERAL_SERVICE_UUID,
      PERIPHERAL_CHARACTERISTIC_UUID,
      Buffer.from("1", "ascii").toString("base64")
    );
  };
  const stopManikinPress = () => {
    const currStore = store.getState();
    currStore.BLEs.connectedDevice.writeCharacteristicWithResponseForService(
      PERIPHERAL_SERVICE_UUID,
      PERIPHERAL_CHARACTERISTIC_UUID,
      Buffer.from("2", "ascii").toString("base64")
    );
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.cprMeterView}>
        {/* <Image style={{width:'40%', height: '40%'}} source={require('../assets/meterplaceholder.png')}/> */}
        <ImageBackground
          style={styles.cprMeterBackground}
          source={require("../assets/meterplaceholderwhite.png")}
        >
          {/* <SpeedoMeterPage value={spdvalue} />     */}
        </ImageBackground>
      </View>

      <View style={styles.chestTrackerView}>
        <Image
          style={{ width: "40%", height: "40%" }}
          source={require("../assets/chestPlaceholder.png")}
        />
        <Text style={{ backgroundColor: "white" }}>
          Duration timer placeholder
        </Text>
      </View>

      <View style={styles.bottomButtonView}>
        <TouchableOpacity style={styles.startButton} onPress={startBVMPress}>
          <Text>accessPress</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.startButton} onPress={() => {started = true;setSpdvalue(50); console.log(`measure start pressed ${started}`)}}> */}
        <TouchableOpacity style={styles.startButton} onPress={startOnPress}>
          <Text>Start</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.stopButton} onPress={() => {if (started === true) navigation.navigate('Result'); console.log(`measure stop pressed ${started}`)}}> */}
        <TouchableOpacity style={styles.stopButton} onPress={stopManikinPress}>
          <Text>Stop</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.stopButton} onPress={() => {if (started === true) navigation.navigate('Result'); console.log(`measure stop pressed ${started}`)}}> */}

        <TouchableOpacity style={styles.resultButton} onPress={resultOnPress}>
          <Text>Results</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// const labelArray = [
//   {
//     name: "Too Slow",
//     labelColor: "#808080",
//     activeBarColor: "#808080",
//   },
//   {
//     name: "All Good",
//     labelColor: "#BFFF00",
//     activeBarColor: "#BFFF00",
//   },
//   {
//     name: "Spot on",
//     labelColor: "#00FF00",
//     activeBarColor: "#00FF00",
//   },
//   {
//     name: "Still Good",
//     labelColor: "#BFFF00",
//     activeBarColor: "#BFFF00",
//   },
//   {
//     name: "Too Fast!",
//     labelColor: "#FF0000",
//     activeBarColor: "#FF0000",
//   },
// ];

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column-reverse",
  },

  cprMeterView: {
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    width: "150%",
    height: "100%",
    top: "20%",
  },

  cprMeterBackground: {
    // width: '55%',
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },

  chestTrackerView: {
    width: "60%",
    height: "50%",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    top: "45%",
    left: "20%",
  },

  bottomButtonView: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "10%",
    top: "5%",
  },

  startButton: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 3,
    width: "70%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },

  stopButton: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 3,
    width: "70%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },

  resultButton: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 3,
    width: "70%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default MeasurementPage;

{
  /* <RNSpeedometer style={{flex:1}} value={50} size={250} labels={labelArray} /> */
}
