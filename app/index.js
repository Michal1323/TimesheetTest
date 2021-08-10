import React, { Component } from 'react';
import { View, Text, StyleSheet,  Dimensions, Button } from 'react-native';
import Svg,{Image, Circle, ClipPath} from 'react-native-svg'
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import AsyncStorage from "@react-native-community/async-storage";
import * as AppAuth from 'expo-app-auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'expo';
import Constants from 'expo-constants';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const { width, height } = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}
const redirectUrl = 'graph-tutorial://react-native-auth/';

// const Config = {
//   issuer: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize/<5bf7a77a-a567-4887-a8ca-c07b522f3498>/v2.0',
//   scopes: ['openid', 'offline_access','User.Read','MailboxSettings.Read','Calendars.ReadWrite'],
//   clientId: '5bf7a77a-a567-4887-a8ca-c07b522f3498',
//   redirectUrl: redirectUrl,
//   additionalParameters: { prompt: 'select_account' },
//   serviceConfiguration: {
//     authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
//     tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
//   },
// };



const StorageKey = 'authState';

class MusicApp extends Component {
  constructor(props) {
    super(props);

    this.buttonOpacity = new Value(1);

    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            )
          ])
      }
    ]);

    this.onCloseState = event([
        {
          nativeEvent: ({ state }) =>
            block([
              cond(
                eq(state, State.END),
                set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
              )
            ])
        }
      ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 3 - 50, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.textInputZindex= interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1,-1],
        extrapolate: Extrapolate.CLAMP
      });

      this.textInputY = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [0, 100],
        extrapolate: Extrapolate.CLAMP
      });

      this.textInputOpacity = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: Extrapolate.CLAMP
      });

      this.rotateCross = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [180, 360],
        extrapolate: Extrapolate.CLAMP
      });
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'flex-end'
        }}
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{ translateY: this.bgY }]
          }}
        >
        <Svg height={height + 50} width={width}>
      <ClipPath id='clip'>
          <Circle r={height + 50} cx={width / 2}/>
      </ClipPath>
          <Image
            href={require('../assets/van.jpg')}
            width={width}
            height={height + 50}
            preserveAspectRatio= 'xMidYMid slice'
            clipPath="url(#clip)"
          />
          </Svg>
        </Animated.View>
        <View style={{ height: height / 3, justifyContent: 'center' }}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: this.buttonOpacity,
                transform: [{ translateY: this.buttonY }]
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
            </Animated.View>
          </TapGestureHandler>
          <Animated.View
            style={{
              ...styles.button,
              backgroundColor: '#d90909',
              opacity: this.buttonOpacity,
              transform: [{ translateY: this.buttonY }]
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
              FORGOT PASSWORD?
            </Text>
          </Animated.View>
          <Animated.View style={{
              zIndex:this.textInputZindex, 
              opacity: this.textInputOpacity,
              transform: [{translateY:this.textInputY}],
              height:height/3,
          ...StyleSheet.absoluteFill,top:null,justifyContent:'center'}
          }>
          
          <TapGestureHandler onHandlerStateChange={this.onCloseState}>
              <Animated.View style = {styles.closeButton}>
                 <Animated.Text style={{fontSize:15, transform: [
                 {rotate: concat(this.rotateCross, 'deg')}]}}>X</Animated.Text>
              </Animated.View>
          </TapGestureHandler>

          <TextInput 
          placeholder='LOGIN'
              style={styles.textInput}
             // defaultValue={login}
              placeholderTextColor='black'
          />

          <TextInput  
              placeholder='PASSWORD'
              style={styles.textInput}
             // defaultValue={password}
              placeholderTextColor='black'
              />

              <Animated.View style={styles.button}>
              <Text style={{fontSize:20,fontWeight:'bold'}} onPress={this._handleOpenWithWebBrowser}>SIGN IN</Text>
              </Animated.View>

          </Animated.View>
        </View>
      </View>
    );
  }
}
_cacheAuthAsync = async (authState) => {
  return AsyncStorage.setItem(StorageKey, JSON.stringify(authState));
}

_handleOpenWithWebBrowser = () => {
  WebBrowser.openBrowserAsync('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
};


_signInAsync = async () => {
try{
  const authState = await AppAuth.authAsync({
    issuer: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    scopes: ['openid'],
    clientId: '5bf7a77a-a567-4887-a8ca-c07b522f3498',
    redirectUrl: redirectUrl,
    
});
  console.log(authState); // Never gets here...
  this.props.navigation.navigate('Home');
}
catch{
  alert('Null n Void');
  }
};


export default withNavigation(MusicApp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#ffffff',
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset: {width: 2, height:2},  
    shadowColor: 'black' ,
    shadowOpacity: 0.2
  },
  closeButton:{
    height:40,
    width:40,
    backgroundColor:'white',
    borderRadius:20,
    alignItems: 'center',
    justifyContent: 'center',
    position:'absolute',
    top: -20,
    left: width / 2 - 20
   },

  textInput:{
   height:50,
   borderRadius:25,
   borderWidth:0.5,
   marginHorizontal:20,
   paddingLeft:10,
   marginVertical:5,
   borderColor:'rgba(0,0,0,0.2)',
   backgroundColor: '#fcfdff'
  }
});


