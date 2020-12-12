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

const { width, height } = Dimensions.get("window");

function movieScreen({ route, navigation }) {
  let [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_400Regular,
    Oswald_600SemiBold,
  });

  const { selected } = route.params;
  if (!fontsLoaded) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Image source={{ uri: selected.Poster }} style={styles.image} />
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
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topContainer: { height: (height - 100) / 2, width },
  image: {
    width,
    height,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 5,
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 25,
    position: "relative",
    zIndex: 10,
  },
  flexRow: { flexDirection: "row", backgroundColor: "black" },
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
    fontSize: 48,
    textTransform: "uppercase",
    lineHeight: 56,
    marginVertical: 20,
    fontFamily: "Oswald_600SemiBold",
  },
});

export default movieScreen;
