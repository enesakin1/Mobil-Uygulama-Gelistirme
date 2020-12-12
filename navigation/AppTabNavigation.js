import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import searchScreen from "../screens/searchScreen";
import profileScreen from "../screens/profileScreen";

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Search"
      activeColor="#f0edf6"
      inactiveColor="black"
    >
      <Tab.Screen
        name="Search"
        component={searchScreen}
        options={{
          tabBarLabel: <Text style={{ fontSize: 15 }}>Search</Text>,
          tabBarIcon: () => (
            <Ionicons name="ios-search" color="white" size={27} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={profileScreen}
        options={{
          tabBarLabel: <Text style={{ fontSize: 15 }}>Profile</Text>,
          tabBarIcon: () => (
            <Ionicons name="ios-contact" color="white" size={27} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
