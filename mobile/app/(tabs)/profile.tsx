import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { styles } from "@/assets/css/profile.style";

export default function ProfileScreen() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
        const saved = await AsyncStorage.getItem("user");
        if (saved) setUser(JSON.parse(saved));
        };
        fetchUser();
    }, []);

    const handleSignOut = async () => {
        await AsyncStorage.removeItem("user");
        setUser(null);
        router.replace("/auth/login");
    };

    if (!user) {
        return (
        <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
            <Text style={styles.text}>Bạn chưa đăng nhập</Text>
            <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/auth/login")}
            >
            <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>
        </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Thông tin cá nhân</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            <View style={styles.avatarContainer}>
            <Image
                source={{
                uri:
                    user.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                }}
                style={styles.avatar}
            />
            <Text style={styles.nameText}>{user.fullname}</Text>
            <Text style={styles.emailText}>{user.email || "user@example.com"}</Text>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📞</Text>
                    <Text style={styles.infoLabel}>Số điện thoại</Text>
                    <Text style={styles.infoValue}>{user.phone || "Chưa cập nhật"}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📍</Text>
                    <Text style={styles.infoLabel}>Địa chỉ</Text>
                    <Text style={styles.infoValue}>{user.address || "Chưa cập nhật"}</Text>
                </View>

                <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.infoIcon}>👤</Text>
                    <Text style={styles.infoLabel}>Vai trò</Text>
                    <Text style={styles.infoValue}>
                    {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                    </Text>
                </View>
            </View>


            <View style={{ marginTop: 30 }}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/profile/editProfile")}
            >
                <Text style={styles.buttonText}>Chỉnh sửa thông tin</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ff7b5f" }]}
                onPress={() => router.push("/profile/orderHistory")}
            >
                <Text style={styles.buttonText}>Lịch sử đơn hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: "#d63031" }]}
                onPress={handleSignOut}
            >
                <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}
