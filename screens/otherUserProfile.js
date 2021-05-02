import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { withFirebaseHOC } from "../config/Firebase";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "./loadingScreen";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "react-native-axios";

function otherUserProfile({ route, firebase, navigation }) {
  const apiurl = "http://www.omdbapi.com/?apikey=9311d6bd";
  const { selectedUseruid } = route.params;
  const [state, setState] = useState({
    useruid: "",
    avatar: null,
    username: "",
    comments: {},
    loaded: false,
    isFollowing: false,
    followID: "",
  });
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
        <Text style={styles.commentDate}>{item.currentDate}</Text>
      </View>
    </View>
  );
  const onRefresh = () => {
    setState((prevState) => ({
      ...prevState,
      isFetching: true,
    }));
    getCommentsAgain();
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      loaded: false,
    }));
    getUserInfo();
  }, []);

  const getCommentsAgain = async () => {
    const comments = await firebase.getUserComments(state.useruid);
    setState((prevState) => ({
      ...prevState,
      comments: comments,
      isFetching: false,
    }));
  };
  const getUserInfo = async () => {
    const useruid = await selectedUseruid;
    const uri = await firebase.getPhoto(useruid);
    const username = await firebase.getUsername(useruid);
    const comments = await firebase.getUserComments(useruid);

    const followeruid = await AsyncStorage.getItem("useruid");
    const followeduid = selectedUseruid;
    const userData = {
      followeruid,
      followeduid,
    };

    let result = await firebase.getFollow(userData);
    let resultBoolean = false;
    if (result !== "notFollowing") {
      resultBoolean = true;
    }

    setState({
      useruid: useruid,
      avatar: uri,
      username: username,
      comments: comments,
      loaded: true,
      isFetching: false,
      isFollowing: resultBoolean,
      followID: resultBoolean ? result : "",
    });
  };
  const followUser = async () => {
    const followeruid = await AsyncStorage.getItem("useruid");
    const followeduid = selectedUseruid;
    let followid = "";
    const userData = {
      followeruid,
      followeduid,
      followid,
    };
    const id = await firebase.followUser(userData);
    setState((prevState) => ({
      ...prevState,
      isFollowing: true,
      followID: id,
    }));
    const username = await firebase.getUsername(followeruid);
    const expoToken = await firebase.getExpoToken(followeruid);
    const message = {
      to: expoToken,
      sound: "default",
      title: "New Follower!",
      body: username + " followed you",
    };
    await firebase.sendPushNotification(message);
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

  const unfollowUser = async () => {
    Alert.alert(
      "Unfollow " + state.username,
      "Are you sure?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await firebase.unfollowUser(state.followID);
            setState((prevState) => ({
              ...prevState,
              isFollowing: false,
              followID: "",
            }));
          },
        },
      ],
      { cancelable: false }
    );
  };

  return state.loaded == true ? (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/profile.png")}
        style={{ flex: 1, width: "100%" }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 0.8,
            borderBottomWidth: 1,
          }}
        >
          <Button
            buttonType="outline"
            buttonStyle={{
              backgroundColor: "#4bab55",
              borderRadius: 10,
              justifyContent: "flex-end",
            }}
            icon={
              <Ionicons
                name={
                  state.isFollowing
                    ? "person-remove-outline"
                    : "person-add-outline"
                }
                size={17}
                color="white"
              />
            }
            title={state.isFollowing ? "Unfollow" : "Follow"}
            buttonColor="#039BE5"
            titleStyle={{ marginLeft: 4 }}
            onPress={state.isFollowing ? unfollowUser : followUser}
          />
          <View style={styles.avatarContainer}>
            <TouchableOpacity style={styles.avatarPlaceholder}>
              <Image
                style={styles.avatar}
                source={
                  state.avatar
                    ? { uri: state.avatar }
                    : require("../assets/tempAvatar.png")
                }
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{state.username}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Comment History</Text>
        </View>
        <FlatList
          data={state.comments}
          renderItem={renderItem}
          keyExtractor={(item) => item.commentid}
          style={{ flex: 1 }}
          refreshing={state.isFetching}
          onRefresh={() => onRefresh}
        ></FlatList>
      </ImageBackground>
    </View>
  ) : (
    <LoadingScreen />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    shadowColor: "#151734",
    shadowRadius: 15,
    shadowOpacity: 0.4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    marginTop: 17,
    fontSize: 16,
    fontWeight: "bold",
  },
  titleContainer: {
    flex: 0.2,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
  },
  comments: {
    flex: 1,
    marginTop: 25,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#E1E2E6",
    borderRadius: 50,
    marginTop: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: "#e4e9f2",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  comment: {
    fontSize: 13,
  },
  commentDate: {
    fontSize: 13,
  },
  commentTitle: {
    fontSize: 16,
    marginLeft: 5,
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

export default withFirebaseHOC(otherUserProfile);
