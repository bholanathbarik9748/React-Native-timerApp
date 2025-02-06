import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    timerCard: {
        marginBottom: 20,
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#ddd",
    },
    timerName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    timerDetails: {
        fontSize: 16,
        color: "#555",
    },
    timerStatus: {
        fontSize: 16,
        color: "#777",
    },
    timerControls: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    progressContainer: {
        height: 1,
        width: "100%",
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
        marginTop: 10,
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#4caf50",
        borderRadius: 5,
    },
});
