import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./app/screens/Home";
import SignIn from "./app/screens/Auth/SignIn";
import SignUp from "./app/screens/Auth/SignUp";
import EditProfile from "./app/screens/EditProfile";
import Detail from "./app/screens/Detail";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

const GradientHeader = () => (
  <LinearGradient
    colors={["#4a0850", "#0E627C"]}
    style={{ flex: 1 }}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  />
);

function InsideLayout({ route }) {
  const { user } = route.params;

  return (
    <InsideStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          height: 100,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
        headerBackTitleVisible: false,

        headerBackground: GradientHeader,
      }}
    >
      <InsideStack.Screen
        name="Home"
        component={Home}
        initialParams={{ user }}
        options={{
          headerShown: false,
          headerBackground: null,
        }}
      />
      <InsideStack.Screen
        name="UserProfile"
        component={EditProfile}
        options={({ navigation }) => ({
          title: "User Profile",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <InsideStack.Screen name="Detail" component={Detail} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      if (authUser) {
        const { uid, email, displayName, photoURL } = authUser;
        setUser({ uid, email, displayName, photoURL });
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        {user ? (
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
            initialParams={{ user }}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
