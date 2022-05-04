/* global fetch:false */

import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Image,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

function RegistrationPage() {
  const [data, setData] = React.useState({
    username: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
  });

  const textInputChange = (val, type) => {
    if (type == "username") {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
      });
    } else if (type == "password") {
      setData({
        ...data,
        password: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        check_textInputChange: false,
      });
    }
  };

  const signUpPress = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // body: JSON.stringify({ username: data.username, role: 'USER', password: 'reactTestPassword' })
      body: JSON.stringify({
        username: data.username,
        role: "USER",
        password: data.password,
      }),
    };
    const postFunc = async () => {
      try {
        await fetch("http://10.100.102.18:8091/api/users", requestOptions).then(
          (response) => {
            console.log(response.status);
            if (response.status === 200) {
              response.json().then((data) => {
                Alert.alert("User created at : " + data.username);
              });
            } else {
              response.json().then((data) => {
                console.log(data.message);
                Alert.alert("" + data.status, data.message);
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
      }
    };

    console.log("Registration page sign up button pressed");
    postFunc();
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.topView}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
      </View>

      <View style={styles.middleView}>
        <View style={styles.loginBox}>
          <Text style={styles.loginText}>Username</Text>
          <View>
            {/* <TextInput placeholder='Your Username' styles={styles.textInput}></TextInput> */}
            <TextInput
              id="usernameInput"
              placeholder="Your Username"
              styles={styles.textInput}
              onChangeText={(newText) => textInputChange(newText, "username")}
            ></TextInput>
          </View>
        </View>
        <View style={styles.loginBox}>
          <Text style={styles.loginText}>Password</Text>
          <View>
            <TextInput
              id="passwordInput"
              secureTextEntry={true}
              placeholder="Your Password"
              styles={styles.textInput}
              onChangeText={(newText) => textInputChange(newText, "password")}
            ></TextInput>
          </View>
        </View>
      </View>

      <View style={styles.bottomView}>
        <TouchableOpacity
          title="Register Button"
          style={styles.registerButton}
          onPress={() => {
            signUpPress();
            // navigation.navigate('Login');
          }}
        >
          <Text styles={styles.textSign}>Sign up</Text>
        </TouchableOpacity>

        {/* <PostRequestExample/> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  topView: {
    //backgroundColor: 'red',
    flexDirection: "column",
    width: "100%",
    height: "25%",
  },
  logo: {
    alignSelf: "baseline",
    height: "100%",
    width: "35%",
    left: 20,
    top: 10,
  },

  middleView: {
    //backgroundColor: 'blue',
    width: "100%",
    height: "50%",
    justifyContent: "center",
  },

  loginBox: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 3,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "baseline",
    borderColor: "black",
    height: "25%",
    width: "90%",
  },
  bottomView: {
    //backgroundColor: 'green',
    width: "100%",
    height: "20%",
    justifyContent: "center",
  },

  textInput: {
    flex: 1,
    marginleft: 50,
    // paddingLeft: 10,
    color: "#05375a",
  },
  registerButton: {
    backgroundColor: "green",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 10,
    width: "70%",
    height: "45%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RegistrationPage;
