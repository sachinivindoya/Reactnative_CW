import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { db, FIREBASE_AUTH } from "../../../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { pickImage, uploadImage } from "../../common/UploadFile";
import { Ionicons } from "@expo/vector-icons";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const todoRef = collection(db, "profileData");
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  const signUp = async () => {
    setLoading(true);
    try {
      if (email && password && image) {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log(response);

        const profileImageUrl = await uploadImage(image, response.user.uid);
        const data = {
          email: email.toLowerCase(),
          password: password,
          imageUrl: profileImageUrl,
          createdAt: serverTimestamp(),
        };

        await addDoc(todoRef, data);
        setEmail("");
        setPassword("");
        setImage("");
        Keyboard.dismiss();
      } else {
        alert("Required fields are missing");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  async function handleImageUpload() {
    const uri = await pickImage();
    if (!uri) return; // User canceled the image picker
    const path = `images/${Date.now()}_img.png`; // Define the path in storage
    const downloadURL = await uploadImage(uri, path);
    console.log("Uploaded image URL:", downloadURL);
    setImage(downloadURL);
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4a0850", "#0E627C"]} style={styles.header}>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Already have an account?</Text>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={styles.getStarted}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.formContainer}>
        <Text style={styles.welcomeBack}>Create your account</Text>
        <Text style={styles.subText}>Enter your details </Text>
        <TouchableOpacity
          style={styles.imgContainer}
          onPress={handleImageUpload}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person" size={60} color="#ccc" />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="User Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#888"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity style={styles.signInButton} onPress={signUp}>
              <LinearGradient
                colors={["#4a0850", "#0E627C"]}
                style={styles.signInGradient}
              >
                <Text style={styles.signInText}>Sign up</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or sign up with</Text>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{
                uri: "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png",
              }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/512px-Facebook_Logo_%282019%29.png",
              }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: "25%",
    paddingBottom: 20,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 40,
    marginRight: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
  },
  getStarted: {
    fontWeight: "bold",
  },
  getStartedButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -30,
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  uploadButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#333",
  },
  welcomeBack: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subText: {
    color: "#888",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
    borderColor: "#f5f5f5",
    borderWidth: 1,
  },
  signInButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 20,
  },
  signInGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#888",
    marginBottom: 20,
  },
  orText: {
    color: "#888",
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 25,
    width: "48%",
    justifyContent: "center",
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: "#333",
  },
  imgContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: "auto",
    marginBottom: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ccc",
  },
});
