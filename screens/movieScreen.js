import React from "react";
import { Dimensions } from "react-native";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import LoadingScreen from "./loadingScreen";
import { Oswald_600SemiBold } from "@expo-google-fonts/oswald";
import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { withFirebaseHOC } from "../config/Firebase";

const { width, height } = Dimensions.get("window");

function movieScreen({ route, navigation }) {
  let [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_400Regular,
    Oswald_600SemiBold,
  });
  const { selected, movieID } = route.params;
  const showComments = async () => {
    navigation.navigate("Comments", {
      ID: movieID,
      movieTitle: selected.Title,
    });
  };

  if (!fontsLoaded) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Image
            source={{ uri: selected.Poster }}
            style={styles.image}
            blurRadius={0.5}
          />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.flexRow}>
            <Text style={[styles.year, styles.textWhite]}>
              {selected.Released}
            </Text>
            <Text style={[styles.textWhite, styles.genres]}>
              {selected.Genre}
            </Text>
          </View>
          <View>
            <Text style={[styles.textWhite, styles.title]}>
              {selected.Title}
            </Text>
            <View style={[styles.flexRow, styles.flexEnd]}>
              <Text style={[styles.textWhite, styles.imdbScore]}>
                {selected.imdbRating}
              </Text>
              <Text style={[styles.textWhite, styles.imdbScoreOverall]}>
                /10
              </Text>
              <Text style={[styles.textWhite, styles.imdb]}>IMDb</Text>
            </View>
            <Text style={[styles.textWhite, styles.desc]} numberOfLines={6}>
              {selected.Plot}
            </Text>
          </View>
          <View style={styles.container}>
            <Button
              title="Comments"
              titleStyle={[styles.imdb, { color: "black" }]}
              buttonStyle={{
                marginTop: 40,
                width: "50%",
              }}
              icon={
                <Ionicons
                  name="ios-chatbox-ellipses-outline"
                  size={24}
                  color="#1a2538"
                />
              }
              onPress={showComments}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topContainer: { height: (height - 200) / 2, width },
  image: {
    width,
    height,
    position: "absolute",
    zIndex: 5,
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 25,
    position: "relative",
    zIndex: 10,
  },
  flexRow: { flexDirection: "row", backgroundColor: "black", flexWrap: "wrap" },
  textWhite: { color: "#ffffff", backgroundColor: "black" },
  genres: {
    marginLeft: 10,

    color: "#ffffff90",
    fontFamily: "Inter_600SemiBold",
  },
  year: { fontFamily: "Inter_600SemiBold" },
  flexEnd: { alignItems: "flex-end" },
  imdbScore: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  imdbScoreOverall: {
    fontSize: 15,
    color: "#ffffff80",
    fontFamily: "Inter_600SemiBold",
  },
  imdb: {
    fontSize: 18,
    marginLeft: 10,
    color: "#ffba00",
    fontFamily: "Oswald_600SemiBold",
  },
  desc: { marginTop: 10, fontFamily: "Inter_400Regular" },
  title: {
    fontSize: 26,
    textTransform: "uppercase",
    lineHeight: 56,
    marginVertical: 20,
    fontFamily: "Oswald_600SemiBold",
  },
});

export default withFirebaseHOC(movieScreen);
