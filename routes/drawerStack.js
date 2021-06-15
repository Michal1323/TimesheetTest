import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Test from '../screens/Tester';
import Header from '../components/Header';


const screens = {
  Test:
  {
      screen: Test,
      navigationOptions:({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title='Timesheet Review' />,
        headerLeft: () => null
            }
      }
  }
}

const DrawerStack = createStackNavigator(screens);



<<<<<<< HEAD
export default DrawerStack;
=======
export default DrawerStack;
>>>>>>> 9d1e7feafd00653e9b0caea18faef42089afc9bc
