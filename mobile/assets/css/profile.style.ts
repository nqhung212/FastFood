import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },

    headerContainer: {
        backgroundColor: "#fb5252",
        paddingVertical: 18,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },

    headerText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        letterSpacing: 0.5,
    },

    avatarContainer: {
        alignItems: "center",
        marginTop: 25,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: "#fb5252",
    },

    nameText: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 10,
        color: "#333",
    },

    emailText: {
        fontSize: 14,
        color: "#777",
    },

    infoContainer: {
        marginTop: 30,
        backgroundColor: "#fff",
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#f2f2f2",
    },

    infoIcon: {
        fontSize: 18,
        marginRight: 10,
        color: "#fb5252",
    },

    infoLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#444",
        flex: 1,
    },

    infoValue: {
        fontSize: 15,
        color: "#666",
    },

    button: {
        backgroundColor: "#fb5252",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#fb5252",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 3,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },

    text: {
        fontSize: 18,
        textAlign: "center",
        color: "#444",
    },
    label: {
        fontSize: 15,
        color: "#555",
        marginBottom: 6,
        marginTop: 10,
        fontWeight: "500",
        },

    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 15,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
}
});
