import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  Image,
  ImageBackground,
  TouchableHighlight,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { withFirebaseHOC } from "../config/Firebase";
import { Input, Text, Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo";

const Item = ({ comment }) => (
  <View style={styles.item}>
    <Text style={styles.comment}>{comment}</Text>
  </View>
);

function commentsScreen({ route, navigation, firebase }) {
  const { ID, cantWrite, comments } = route.params;

  const [state, setState] = useState({
    commentText: "",
    error: "",
    pressedSubmit: false,
  });

  const renderItem = ({ item }) => <Item comment={item.comment} />;

  const submitComment = async () => {
    const comment = state.commentText;
    if (comment.length < 40) {
      setState(() => ({
        error: "Minimum 40 characters",
      }));
      return;
    }
    setState(() => ({
      error: "",
      pressedSubmit: true,
    }));
    try {
      const user = await firebase.getUser();
      if (user.uid) {
        const useruid = user.uid;
        const userData = { comment, useruid, ID };
        await firebase.createNewComment(userData);
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
        blurRadius={2}
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
            disabled={cantWrite || state.pressedSubmit}
          />
        </View>
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item.useruid}
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
});
