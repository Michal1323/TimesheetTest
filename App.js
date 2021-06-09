import React, {useState} from 'react';
import * as Font from 'expo-font';
import { StatusBar } from "react-native";
import AppLoading  from 'expo-app-loading';
import Navigator from './routes/drawer';
import { isAndroid } from "@freakycoder/react-native-helpers";
import AnimatedSplash from "react-native-animated-splash-screen";
import AsyncStorage from "@react-native-community/async-storage";
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const getFonts = () => Font.loadAsync({
'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
'nunito-semi-bold': require('./assets/fonts/Nunito-SemiBold.ttf')
});


export default function App(){
  const [isFirstLanched, setIsFirstLaunched] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem('alreadyLauched').then(value => {
      if (value ==null)
      {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunched(true);
      } else
      {
        setIsFirstLaunched(false);
      }
    });

    StatusBar.setBarStyle("dark-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }
    setTimeout(() => {
      setIsLoaded(true);
    }, 2050);
  }, []);

  if(isFirstLanched == null)
  {
    return null ;
  }
  else if( isFirstLanched == true)
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
      <Navigator/>
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
    
}else {
 return <Login/>
}
} 


