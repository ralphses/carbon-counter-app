import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../database'; // Ensure the correct path to your database file

export default function Profile({ navigation, route }) {
  // Initialize form state with profile data if available
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    noOfVehicles: '',
    noOfMotocycles: '',
    noOfGenerators: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    noOfVehicles: '',
    noOfMotocycles: '',
    noOfGenerators: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const profile = await db.fetchProfileData(user);
          setForm(profile);
          setUserData(profile);
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Unable to fetch profile data');
      }
    };
    fetchProfileData();
  }, []);

  console.log(userData);


  const updateProfile = async () => {
    try {
      // Assuming user email is unique and used as identifier
      const user = form.email;
      // Update the in-memory database
      db.profileData[user] = { ...form };

      // Simulate a delay for the update process
      setTimeout(() => {
        Alert.alert('Profile updated successfully!');
      }, 1000);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('user');
      if (token) {
        await AsyncStorage.clear();
        navigation.navigate('login');
      } else {
        Alert.alert('Error', 'No token found');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to logout');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.profile}>
          {/* Profile Header */}
          <View>
            <Text style={styles.profileName}>{form.name}</Text>
            <Text style={styles.profileAddress}>{form.address}</Text>
          </View>
        </View>

        {/* Personal Information Section */}
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <TextInput
              style={styles.inputField}
              placeholder="Name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Email"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Phone Number"
              keyboardType="numeric"
              value={form.phone}
              onChangeText={(text) => setForm({ ...form, phone: text })}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Address"
              value={form.address}
              onChangeText={(text) => setForm({ ...form, address: text })}
            />
          </View>

          {/* Vehicles and Gadgets Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicles and Gadgets</Text>

            <TextInput
              style={styles.inputField}
              placeholder="Number of Vehicles"
              keyboardType="numeric"
              value={userData.noOfVehicles}
              onChangeText={(text) => setForm({ ...form, noOfVehicles: text })}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Number of Motorcycles"
              keyboardType="numeric"
              value={userData.noOfMotocycles}
              onChangeText={(text) => setForm({ ...form, noOfMotocycles: text })}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Number of Gasoline Generators"
              keyboardType="numeric"
              value={userData.noOfGenerators}
              onChangeText={(text) => setForm({ ...form, noOfGenerators: text })}
            />
          </View>

          {/* Password Update Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Password Update</Text>

            <TextInput
              style={styles.inputField}
              placeholder="Current Password"
              secureTextEntry={true}
              value={form.currentPassword}
              onChangeText={(text) => setForm({ ...form, currentPassword: text })}
            />
            <TextInput
              style={styles.inputField}
              placeholder="New Password"
              secureTextEntry={true}
              value={form.newPassword}
              onChangeText={(text) => setForm({ ...form, newPassword: text })}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Confirm New Password"
              secureTextEntry={true}
              value={form.confirmNewPassword}
              onChangeText={(text) => setForm({ ...form, confirmNewPassword: text })}
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => { navigation.navigate('dashboard') }}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton} onPress={updateProfile}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  profile: {
    padding: 24,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAction: {
    position: 'absolute',
    right: -4,
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: '#007bff',
  },
  profileName: {
    fontSize: 19,
    fontWeight: '600',
    color: '#414d63',
    textAlign: 'center',
    marginBottom: 5,
  },
  profileAddress: {
    fontSize: 16,
    color: '#989898',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  updateButton: {
    backgroundColor: '#0E321D',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  logoutButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 10,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
