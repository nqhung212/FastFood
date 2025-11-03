import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header chính
  headerContainer: {
    backgroundColor: "#fb5252ff",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Phần filter (danh mục món)
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginVertical: 15,
  },
  filterButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  filterButtonActive: {
    backgroundColor: "#fb5252ff",
  },
  filterText: {
    fontWeight: "600",
    color: "#444",
  },
  filterTextActive: {
    color: "#fff",
  },

  // Tiêu đề phần món
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fb5252ff",
    marginLeft: 16,
    marginTop: 10,
    marginBottom: 12,
    textTransform: "uppercase",
  },

  // Card món ăn
  itemContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
  itemName: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 15,
    color: "#000",
    textAlign: "center",
  },
  itemPrice: {
    marginTop: 5,
    color: "#fb5252ff",
    fontWeight: "700",
    fontSize: 16,
  },
});
