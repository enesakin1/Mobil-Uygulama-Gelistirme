import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  FlatList,
  SafeAreaView,
} from "react-native";
import { withFirebaseHOC } from "../config/Firebase";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "react-native-axios";

function activityScreen({ firebase, navigation }) {
  const apiurl = "http://www.omdbapi.com/?apikey=9311d6bd";
  const [state, setState] = useState({
    comments: {},
    isFetching: false,
  });

  useEffect(() => {
    showAllActivies();
  }, []);

  const onRefresh = () => {
    setState({
      isFetching: true,
    });
    showAllActivies();
  };

  const showAllActivies = async () => {
    let followedUsers = [];
    let comments = [];
    const useruid = await AsyncStorage.getItem("useruid");
    followedUsers = await firebase.getAllFollowedUsers(useruid);
    if (followedUsers.length != 0) {
      await Promise.all(
        followedUsers.map(async (elem) => {
          comments.push.apply(
            comments,
            await firebase.getUserComments(elem.followeduid)
          );
        })
      );
    }
    comments.sort(function (a, b) {
      var keyA = a.currentDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3/$1/$2");
      var keyB = b.currentDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3/$1/$2");
      if (keyA > keyB) return -1;
      if (keyA < keyB) return 1;
      return 0;
    });
    setState({
      comments: comments,
      isFetching: false,
    });
  };

  const navigateProfile = async (paramuseruid) => {
    navigation.navigate("Stack", {
      screen: "OtherUserProfile",
      params: { selectedUseruid: paramuseruid },
    });
  };

  const navigateMovie = async (imdbID) => {
    await axios(apiurl + "&i=" + imdbID).then(({ data }) => {
      let result = data;
      navigation.navigate("Movie", {
        selected: result,
        movieID: imdbID,
      });
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.commentTitleContainer}>
        <Text
          onPress={() => navigateMovie(item.ID)}
          style={styles.commentTitle}
        >
          {item.movieTitle}
        </Text>
      </View>
      <View style={styles.commentContainer}>
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
      <View style={styles.commentDateContainer}>
        <Text
          onPress={() => navigateProfile(item.useruid)}
          style={styles.commentUsername}
        >
          {item.username}
        </Text>
        <Text style={styles.commentDate}>{item.currentDate}</Text>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/search.png")}
        style={{ flex: 1, width: "100%" }}
        blurRadius={0.5}
      >
        <FlatList
          data={state.comments}
          renderItem={renderItem}
          keyExtractor={(item) => item.commentid}
          style={{ flex: 1 }}
          refreshing={state.isFetching}
          onRefresh={() => onRefresh()}
        ></FlatList>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default withFirebaseHOC(activityScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  writeComment: {
    flex: 0.57,
    marginTop: 25,
  },
  textInput: {
    marginLeft: 10,
    fontSize: 17,
  },
  results: {
    flex: 1,
    borderTopWidth: 0.5,
  },
  result: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  item: {
    backgroundColor: "#e4e9f2",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  comment: {
    fontSize: 13,
  },
  commentDate: {
    fontSize: 13,
  },
  commentUsername: {
    fontWeight: "bold",
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  commentDateContainer: {
    marginTop: 5,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  commentContainer: {
    justifyContent: "center",
    marginTop: 5,
  },
  commentTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
