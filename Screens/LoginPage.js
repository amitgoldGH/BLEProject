/* global fetch */

import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Image,
  Text,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

function LoginPage({ navigation }) {
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

  const login = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        role: "USER",
        password: data.password,
      }),
    };
    const postFunc = async () => {
      try {
        await fetch(
          "http://10.100.102.18:8091/api/users/login",
          requestOptions
        ).then((response) => {
          console.log(response.status);
          if (response.status === 200) {
            response.json().then((data) => {
              Alert.alert("Login Success", "Welcome " + data.username);
              navigation.navigate("Home", { username: data.username });
            });
          } else {
            response.json().then((data) => {
              console.log(data.message);
              Alert.alert("" + data.status, data.message);
            });
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    console.log("Login page - Login button pressed");
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
          title="Login Button"
          style={styles.loginButton}
          onPress={() => {
            navigation.navigate("Home");
            // login();
          }}
        >
          <Text styles={styles.textSign}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          title="Register Button"
          style={styles.registerButton}
          onPress={() => navigation.navigate("Registration")}
        >
          <Text styles={styles.textSign}>Sign up</Text>
        </TouchableOpacity>
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
  loginText: {
    marginLeft: 10,
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

  loginButton: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 10,
    width: "70%",
    height: "45%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  registerButton: {
    backgroundColor: "teal",
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

export default LoginPage;
