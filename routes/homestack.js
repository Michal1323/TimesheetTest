import React from 'react';
<<<<<<< HEAD
import { createStackNavigator } from 'react-navigation-stack';
=======
import AsyncStorage from '@react-native-community/async-storage'
import { createStackNavigator } from 'react-navigation-stack';

>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc
import Login from '../screens/login';
import Home from '../screens/Home';
import Hour from '../screens/Hour';
import EditSheet from '../screens/EditSheet';
import ViewEntry from '../screens/ViewEntry';
import ListView from '../screens/ListView';
import Header from '../components/Header';
import Onboarding from '../screens/Onboarding';
<<<<<<< HEAD
=======
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



>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc


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
<<<<<<< HEAD
      screen: ListView,
      navigationOptions:
      {
        title: null,
=======
      screen: Login,
      navigationOptions:
      {
        header: () => null
>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc
      }
},

  Home:
  {
      screen: Home,
      navigationOptions:({ navigation }) => {
      return {
<<<<<<< HEAD
        headerTitle: () => <Header navigation={navigation} title='Timesheet' />,
        headerLeft: () => null
=======
        header: () => null
>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc
            }
      }
  },

Hour:
  {
    screen: Hour,
    navigationOptions:({ navigation }) => {
    return {
<<<<<<< HEAD
      headerTitle: () => <Header navigation={navigation} title='Enter hours' />,
      headerLeft: () => null
=======
      header: () => null
>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc
          }
    }
},
EditSheet:
  {
    screen: EditSheet,
    navigationOptions:({ navigation }) => {
    return {
<<<<<<< HEAD
      headerTitle: () => <Header navigation={navigation} title='Edit' />,
      headerLeft: () => null
=======
      header: () => null
      
>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc
          }
    }
},

ViewEntry:
  {
    screen: ViewEntry,
<<<<<<< HEAD
=======
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
>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc
    navigationOptions:
    {
      title: null,
      header: () => null
    }
<<<<<<< HEAD
}




}


  


const HomeStack = createStackNavigator(screens);


=======
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
>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc


export default HomeStack;