import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../FirebaseConfig";

export const pickImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      allowsMultipleSelection: false,
    });
    return result.canceled ? null : result.assets[0].uri;
  } catch (e) {
    console.error("Error picking image: ", e);
    throw e;
  }
};

export const uploadImage = async (uri, path) => {
  if (!uri) throw new Error("Upload URI is missing");
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path); // Create a reference to the file location
    await uploadBytes(storageRef, blob); // Upload the file
    const URL = await getDownloadURL(storageRef); // Get the download URL
    console.log("Image URI: ", URL);
    return URL;
  } catch (e) {
    console.error("Error uploading image: ", e);
    throw e;
  }
};
