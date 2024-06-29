import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

const NewsDetail = ({ route }) => {
  const { newsId } = route.params;
  const [news, setNews] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await fetch(`https://your-api-url.com/news/${newsId}`);
        if (!response.ok) {
          throw new Error('Unable to fetch news details');
        }
        const data = await response.json();
        setNews(data);
        setLoading(false);
      } catch (error) {
        Alert.alert(
            'Error',
            'Unable to fetch news',
            [
              { text: 'Okay', onPress: () => navigation.navigate('news') }
            ],
            { cancelable: false }
          );
      }
    };

    fetchNewsDetails();
  }, [newsId]);

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const addComment = () => {
    if (comment.trim() !== '') {
      setComments([...comments, { id: comments.length + 1, text: comment }]);
      setComment('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          <Text style={styles.title}>{news.title}</Text>
          <Image source={{ uri: news.mainImage }} style={styles.mainImage} resizeMode="cover" />
          <Text style={styles.content}>{news.content}</Text>
          <Text style={styles.metadata}>Published: {news.datePublished}</Text>
          <Text style={styles.metadata}>Views: {news.views}</Text>
          <Text style={styles.metadata}>Author: {news.author}</Text>
          <Text style={styles.commentHeading}>Comments</Text>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
          />
          <View style={styles.commentForm}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add your comment..."
              value={comment}
              onChangeText={handleCommentChange}
              multiline
            />
            <TouchableOpacity style={styles.commentButton} onPress={addComment}>
              <Text style={styles.commentButtonText}>Comment</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  content: {
    fontSize: 18,
    marginBottom: 16,
  },
  metadata: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  commentHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  commentItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  commentText: {
    fontSize: 16,
  },
  commentForm: {
    marginTop: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    minHeight: 80,
  },
  commentButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NewsDetail;
