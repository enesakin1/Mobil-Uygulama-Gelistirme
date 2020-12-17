import React, { useState, useEffect } from "react";
import { StyleSheet, View, ImageBackground, FlatList } from "react-native";
import { withFirebaseHOC } from "../config/Firebase";
import { Input, Text, Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

function commentsScreen({ route, firebase }) {
  const { ID, movieTitle } = route.params;
  const [state, setState] = useState({
    commentText: "",
    error: "",
    pressedSubmit: false,
    comments: {},
    useruid: "",
  });

  const showCommentsVotes = async () => {
    const value = await AsyncStorage.getItem("useruid");
    const comments = await firebase.getAllComments(ID);
    const votes = await firebase.getAllVotes(ID);
    if (!state.useruid) {
      if (value !== null) {
        setState({ useruid: value });
      }
    }

    for (let i = 0; i < comments.length; i++) {
      comments[i].votecount = 0;
      comments[i].voteowner = false;
      if (comments[i].useruid == value) {
        setState((prevState) => ({
          ...prevState,
          pressedSubmit: true,
        }));
      }
      for (let j = 0; j < votes.length; j++) {
        if (comments[i].commentid == votes[j].commentid) {
          comments[i].votecount++;

          if (votes[j].voteuseruid == value) {
            comments[i].voteowner = true;
          }
        }
      }
    }
    setState((prevState) => ({
      ...prevState,
      comments: comments,
    }));
  };
  useEffect(() => {
    showCommentsVotes();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.commentTitleContainer}>
        <Text style={styles.commentTitle}>{item.username}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginRight: 7 }}>{item.votecount}</Text>
          <Ionicons
            name={item.voteowner ? "ios-heart" : "ios-heart-empty"}
            size={22}
            color="#08324d"
            onPress={async () => {
              if (item.useruid != state.useruid)
                item.voteowner
                  ? await deleteVote(item.commentid)
                  : await submitVote(item.commentid);
            }}
          />
        </View>
      </View>
      <View style={styles.commentContainer}>
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
      <View style={styles.commentDateContainer}>
        <Text style={styles.commentDate}>{item.currentDate}</Text>
      </View>
    </View>
  );
  const submitVote = async (commentid) => {
    const voteid = "";
    const voteuseruid = await firebase.getUser().uid;
    const voteData = { voteid, commentid, voteuseruid, ID };
    const notificationData = await firebase.createVote(voteData, commentid);
    if (notificationData[0]) {
      await firebase.sendPushNotification(notificationData);
    }
    showCommentsVotes();
  };
  const deleteVote = async (commentid) => {
    const voteuseruid = await firebase.getUser().uid;
    await firebase.deleteVote(commentid, voteuseruid);
    showCommentsVotes();
  };
  const submitComment = async () => {
    const comment = state.commentText;
    if (!state.commentText) {
      return;
    }
    if (state.commentText.length < 40) {
      setState((prevState) => ({
        ...prevState,
        error: "Minimum 40 characters",
      }));
      return;
    }
    setState((prevState) => ({
      ...prevState,
      error: "",
      pressedSubmit: true,
      commentText: "",
    }));
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    let currentDate =
      date + "/" + month + "/" + year + " " + hours + ":" + min + ":" + sec;
    try {
      const username = await firebase.getUsername(state.useruid);
      if (state.useruid) {
        const useruid = state.useruid;
        let commentid = "";
        const userData = {
          comment,
          useruid,
          ID,
          currentDate,
          movieTitle,
          commentid,
          username,
        };
        await firebase.createNewComment(userData);
        showCommentsVotes();
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/comment.jpg")}
        style={{ flex: 1, width: "100%" }}
        blurRadius={0.5}
      >
        <View style={styles.writeComment}>
          <Input
            name="Comment"
            inputContainerStyle={{
              borderWidth: 1,
              borderColor: "#06334f",
              backgroundColor: "#e8eaed",
            }}
            placeholderTextColor="#606063"
            style={styles.textInput}
            value={state.commentText}
            onChangeText={(text) =>
              setState((prevState) => {
                return { ...prevState, commentText: text };
              })
            }
            blurOnSubmit={true}
            maxLength={120}
            autoCapitalize="none"
            placeholder="What are your thoughts on this show?"
            multiline={true}
            errorMessage={state.error}
          />
          <Button
            buttonStyle={{
              backgroundColor: "#6aa5fc",
              borderRadius: 10,
              width: "30%",
              alignSelf: "flex-end",
              marginRight: 10,
            }}
            title="Publish"
            buttonColor="#039BE5"
            onPress={submitComment}
            disabled={state.pressedSubmit}
          />
        </View>
        <FlatList
          data={state.comments}
          renderItem={renderItem}
          keyExtractor={(item) => item.commentid}
          style={{ flex: 1 }}
        ></FlatList>
      </ImageBackground>
    </View>
  );
}

export default withFirebaseHOC(commentsScreen);

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
