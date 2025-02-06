import React from "react";
import { View, Text, Button, ProgressBarAndroid, Platform } from "react-native";
import { styles } from "../../styles/HomeScreenStyles";

const TimerCard = ({ item, startTimer, pauseTimer, resetTimer }) => {
    const percentage = (item.remainingTime / item.duration) * 100;

    return (
        <View style={styles.timerCard}>
            <Text style={styles.timerName}>{item.name} Progress - {Math.round(percentage)}%</Text>
            <Text style={styles.timerDetails}>Total duration: {item.duration} Seconds</Text>
            <Text style={styles.timerDetails}>Remaining Time: {item.remainingTime} Seconds</Text>
            <Text style={styles.timerStatus}>Status: {item.status}</Text>

            <View style={styles.timerControls}>
                {item.status !== "Running" && (
                    <Button title="Start" onPress={() => startTimer(item.id)} />
                )}
                {item.status === "Running" && (
                    <Button title="Pause" onPress={() => pauseTimer(item.id)} />
                )}
                <Button title="Reset" onPress={() => resetTimer(item.id)} />
            </View>
        </View>
    );
};

export default TimerCard;
