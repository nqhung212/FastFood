import { Alert } from "react-native";
import { useCart } from "../app/cart/CartContext";

/**
 * Hook tiện ích giúp thêm sản phẩm vào giỏ hàng
 * kèm theo phản hồi giao diện (Alert hoặc animation sau này)
 */
export const useAddToCart = () => {
    const { addToCart } = useCart();

    /**
     * Thêm sản phẩm vào giỏ hàng kèm thông báo thành công
     * @param item Sản phẩm cần thêm
     * @param quantity Số lượng (mặc định = 1)
     * @param options Tùy chọn phản hồi (hiện Alert hay không)
     */
    const handleAddToCart = (
        item: any,
        quantity: number = 1,
        options?: { showAlert?: boolean }
    ) => {
        if (!item) return;

        addToCart(item, quantity);

        if (options?.showAlert !== false) {
        Alert.alert("🛒 Thành công", `${item.name} đã được thêm vào giỏ hàng!`);
        }
    };

    return { handleAddToCart };
};
