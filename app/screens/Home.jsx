import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Pressable,
  Image,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { db, FIREBASE_AUTH } from "../../FirebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";
import { pickImage, uploadImage } from "../common/UploadFile";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const Home = ({ route }) => {
  const { user } = route.params;
  const [todos, setTodos] = useState([]);
  const [addData, setAddData] = useState("");
  const navigation = useNavigation();
  const todoRef = collection(db, "todos");
  const profileRef = collection(db, "profileData");
  const [image, setImage] = useState(null);
  const [email] = useState(user?.email);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const q = query(todoRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todos = [];
      querySnapshot.forEach((doc) => {
        const { heading, imageUrl } = doc.data();
        todos.push({
          id: doc.id,
          heading,
          imageUrl,
        });
      });
      setTodos(todos);
    });

    handleSearch();
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [email]);

  useFocusEffect(
    useCallback(() => {
      handleSearch();
    }, [email])
  );

  const addTodo = () => {
    if (addData.trim().length > 0 && image) {
      const data = {
        heading: addData,
        imageUrl: image,
        createdAt: serverTimestamp(),
      };
      addDoc(todoRef, data)
        .then(() => {
          setAddData("");
          Keyboard.dismiss();
          setImage("");
        })
        .catch((error) => {
          alert("Failed to add todo: " + error.message);
        });
    } else {
      alert("Please enter some text or import some.");
    }
  };

  const deleteTodo = (item) => {
    const docRef = doc(db, "todos", item.id);
    deleteDoc(docRef)
      .then(() => {
        alert("Successfully deleted!");
      })
      .catch((error) => {
        alert("Failed to delete todo: " + error.message);
      });
  };

  async function handleImageUpload() {
    const uri = await pickImage();
    if (!uri) return; // User canceled the image picker
    const path = `images/${Date.now()}_img.png`; // Define the path in storage
    const downloadURL = await uploadImage(uri, path);
    console.log("Uploaded image URL:", downloadURL);
    setImage(downloadURL);
  }

  const handleSearch = () => {
    const results = [];
    if (email) {
      const q = query(profileRef, where("email", "==", email));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const { email, imageUrl, password } = doc.data();
          results.push({
            id: doc.id,
            email,
            imageUrl,
            password,
          });
        });
        setSearchResults(results[0]);
      });

      return () => unsubscribe();
    } else {
      console.error("Invalid email:", email);
      return results;
    }
  };

  return (
    <View style={styles.fullScreen}>
      <LinearGradient colors={["#0E627C","#4a0850"]} style={styles.header}>
        <TouchableOpacity
          style={styles.imgContainer}
          onPress={() => navigation.navigate("UserProfile", { searchResults })}
        >
          {searchResults?.imageUrl ? (
            <Image
              source={{ uri: searchResults.imageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons name="person" size={60} color="#ccc" />
          )}
        </TouchableOpacity>
        <Text style={styles.headerText}>My Memos </Text>
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()}>
            <Icon name="sign-out" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder=" +  New Memo"
          placeholderTextColor="#aaaaaa"
          onChangeText={setAddData}
          value={addData}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <SafeAreaView>
          <TouchableOpacity
            style={styles.uploadFileButton}
            onPress={handleImageUpload}
          >
            <Icon name="upload" size={20} color="#fff" />
            <Text style={styles.uploadFileButtonText}>Upload File</Text>
          </TouchableOpacity>
          {image && <Text style={styles.imageLabel}>Selected Image</Text>}
        </SafeAreaView>
      </View>
      <TouchableOpacity style={styles.button} onPress={addTodo}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
      <FlatList
        data={todos}
        numColumns={1}
        renderItem={({ item }) => (
          <Pressable
            style={styles.container}
            onPress={() => navigation.navigate("Detail", { item })}
          >
            <FontAwesome
              name="trash-o"
              color="red"
              onPress={() => deleteTodo(item)}
              style={styles.todoIcon}
            />
            <View style={styles.innerContainer}>
              <Text
                style={styles.itemHeading}
                numberOfLines={4}
                ellipsizeMode="tail"
              >
                {item.heading[0].toUpperCase() + item.heading.slice(1)}
              </Text>
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              )}
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  header: {
    flexDirection: "row",
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 10,
    marginLeft: 20,
  },
  formContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
    elevation: 3,
  },
  button: {
    height: 47,
    borderRadius: 10,
    backgroundColor: "#4a0850",
    width: 80,
    marginLeft: "auto",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  todoIcon: {
    fontSize: 20,
    marginLeft: 14,
  },
  container: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    justifyContent: "space-between",
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,
  },
  itemHeading: {
    fontWeight: "300",
    fontSize: 15,
    marginRight: 22,
    width: 100,
  },
  uploadFileButton: {
    backgroundColor: "#e3d5ca",
    flexDirection: "row",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  uploadFileButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 8,
  },
  image: {
    width: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  rightContainer: {
    marginLeft: 60,
    marginBottom: 70,
  },
  imageLabel: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "#888888",
  },
  imgContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: "auto",
    width: 150,
    height: 150,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ccc",
    backgroundColor: "#ffffff",
  },
});
