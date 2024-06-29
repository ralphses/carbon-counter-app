import React, { useState } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, SafeAreaView, StyleSheet, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import db from '../database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CarbonCalculator = ({ navigation }) => {
  const [form, setForm] = useState({
    // Transportation
    distanceTraveled: '',
    fuelType: '',
    vehicleEfficiency: '',
    frequencyOfTravel: '',
    // Energy Consumption
    electricityUsage: '',
    heatingFuelUsage: '',
    typeOfHeating: '',
    applianceEfficiency: '',
    // Travel and Commuting
    modeOfTransportation: '',
    distanceTraveledForCommute: '',
    frequencyOfCommute: '',
    typeOfCommute: '',
  });

  const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Other'];
  const heatingTypes = ['Electric', 'Gas', 'Oil', 'Wood', 'Other'];
  const commuteTypes = ['Personal Vehicle', 'Public Transport', 'Walking', 'Cycling', 'Other'];

  const calculateCarbonFootprint = () => {
    // Calculate carbon footprint based on form inputs
    let carbonFootprint = 0;

    // Formula for example (you can adjust this based on your actual calculations)
    carbonFootprint +=
      parseFloat(form.distanceTraveled) *
      parseFloat(form.vehicleEfficiency) *
      parseFloat(form.frequencyOfTravel);

    carbonFootprint +=
      parseFloat(form.electricityUsage) +
      parseFloat(form.heatingFuelUsage) +
      parseFloat(form.applianceEfficiency);

    // Assuming a basic calculation for demonstration purposes
    return carbonFootprint;
  };

  const handleSubmit = async () => {
    // Perform form validation here
    if (!form.distanceTraveled || isNaN(parseFloat(form.distanceTraveled))) {
      alert('Please enter a valid distance traveled.');
      return;
    }
    if (!form.fuelType) {
      alert('Please select a fuel type.');
      return;
    }
    if (!form.vehicleEfficiency || isNaN(parseFloat(form.vehicleEfficiency))) {
      alert('Please enter a valid vehicle efficiency.');
      return;
    }
    if (!form.frequencyOfTravel || isNaN(parseFloat(form.frequencyOfTravel))) {
      alert('Please enter a valid frequency of travel.');
      return;
    }
    if (!form.electricityUsage || isNaN(parseFloat(form.electricityUsage))) {
      alert('Please enter a valid electricity usage.');
      return;
    }
    if (!form.heatingFuelUsage || isNaN(parseFloat(form.heatingFuelUsage))) {
      alert('Please enter a valid heating fuel usage.');
      return;
    }
    if (!form.applianceEfficiency || isNaN(parseFloat(form.applianceEfficiency))) {
      alert('Please enter a valid appliance efficiency.');
      return;
    }
    if (!form.modeOfTransportation) {
      alert('Please select a mode of transportation.');
      return;
    }
    if (!form.distanceTraveledForCommute || isNaN(parseFloat(form.distanceTraveledForCommute))) {
      alert('Please enter a valid distance traveled for commute.');
      return;
    }
    if (!form.frequencyOfCommute || isNaN(parseFloat(form.frequencyOfCommute))) {
      alert('Please enter a valid frequency of commute.');
      return;
    }
    if (!form.typeOfCommute) {
      alert('Please select a type of commute.');
      return;
    }

    // Calculate carbon footprint
    const newCarbonFootprint = calculateCarbonFootprint();

    // Update user's profile in the database
    const userEmail = await AsyncStorage.getItem('user') // Example: Fetch from AsyncStorage or route params
    const user = await db.findUserByEmail(userEmail);

    if (user) {
      console.log(user)
      db.addCarbonFootPrint(user.id, newCarbonFootprint, new Date().toISOString());
    
      // Simulate API-like success response
      Alert.alert('Success', 'Carbon footprint calculated and updated successfully!');
    } else {
      Alert.alert('Error', 'User not found.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/counter-bg.jpg')}
        style={styles.hero}
      />

      {/* Transportation Section */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Transportation</Text>
        <TextInput
          style={styles.input}
          placeholder="Distance Traveled (miles/kilometers)"
          value={form.distanceTraveled}
          onChangeText={(text) => setForm({ ...form, distanceTraveled: text })}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={form.fuelType}
          style={[styles.input, styles.picker]}
          onValueChange={(itemValue) => setForm({ ...form, fuelType: itemValue })}
        >
          <Picker.Item label="Select Fuel Type" value="" />
          {fuelTypes.map((fuelType, index) => (
            <Picker.Item key={index} label={fuelType} value={fuelType} />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Vehicle Efficiency (miles per gallon)"
          value={form.vehicleEfficiency}
          onChangeText={(text) => setForm({ ...form, vehicleEfficiency: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Frequency of Travel"
          value={form.frequencyOfTravel}
          onChangeText={(text) => setForm({ ...form, frequencyOfTravel: text })}
          keyboardType="numeric"
        />
      </View>

      {/* Energy Consumption Section */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Energy Consumption</Text>
        <TextInput
          style={styles.input}
          placeholder="Electricity Usage (kilowatt-hours)"
          value={form.electricityUsage}
          onChangeText={(text) => setForm({ ...form, electricityUsage: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Heating Fuel Usage"
          value={form.heatingFuelUsage}
          onChangeText={(text) => setForm({ ...form, heatingFuelUsage: text })}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={form.typeOfHeating}
          style={styles.input}
          onValueChange={(itemValue) => setForm({ ...form, typeOfHeating: itemValue })}
        >
          <Picker.Item label="Select Heating Type" value="" />
          {heatingTypes.map((heatingType, index) => (
            <Picker.Item key={index} label={heatingType} value={heatingType} />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Appliance Efficiency"
          value={form.applianceEfficiency}
          onChangeText={(text) => setForm({ ...form, applianceEfficiency: text })}
          keyboardType="numeric"
        />
      </View>

      {/* Travel and Commuting Section */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Travel and Commuting</Text>
        <Picker
          selectedValue={form.modeOfTransportation}
          style={styles.input}
          onValueChange={(itemValue) => setForm({ ...form, modeOfTransportation: itemValue })}
        >
          <Picker.Item label="Select Mode of Transportation" value="" />
          {commuteTypes.map((modeOfTransportation, index) => (
            <Picker.Item key={index} label={modeOfTransportation} value={modeOfTransportation} />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Distance Traveled for Commute (miles/kilometers)"
          value={form.distanceTraveledForCommute}
          onChangeText={(text) => setForm({ ...form, distanceTraveledForCommute: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Frequency of Commute"
          value={form.frequencyOfCommute}
          onChangeText={(text) => setForm({ ...form, frequencyOfCommute: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Type of Commute"
          value={form.typeOfCommute}
          onChangeText={(text) => setForm({ ...form, typeOfCommute: text })}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Calculate Carbon Footprint</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
    paddingBottom: 120,
  },
  hero: {
    width: '100%',
    height: 180,
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1d1d1d',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
  },

  picker: {
    backgroundColor: '#ffffff', // Background color of the picker
    borderRadius: 8, // Border radius of the picker
    marginBottom: 8, // Spacing at the bottom
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'green',
    marginHorizontal: 16,
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CarbonCalculator;
