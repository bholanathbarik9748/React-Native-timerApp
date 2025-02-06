import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles/HomeScreenStyles";
import { useIsFocused } from "@react-navigation/native";
import { CategoryTypes } from "../utils/CategoryTypes";
import Icon from "react-native-vector-icons/FontAwesome";

const HistoryScreen = () => {
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

  const handleToggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const groupedTimers = CategoryTypes.reduce((acc, category) => {
    acc[category.value] = timers.filter(
      (timer) =>
        timer.category === category.value && timer.status === "Completed"
    );
    return acc;
  }, {});

  const renderCategory = ({ item: category }) => (
    <View key={category.value} style={styles.categoryContainer}>
      <TouchableOpacity
        onPress={() => handleToggleCategory(category.value)}
        style={styles.categoryHeaderContainer}
      >
        <Text style={styles.categoryHeader}>{category.label}</Text>
        <Icon
          name={
            expandedCategory === category.value ? "chevron-up" : "chevron-down"
          }
          size={20}
          color="#fff"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      {expandedCategory === category.value && (
        <FlatList
          data={groupedTimers[category.value]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.timerCard}>
              <Text style={styles.timerName}>{item.name}</Text>
              <Text style={styles.timerDetails}>
                Total duration: {item.duration} Seconds
              </Text>
              <Text style={styles.timerDetails}>
                Remaining Time: {item.remainingTime} Seconds
              </Text>
              <Text style={styles.timerStatus}>Status: {item.status}</Text>
            </View>
          )}
          scrollEnabled={false}
        />
      )}
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={CategoryTypes}
      renderItem={renderCategory}
      keyExtractor={(item) => item.value}
    />
  );
};

export default HistoryScreen;
