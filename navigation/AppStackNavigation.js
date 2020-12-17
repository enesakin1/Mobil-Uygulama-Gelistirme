import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import movieScreen from "../screens/movieScreen";
import commentsScreen from "../screens/commentsScreen";
import TabNavigator from "./AppTabNavigation";

const appStack = createStackNavigator();

const SearchStackNavigator = () => {
  return (
    <appStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <appStack.Screen name="Tab" component={TabNavigator}></appStack.Screen>
      <appStack.Screen name="Movie" component={movieScreen} />
      <appStack.Screen name="Comments" component={commentsScreen} />
    </appStack.Navigator>
  );
};

export default SearchStackNavigator;
