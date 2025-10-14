import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

export const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
})