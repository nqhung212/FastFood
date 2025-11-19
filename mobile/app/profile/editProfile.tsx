import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { supabase } from "@/service/supabaseClient";
import { styles } from "@/assets/css/profile.style";

export default function EditProfileScreen() {
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    // Animation setup
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        const loadUser = async () => {
        const saved = await AsyncStorage.getItem("user");
        if (saved) {
            const parsed = JSON.parse(saved);
            setUser(parsed);
            setFullname(parsed.fullname || "");
            setPhone(parsed.phone || "");
            setAddress(parsed.address || "");
        }
        };
        loadUser();

        Animated.parallel([
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }),
        Animated.timing(translateY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }),
        ]).start();
    }, []);

    const handleSave = async () => {
        if (!user) return;

        if (!fullname.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập họ tên!");
        return;
        }

    // Update user_account in new schema
    const { error } = await supabase
    .from("user_account")
    .update({ full_name: fullname, phone })
    .eq("user_id", user.id);

        if (error) {
        Alert.alert("Lỗi", "Không thể cập nhật thông tin: " + error.message);
        return;
        }

    const updatedUser = { ...user, fullname, phone, address };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

        Alert.alert("🎉 Thành công", "Cập nhật thông tin thành công!");
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
        <Animated.View
            style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY }],
            }}
        >
            <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
            >
            <ScrollView
                contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.headerText}>Chỉnh sửa thông tin</Text>

                <View style={[styles.infoContainer, { marginTop: 20 }]}>
                <Text style={styles.label}>👤 Họ tên</Text>
                <TextInput
                    style={styles.input}
                    value={fullname}
                    onChangeText={setFullname}
                    placeholder="Nhập họ tên"
                    placeholderTextColor="#aaa"
                />

                <Text style={styles.label}>📞 Số điện thoại</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Nhập số điện thoại"
                    keyboardType="phone-pad"
                    placeholderTextColor="#aaa"
                />

                <Text style={styles.label}>🏠 Địa chỉ</Text>
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Nhập địa chỉ"
                    multiline
                    placeholderTextColor="#aaa"
                />
                </View>

                <TouchableOpacity
                style={[styles.button, { marginTop: 30 }]}
                activeOpacity={0.8}
                onPress={handleSave}
                >
                <Text style={styles.buttonText}>💾 Lưu thay đổi</Text>
                </TouchableOpacity>
            </ScrollView>
            </KeyboardAvoidingView>
        </Animated.View>
        </SafeAreaView>
    );
}
