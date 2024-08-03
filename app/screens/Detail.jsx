import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { db } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import { pickImage, uploadImage } from "../common/UploadFile";

const Detail = ({ route }) => {
  const { item } = route.params;
  const [textHeading, onChangeHeadingText] = useState(item.heading);
  const [imgUrl, setImgUrl] = useState(item.imageUrl);
  const navigation = useNavigation();

  const updateTodo = async () => {
    if (textHeading && textHeading.length > 0 && imgUrl) {
      const todoDocRef = doc(db, "todos", item.id);

      await updateDoc(todoDocRef, {
        heading: textHeading,
        imageUrl: imgUrl,
      })
        .then(() => {
          alert("Updated Successfully!");
          navigation.navigate("Home");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  async function handleImageUpload() {
    const uri = await pickImage();
    if (!uri) return; // User canceled the image picker
    const path = `images/${Date.now()}_img.png`; // Define the path in storage
    const downloadURL = await uploadImage(uri, path);
    console.log("Uploaded image URL:", downloadURL);
    setImgUrl(downloadURL);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imgContainer} onPress={handleImageUpload}>
        <Image
          source={{
            uri: imgUrl,
          }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.textField}
          onChangeText={onChangeHeadingText}
          value={textHeading}
          placeholder="Enter Name"
        />
        <TouchableOpacity style={styles.buttonUpdate} onPress={updateTodo}>
          <Text style={styles.updateButtonText}>Update Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    justifyContent: "center",
    paddingHorizontal: 15,
    margin: 10,
  },
  textField: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 25,
  },
  buttonUpdate: {
    backgroundColor: "#4a0850",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  imgContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginTop: 15,
  },
  textContainer: {
    flexDirection: "column",
  },
});
