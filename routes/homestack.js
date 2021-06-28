import React from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { createStackNavigator } from 'react-navigation-stack';

import Login from '../screens/login';
import Home from '../screens/Home';
import Hour from '../screens/Hour';
import EditSheet from '../screens/EditSheet';
import ViewEntry from '../screens/ViewEntry';
import ListView from '../screens/ListView';
import Header from '../components/Header';
import Onboarding from '../screens/Onboarding';
import Test from '../screens/Tester';

const HAS_LAUNCHED = 'hasLaunched';

const setAppLaunched = () => {
  AsyncStorage.getItem("alreadyLaunched").then(value => {
    if(value == null){
      AsyncStorage.setItem(HAS_LAUNCHED, 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
    }
    else{
      return false;
    }})
}





const screens = {
  Onboarding: {
    screen: Onboarding,
      navigationOptions:
      {
        title: null,
        header: () => null
      }
},
  Login: {
    screen: Login,
    navigationOptions:
    {
      title: null,
      header: () => null
    }
},

ListView:
    {
      screen: Login,
      navigationOptions:
      {
        header: () => null
      }
},

  Home:
  {
      screen: Home,
      navigationOptions:({ navigation }) => {
      return {
        header: () => null
            }
      }
  },

Hour:
  {
    screen: Hour,
    navigationOptions:({ navigation }) => {
    return {
      header: () => null
          }
    }
},
EditSheet:
  {
    screen: EditSheet,
    navigationOptions:({ navigation }) => {
    return {
      header: () => null
      
          }
    }
},

ViewEntry:
  {
    screen: ViewEntry,
    navigationOptions:({ navigation }) => {
    return {
      header: () => null
          }
    }
},
Test:
  {
    screen: Test,
    navigationOptions:({ navigation }) => {
    return {
      header: () => null
          }
    }
}
}

const screens_two = {
  
  Login: {
    screen: Login,
    navigationOptions:
    {
      title: null,
      header: () => null
    }
},

ListView:
    {
      screen: Login,
      navigationOptions:
      {
        header: () => null
      }
},

  Home:
  {
      screen: Home,
      navigationOptions:({ navigation }) => {
      return {
        header: () => null
            }
      }
  },

Hour:
  {
    screen: Hour,
    navigationOptions:({ navigation }) => {
    return {
      header: () => null
          }
    }
},
EditSheet:
  {
    screen: EditSheet,
    navigationOptions:({ navigation }) => {
    return {
      header: () => null
      
          }
    }
},

ViewEntry:
  {
    screen: ViewEntry,
    navigationOptions:({ navigation }) => {
    return {
      header: () => null
          }
    }
},
Test:
  {
    screen: Test,
    navigationOptions:({ navigation }) => {
    return {
      header: () => null
          }
    }
}
}

const HomeStack = createStackNavigator(screens);

  // let HomeStack;

  //   const hasLaunched = AsyncStorage.getItem(HAS_LAUNCHED);
  //   if (hasLaunched === null) {
  //     setAppLaunched();
  //      HomeStack = createStackNavigator(screens);
  //   } else {
  //     HomeStack = createStackNavigator(screens_two);
  //   }    


export default HomeStack;