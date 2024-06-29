import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const News = () => {
  const navigation = useNavigation();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch news articles from external API
  const fetchNews = async () => {
    try {
      const response = await fetch('https://newsapi.org/v2/everything?q=global_warming&apiKey=5de18280c6a74d2b8f7181ff53bfb130');
      if (!response.ok) {
        throw new Error('Unable to fetch news');
      }
      const data = await response.json();
      setArticles(data.articles.slice(0, 10)); // Displaying the first 10 items
    } catch (error) {
      showAlert();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const navigateToDetail = (url) => {
    Linking.openURL(url);
  };

  const showAlert = () => {
    Alert.alert(
      'Error',
      'Unable to fetch news',
      [
        { text: 'Okay', onPress: () => navigation.navigate('dashboard') }
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Latest News on Climate Change</Text>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#00ff83" />
            <Text style={styles.loaderText}>Fetching latest news...</Text>
          </View>
        ) : (
          articles.map((article, index) => (
            <TouchableOpacity key={index} onPress={() => navigateToDetail(article.url)}>
              <View style={styles.card}>
                <Image resizeMode="cover" source={{ uri: article.urlToImage }} style={styles.cardImg} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{article.title}</Text>
                  <Text style={styles.cardContent}>{article.description}</Text>
                  <View style={styles.metadata}>
                    <Text style={styles.datePublished}>Published: {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  card: {
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
    marginBottom: 16,
  },
  cardImg: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginRight: 16,
  },
  cardBody: {
    paddingVertical: 16,
  },
  cardTitle: {
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 17,
    lineHeight: 24,
    color: '#444',
  },
  metadata: {
    marginTop: 8,
  },
  datePublished: {
    fontSize: 14,
    color: '#888',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loaderText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default News;
