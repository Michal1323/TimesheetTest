<<<<<<< HEAD
import React, {useState} from 'react';
import * as Font from 'expo-font';
import { StatusBar } from "react-native";
import AppLoading  from 'expo-app-loading';
import OBNavigator from './routes/drawer';
import Navigator from './routes/drawer2';
import { isAndroid } from "@freakycoder/react-native-helpers";
import AnimatedSplash from "react-native-animated-splash-screen";
import AsyncStorage from "@react-native-community/async-storage";
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const getFonts = () => Font.loadAsync({
'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
'nunito-semi-bold': require('./assets/fonts/Nunito-SemiBold.ttf')
});
=======
import React, {useEffect, useState} from 'react';
import * as Font from 'expo-font';
import { StatusBar, LogBox, Dimensions } from "react-native";
import AppLoading  from 'expo-app-loading';
import Navigator from './routes/drawer';
import Navigator_two from './routes/drawer_two';
import { isAndroid } from "@freakycoder/react-native-helpers";
import AnimatedSplash from "react-native-animated-splash-screen";
import checkIfFirstLaunch  from './routes/checkIfFirstLaunch';
import AsyncStorage from "@react-native-community/async-storage";

>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc

LogBox.ignoreAllLogs();

<<<<<<< HEAD
export default function App(){
  const [isFirstLanched, setIsFirstLaunched] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
=======
const getFonts = () => Font.loadAsync({
'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
'nunito-semi-bold': require('./assets/fonts/Nunito-SemiBold.ttf')
});
>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc

  React.useEffect(() => {
    AsyncStorage.getItem('alreadyLauched').then(value => {
      if (value ==null)
      {
        setIsFirstLaunched(false);
        AsyncStorage.setItem('alreadyLaunched', 'true');
      } else
      {
        setIsFirstLaunched(true);
      }
    });

<<<<<<< HEAD
    StatusBar.setBarStyle("dark-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }
    setTimeout(() => {
    
      setIsLoaded(true);
    }, 2050);
  }, []);

  if( isFirstLanched == false)
  {
  if(fontsLoaded)
  {
    return (
      <AnimatedSplash
      logoWidth={100}
      logoHeight={100}
      logoImage={require("./assets/O.png")}
      isLoaded={isLoaded}
      backgroundColor={null}
      imageBackgroundResizeMode="cover"
    >
    
      <OBNavigator/>
      </AnimatedSplash>
    );
  }

 else {
   return(
    
<AppLoading
startAsync={getFonts}
onFinish={()=> setFontsLoaded(true)}
onError={console.warn}
/>
   )

 }
    
}
else {
 return <Navigator/>
}
} 
=======
export default function App(){
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if(value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

    React.useEffect(() => {
      StatusBar.setBarStyle("dark-content");
      if (isAndroid) {
        StatusBar.setBackgroundColor("rgba(0,0,0,0)");
        StatusBar.setTranslucent(true);
      }
      setTimeout(() => {
        setIsLoaded(true);
      }, 2050);
    }, []);

  if(isFirstLaunch === null) {
    return null;
  } else if ( isFirstLaunch === true) {
    if(fontsLoaded)
    {
      return (
        <AnimatedSplash
        logoWidth={100}
        logoHeight={100}
        logoImage={require("./assets/O.png")}
        isLoaded={isLoaded}
        backgroundColor={null}
        imageBackgroundResizeMode="cover"
      >
        <Navigator/>
        </AnimatedSplash>
      );
    }
>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc

  else {
    return(
      
  <AppLoading
  startAsync={getFonts}
  onFinish={()=> setFontsLoaded(true)}
  onError={console.warn}
  />
    )}}
    else {
      if(fontsLoaded)
    {
      return (
        <AnimatedSplash
        logoWidth={100}
        logoHeight={100}
        logoImage={require("./assets/O.png")}
        isLoaded={isLoaded}
        backgroundColor={null}
        imageBackgroundResizeMode="cover"
      >
        <Navigator_two />
        </AnimatedSplash>
      );
    }

<<<<<<< HEAD
=======
  else {
    return(
      
  <AppLoading
  startAsync={getFonts}
  onFinish={()=> setFontsLoaded(true)}
  onError={console.warn}
  />
    )}
    }
}
>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc
