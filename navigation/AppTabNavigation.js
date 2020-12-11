import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  SearchStackNavigator,
  ProfileStackNavigator,
} from "./AppStackNavigation";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Search"
      activeColor="#f0edf6"
      inactiveColor="#1e1f21"
      barStyle={{ backgroundColor: "#4badf2" }}
    >
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={{
          tabBarLabel: <Text style={{ fontSize: 15 }}>Search</Text>,
          tabBarIcon: () => (
            <Ionicons name="ios-search" color="white" size={27} />
          ),
          labelStyle: { textTransform: "none" },
          style: {
            fontSize: 24,
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
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
