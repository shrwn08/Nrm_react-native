import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppTabs from "./AppTabs";

const Stack = createNativeStackNavigator();

function AuthenticatedNavigator() {
    return(
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name="MainTabs" component={AppTabs} />
        </Stack.Navigator>
    )
};


export default AuthenticatedNavigator;