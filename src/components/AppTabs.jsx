import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomNavbar from "./BottomNavbar";
import NewRodOrder from "../screens/NewRodOrder";
import OrderList from "../screens/OrderList";
import Address from "../screens/Address";

const Tab = createBottomTabNavigator();


function AppTabs(){
    return(
        <Tab.Navigator screenOptions={{headerShown : false}} tabBar={props=> <BottomNavbar {...props}/>}>
            <Tab.Screen name="Home" component={NewRodOrder} />
            <Tab.Screen name="Orders" component={OrderList}/>
            <Tab.Screen name="Address" component={Address} />
            
        </Tab.Navigator>
    )
}

export default AppTabs;