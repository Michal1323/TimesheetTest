import{ createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import HomeStack2 from './homestack2';
import DrawerStack from './drawerStack';
import Expenses from './expenses';


const RootDrawerNavigator = createDrawerNavigator({
    Home: { 
        screen: HomeStack2,
       
    },

    TSReview: {
        screen: DrawerStack,
    },
    
    Expenses: {
        screen: Expenses,
    }

});

export default createAppContainer(RootDrawerNavigator);