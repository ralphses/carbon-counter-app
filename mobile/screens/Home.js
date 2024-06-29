import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Swiper from 'react-native-swiper';
import db from '../database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to EcoChange!',
    message: 'Join us in our mission to promote renewable energy and reduce carbon emissions.',
    action: 'Get started',
  },
  {
    title: 'The future is green',
    message:
      'Discover how we can harness the power of renewable resources to create a sustainable future for all.',
    action: 'Continue',
  },
  {
    title: "Here's the great news",
    message:
      'Start making a difference today by creating your account and contributing to a cleaner planet.',
    action: 'Create your account',
  },
];

export default function Home({ navigation }) {
  const [slide, setSlide] = useState(0);
  const [userExists, setUserExists] = useState(false); // State to track if user exists in db

  const swiper = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check if user exists in the database when component mounts
    const checkUser = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('user');
        if (userEmail) {
          const user = await db.findUserByEmail(userEmail); // Adjust function name based on your database implementation

          setUserExists(true);

          // User exists, navigate to dashboard
          navigation.navigate('dashboard', { user });
        } else {
          // User doesn't exist
          setUserExists(false);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };

    checkUser();
  }, []); // Empty dependency array to run only once when component mounts

  const animatedBackgroundLeft = scrollX.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1, 0, -1],
  });

  const contentOpacityRanges = Array.from({ length: slides.length }).reduce(
    (acc, _, index) => {
      const screenWidth = index * width;
      const screenWidthMiddle = screenWidth + width / 2;

      acc.inputRange.push(screenWidth, screenWidthMiddle);
      acc.outputRange.push(1, 0.2);

      return acc;
    },
    {
      inputRange: [],
      outputRange: [],
    },
  );
  const contentOpacity = scrollX.interpolate(contentOpacityRanges);

  const handleButtonPress = (action) => {
    if (action === 'Create your account') {
      navigation.navigate('signup');
    } else {
      swiper.current.scrollTo(slide + 1, true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={{ left: animatedBackgroundLeft }}>
        <Image
          source={require('../assets/home.png')}
          resizeMode="contain"
          style={styles.slideImage}
        />
      </Animated.View>
      <Swiper
        ref={swiper}
        showsPagination={false}
        loop={false}
        scrollEnabled={false}
        onIndexChanged={setSlide}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={1}>
        {slides.map((item, index) => {
          return (
            <Animated.View
              key={index}
              style={[styles.slide, { opacity: contentOpacity }]}>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideText}>{item.message}</Text>

              <TouchableOpacity
                onPress={() => handleButtonPress(item.action)}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>{item.action}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Swiper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1f26',
  },
  slide: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    justifyContent: 'flex-end',
    paddingHorizontal: 36,
  },
  slideImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  slideText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a9b1cf',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 36,
    marginVertical: 48,
    height: 60,
    width: 325,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0E321D',
    textAlign: 'center',
  },
});
