import { useRouter } from "expo-router";
import { useCallback } from "react";
import AsyncStorgage from "@react-native-async-storage/async-storage";

export function useLogout() {
    const router = useRouter();

    const logout = useCallback(async () => {
        try{
            await AsyncStorgage.removeItem("token");
            router.replace("/login");
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    }, [router]);

    return {logout};
}