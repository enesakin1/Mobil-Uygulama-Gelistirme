import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "../screens/searchScreen";
import profileScreen from "../screens/profileScreen";

const appStack = createStackNavigator();

const SearchStackNavigator = () => {
  return (
    <appStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <appStack.Screen name="Search" component={Search} />
    </appStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <appStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <appStack.Screen name="Profile" component={profileScreen} />
    </appStack.Navigator>
  );
};

export { SearchStackNavigator, ProfileStackNavigator };
