import React from 'react';
import BottomNavbar from '../components/BottomNavbar';
import NewRodOrder from '../screens/NewRodOrder';
import OrderList from '../screens/OrderList';
import TruckTracking from '../screens/TruckTracking';
import Profile from '../screens/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';




const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown : false}} tabBar={props=><BottomNavbar {...props} />}>

    <Tab.Screen name="Home" component={NewRodOrder} />
    <Tab.Screen name="Orders" component={OrderList} />
    <Tab.Screen name="TruckTracking" component={TruckTracking}/>
    <Tab.Screen name="Profile" component={Profile} />

    </Tab.Navigator>
  )
}

export default BottomTabs