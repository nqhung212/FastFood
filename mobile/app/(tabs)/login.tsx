import React, {useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { styles } from '../../assets/css/login.style';

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    
    const handleLogin = async() => {
        if (email === "Admin@gmail.com" && password === "123456"){
            await AsyncStorage.setItem("userToken", "LoggedIn");
            Alert.alert("Login Successful");
            router.replace("./index");
        } else {
            Alert.alert("Invalid email or password");
        }
    }
    return (
    <View style = {styles.container}>
        <Text style = {styles.title}>Login</Text>

        <TextInput
            style = {styles.input}
            placeholder = "Email"
            value = {email}
            onChangeText = {setEmail}
        />
        <TextInput
            style = {styles.input}
            placeholder = "Password"
            value = {password}
            onChangeText = {setPassword}
            secureTextEntry
        />
        <Button title = "Login" onPress = {handleLogin} />
    </View>
)
};

