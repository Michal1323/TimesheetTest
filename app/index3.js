import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
// import WebViewBridge from 'react-native-webview-bridge';
const MusicApp = () => {
  //   const runFirst = `window.ReactNativeWebView.postMessage("this is message from web");`;
  const redirectUri = "graph-tutorial://react-native-auth/";

  const onBridgeMessage = (webViewData) => {
    console.log("webViewData:", webViewData);
    let jsonData = JSON.parse(webViewData);

    if (jsonData.success) {
      Alert.alert(jsonData.message);
    }
    console.log("data received", webViewData, jsonData);
    //.. do some react native stuff when data is received
  };

  return (
    <WebView
      source={{
        uri: `'https://login.microsoftonline.com/common/oauth2/v2.0/authorize`,
      }}
    />
  );
};

export default MusicApp;

const styles = StyleSheet.create({});