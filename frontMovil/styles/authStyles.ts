import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    logo: {
        width: 180,
        height: 80,
        marginBottom: 20
    },
    card: {
        width: "85%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: "#333"
    },
    button: {
        backgroundColor: "#a50000",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    link: {
        color: "#000",
        textDecorationLine: "underline",
        marginTop: 8
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    iconImage: {
        width: 20,
        height: 20,
        marginRight: 8,
        resizeMode: "contain",
    },
    input: {
        flex: 1,
        paddingVertical: 8,
    },
});