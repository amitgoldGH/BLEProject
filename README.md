# BLEProject

Front end for the CPR Manikin college project By Amit Gold.

Link to backend: https://github.com/amitgoldGH/CPR-Backend


![image](https://user-images.githubusercontent.com/17098942/207594304-c7815a72-891b-45cc-9400-3aaa86ca7afe.png)


Requirements:
Node version 16.15.0

Android mobile phone supporting Bluetooth 4.0+

Micro-USB Cable


Installation instructions:

clone this repository

cd to the directory and type "npm install"

in BLEProject/android/gradle.properties set the path to your Java 11 jdk
if your android sdk isn't in your environment variables you'll need to create a local properties file in the android folder and specify that location.

Connect Android phone that supports Bluetooth 4.0 and above via USB

Enable Developer mode -> Enable USB Debugging

Open CMD/Terminal, head to the project's folder

type: "npm run android"
