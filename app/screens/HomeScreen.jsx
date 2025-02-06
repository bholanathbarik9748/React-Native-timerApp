import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles/HomeScreenStyles";
import { useIsFocused } from "@react-navigation/native";
import { CategoryTypes } from "../utils/CategoryTypes";
import Icon from "react-native-vector-icons/FontAwesome";
import TimerCard from "../components/TimerCard/TimerCard";

const HomeScreen = ({ navigation }) => {
  const [timers, setTimers] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadTimers = async () => {
      const storedTimers = await AsyncStorage.getItem("timers");
      if (storedTimers) {
        setTimers(JSON.parse(storedTimers));
      }
    };

    if (isFocused) {
      loadTimers();
    }

    return () => {
      timers.forEach((timer) => clearInterval(timer.interval));
    };
  }, [isFocused]);

  useEffect(() => {
    const saveTimers = async () => {
      await AsyncStorage.setItem("timers", JSON.stringify(timers));
    };
    saveTimers();
  }, [timers]);

  const handleToggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const startTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (
          timer.id === id &&
          timer.status !== "Completed" &&
          !timer.interval
        ) {
          const intervalId = setInterval(() => updateTimer(id), 1000);
          return { ...timer, status: "Running", interval: intervalId };
        }
        return timer;
      })
    );
  };

  const pauseTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id === id && timer.status === "Running") {
          clearInterval(timer.interval);
          return { ...timer, status: "Paused", interval: null };
        }
        return timer;
      })
    );
  };

  const resetTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id === id) {
          clearInterval(timer.interval);
          return {
            ...timer,
            remainingTime: timer.duration,
            status: "Paused",
            interval: null,
          };
        }
        return timer;
      })
    );
  };

  const updateTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id === id) {
          if (timer.remainingTime > 0) {
            return { ...timer, remainingTime: timer.remainingTime - 1 };
          } else if (timer.status !== "Completed") {
            clearInterval(timer.interval);
            Alert.alert("Timer Completed", `${timer.name} has finished!`);
            return { ...timer, status: "Completed", interval: null };
          }
        }
        return timer;
      })
    );
  };

  const groupedTimers = CategoryTypes.reduce((acc, category) => {
    acc[category.value] = timers.filter(
      (timer) => timer.category === category.value
    );
    return acc;
  }, {});

  const bulkAction = (action, category) => {
    groupedTimers[category]?.forEach((timer) => {
      if (action === "start" && timer.status !== "Completed")
        startTimer(timer.id);
      if (
        action === "pause" &&
        timer.status !== "Completed" &&
        timer.status === "Running"
      )
        pauseTimer(timer.id);
      if (action === "reset" && timer.status !== "Completed")
        resetTimer(timer.id);
    });
  };

  const renderCategory = ({ item: category }) => (
    <View key={category.value} style={[styles.categoryContainer, { marginBottom: 16 }]}>
      <TouchableOpacity
        onPress={() => handleToggleCategory(category.value)}
        style={styles.categoryHeaderContainer}
      >
        <Text style={styles.categoryHeader}>{category.label}</Text>
        <Icon
          name={expandedCategory === category.value ? "chevron-up" : "chevron-down"}
          size={20}
          color="#fff"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      {expandedCategory === category.value &&
        groupedTimers[category.value]?.length > 0 && (
          <>
            <View style={[styles.bulkActions, { marginVertical: 8 }]}>
              <Button
                title="Start All"
                onPress={() => bulkAction("start", category.value)}
                color="#32CD32"
              />
              <Button
                title="Pause All"
                onPress={() => bulkAction("pause", category.value)}
                color="#FFA500"
              />
              <Button
                title="Reset All"
                onPress={() => bulkAction("reset", category.value)}
                color="#FF4500"
              />
            </View>

            <FlatList
              contentContainerStyle={{ padding: 8 }}
              data={groupedTimers[category.value]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                item.status !== "Completed" && (
                  <View style={{ marginBottom: 8 }}>
                    <TimerCard
                      item={item}
                      pauseTimer={pauseTimer}
                      resetTimer={resetTimer}
                      startTimer={startTimer}
                    />
                  </View>
                )
              }
            />
          </>
        )}
    </View>
  );

  return (
    <View style={[styles.container, { padding: 16 }]}>
      <View style={[styles.btnContainer, { marginBottom: 12 }]}>
        <Button
          style={styles.actionBtn}
          title="Add Timer"
          onPress={() => navigation.navigate("AddTimer")}
          color="#ff6347"
        />
        <Button
          title="History Timer"
          onPress={() => navigation.navigate("History")}
          color="#ff6347"
        />
      </View>

      <FlatList
        data={CategoryTypes}
        renderItem={renderCategory}
        keyExtractor={(item) => item.value}
      />
    </View>
  );
};

export default HomeScreen;
