import React, { useState, useEffect } from 'react';
import { LineChart } from "react-native-gifted-charts";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../database'; // Import your database module

// Function to truncate description to not more than 20 words
function truncateDescription(description) {
  const words = description.split(' ');
  if (words.length > 16) {
    return `${words.slice(0, 16).join(' ')}...`;
  }
  return description;
}

// Dashboard component
export default function Dashboard({ navigation }) {
  const [profileData, setProfileData] = useState(null);
  const [carbonFootPrintData, setCarbonFootPrintData] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data from AsyncStorage and carbon footprints from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('user');
        
        if (!userEmail) {
          Alert.alert(
            'Error',
            'Session expired. Login again',
            [
              { text: 'Okay', onPress: () => navigation.navigate('login') }
            ],
            { cancelable: false }
          );
          return;
        }

        const profile = await db.fetchProfileData(userEmail);
        setProfileData(profile);
        setCarbonFootPrintData(profile.carbonFootPrints || []);

      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'Failed to fetch user profile. Please try again later.');
      }
    };

    fetchUserData();
  }, []);

  // Fetch news items from API
  useEffect(() => {
    const fetchNewsData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://newsapi.org/v2/everything?q=global_warming&apiKey=5de18280c6a74d2b8f7181ff53bfb130');
        const data = await response.json();
        setNewsItems(data.articles.slice(0, 2));
      } catch (error) {
        console.error('Error fetching news data:', error);
        Alert.alert('Error', 'Failed to fetch news data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerBadge}>
              {new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                weekday: 'long',
              })}
            </Text>
            <Text style={styles.headerTitle}>Hi, {profileData ? profileData.name : 'User'}!</Text>
            <TouchableOpacity onPress={() => navigation.navigate('profile', { profileData })}>
              <Image
                source={{
                  uri: profileData ? profileData.avatar : 'https://via.placeholder.com/150',
                }}
                style={styles.avatarImg}
              />
            </TouchableOpacity>
          </View>

          {/* Balance */}
          <View style={styles.balance}>
            <Text style={styles.balanceTitle}>Average Carbon Footprint</Text>
            <Text style={styles.balanceValue}>
              {profileData && profileData.averageCarbonFootPrint ? profileData.averageCarbonFootPrint.toFixed(2) : '0.00'}
            </Text>
          </View>

          {/* Placeholder for LineChart */}
          <View style={styles.placeholder}>
            <View style={styles.placeholderInset}>
              {/* LineChart */}
              <LineChart
                data={carbonFootPrintData}
                width={300}
                height={250}
                hideDataPoints={false}
                color="#00ff83"
                thickness={2}
                yAxisColor="gray"
                xAxisColor="gray"
                style={styles.chart}
                renderDotContent={({ x, y, value }) => (
                  <View style={styles.chartDot}>
                    <Text style={styles.chartDotText}>{value}</Text>
                  </View>
                )}
              />
            </View>
          </View>

          {/* Latest News */}
          <View style={styles.send}>
            <Text style={styles.sendTitle}>Latest News</Text>
            {/* Loader */}
            {isLoading ? (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#00ff83" />
                <Text style={styles.loaderText}>Fetching latest news...</Text>
              </View>
            ) : (
              newsItems.map(({ title, publishedAt, description, url }, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => Linking.openURL(url)}
                >
                  <View style={styles.newsItem}>
                    <View style={styles.newsItemContent}>
                      <Text style={styles.newsItemTitle}>{title}</Text>
                      <Text style={styles.newsItemDate}>{new Date(publishedAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</Text>
                      <Text style={styles.newsItemDescription}>
                        {truncateDescription(description)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
            {/* View All link */}
            <TouchableOpacity onPress={() => navigation.navigate('news')}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Calculate Carbon Footprint Button */}
          <TouchableOpacity style={styles.calculateButton} onPress={() => navigation.navigate('calculator')}>
            <Text style={styles.calculateButtonText}>Calculate Carbon Footprint</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerBadge: {
    fontSize: 15,
    fontWeight: '400',
    color: '#a3a3a3',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#121212',
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 9999,
  },
  balance: {
    backgroundColor: '#0E321D',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'yellow',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  placeholder: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    height: 250,
    marginBottom: 24,
  },
  placeholderInset: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  send: {
    marginBottom: 24,
  },
  sendTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  newsItemContent: {
    flex: 1,
  },
  newsItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  newsItemDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  newsItemDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'right',
  },
  calculateButton: {
    backgroundColor: '#0E321D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 36,
    marginBottom: 20,
    alignItems: 'center',
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  chart: {
    flex: 1,
  },
  chartDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00ff83',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartDotText: {
    fontSize: 12,
    color: 'white',
  },
  loader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  loaderText: {
    fontSize: 16,
    marginLeft: 8,
  },
});
