import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import movieScreen from "../screens/movieScreen";
import DrawerNavigator from "./AppDrawNavigation";

const appStack = createStackNavigator();

const SearchStackNavigator = () => {
  return (
    <appStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <appStack.Screen name="Drawer" component={DrawerNavigator} />
      <appStack.Screen name="Movie" component={movieScreen} />
    </appStack.Navigator>
  );
};

export default SearchStackNavigator;
