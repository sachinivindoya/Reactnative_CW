import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { pickImage, uploadImage } from "../common/UploadFile";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

const EditProfile = ({ route }) => {
  const { searchResults } = route.params;
  const [email, setEmail] = useState(searchResults?.email);
  const [password, setPassword] = useState(searchResults?.password);
  const [image, setImage] = useState(searchResults?.imageUrl);
  const navigation = useNavigation();

  async function handleImageUpload() {
    const uri = await pickImage();
    if (!uri) return; // User canceled the image picker
    const path = `images/${Date.now()}_img.png`; // Define the path in storage
    const downloadURL = await uploadImage(uri, path);
    console.log("Uploaded image URL:", downloadURL);
    setImage(downloadURL);
  }

  const handleUpdate = async () => {
    if (image) {
      const profileRef = doc(db, "profileData", searchResults.id);
      await updateDoc(profileRef, {
        imageUrl: image,
      })
        .then(() => {
          alert("Updated Successfully!");
          navigation.navigate("Home", { updated: true });
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: image,
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={handleImageUpload}>
          <Text style={styles.changePictureText}>Change Picture</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          editable={false}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          editable={false}
        />
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  changePictureText: {
    color: "#788eec",
    fontWeight: "bold",
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontWeight: "600",
    marginTop: 15,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: "#788eec",
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default EditProfile;
