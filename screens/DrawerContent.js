import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Drawer } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { withFirebaseHOC } from "../config/Firebase";

function DrawerContent(props) {
  return (
    <View style={{ flex: 1, backgroundColor: "#ECF1F4" }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <ImageBackground
                source={require("../assets/logoWithout.png")}
                style={styles.logo}
                borderRadius={10}
              />
            </View>
            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({ color, size }) => (
                  <Ionicons name="ios-search" color={color} size={size} />
                )}
                label="Search"
                labelStyle={{ fontSize: 16 }}
                onPress={() => {
                  props.navigation.navigate("Tab", { screen: "Search" });
                }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Ionicons name="ios-contact" color={color} size={size} />
                )}
                label="Profile"
                labelStyle={{ fontSize: 16 }}
                onPress={() => {
                  props.navigation.navigate("Tab", { screen: "Profile" });
                }}
              />
            </Drawer.Section>
          </View>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Ionicons name="ios-exit" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={async () => {
            try {
              await props.firebase.signOut();
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </Drawer.Section>
    </View>
  );
}

export default withFirebaseHOC(DrawerContent);

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  logo: {
    flex: 1,
    aspectRatio: 1.7,
  },
});
