import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UUID from "react-native-uuid";
import { Picker } from '@react-native-picker/picker';
import { styles } from "../styles/AddTimerStyles";
import { CategoryTypes } from '../utils/CategoryTypes'

const AddTimerScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    category: "",
  });

  const handleChange = (field, value) => {
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleSaveTimer = async () => {
    const { name, duration, category } = formData;

    if (!name || !duration || !category) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    const parsedDuration = parseInt(duration);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      Alert.alert("Validation Error", "Please enter a valid duration in seconds.");
      return;
    }

    const newTimer = {
      id: UUID.v4(),
      name,
      duration: parsedDuration,
      remainingTime: parsedDuration,
      category,
      status: "Paused",
    };

    try {
      const storedTimers = await AsyncStorage.getItem("timers");
      const timers = storedTimers ? JSON.parse(storedTimers) : [];
      timers.push(newTimer);
      await AsyncStorage.setItem("timers", JSON.stringify(timers));
      Alert.alert("Success", "Timer saved successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving timer", error);
      Alert.alert("Error", "Failed to save the timer.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Timer</Text>

      <TextInput
        style={styles.input}
        placeholder="Timer Name"
        value={formData.name}
        onChangeText={(value) => handleChange("name", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (in seconds)"
        value={formData.duration}
        keyboardType="numeric"
        onChangeText={(value) => handleChange("duration", value)}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.category}
          style={styles.picker}
          onValueChange={(value) => handleChange("category", value)}
        >
          {/* Placeholder item */}
          <Picker.Item label="Select a category" value="" color="#888" />

          {CategoryTypes.map((category, index) => (
            <Picker.Item key={index} label={category.label} value={category.value} />
          ))}
        </Picker>
      </View>

      <Button title="Save Timer" onPress={handleSaveTimer} color="#FF5733" />
    </View>
  );
};

export default AddTimerScreen;
