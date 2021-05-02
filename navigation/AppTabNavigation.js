import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import searchScreen from "../screens/searchScreen";
import profileScreen from "../screens/profileScreen";
import activityScreen from "../screens/activityScreen";

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
            <Ionicons name="ios-search" color="white" size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={profileScreen}
        options={{
          tabBarLabel: <Text style={{ fontSize: 15 }}>Profile</Text>,
          tabBarIcon: () => (
            <Ionicons name="ios-person" color="white" size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Activity"
        component={activityScreen}
        options={{
          tabBarLabel: <Text style={{ fontSize: 15 }}>Activity</Text>,
          tabBarIcon: () => (
            <Ionicons name="ios-chatbubbles-outline" color="white" size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
