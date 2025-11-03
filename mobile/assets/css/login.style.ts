import { StyleSheet } from "react-native";

export   const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    },
    logo: {
    width: 120,
    height: 120,
    marginBottom: 0,
    },
    title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    },
    input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    },
    button: {
    width: '100%',
    backgroundColor: '#FF6347',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    },
    buttonText: {
    color: '#fff',
    fontWeight: '600',
    },
    link: {
    color: '#FF6347',
    fontWeight: '600',
    },
    row: {
    flexDirection: 'row',
    marginTop: 20,
    },
});