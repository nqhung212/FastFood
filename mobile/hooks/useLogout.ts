import { useRouter } from "expo-router";
import { useCallback, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartContext } from '../app/cart/CartContext';

export function useLogout() {
    const router = useRouter();
    const cartCtx = useContext(CartContext);

    const logout = useCallback(async () => {
        try{
            // remove stored user info
            await AsyncStorage.removeItem('user');
            // refresh cart to guest
            if (cartCtx?.refreshCartForUser) await cartCtx.refreshCartForUser();
            // navigate to login
            router.replace('/auth/login');
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    }, [router, cartCtx]);

    return {logout};
}