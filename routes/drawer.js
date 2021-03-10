import{ createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import HomeStack from './homestack';
import DrawerStack from './drawerStack';


const RootDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeStack,
       
    },

    Drawer: {
        screen: DrawerStack,
    }

});

export default createAppContainer(RootDrawerNavigator);