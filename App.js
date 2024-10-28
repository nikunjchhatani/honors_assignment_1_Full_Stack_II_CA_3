import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Linking, StyleSheet } from 'react-native';

const API_KEY = '5CdFhKY19kh1qQv23xHhuCJTZvzX5brTYbxMZj5J';

export default function App() {
  const [asteroidId, setAsteroidId] = useState('');
  const [asteroidData, setAsteroidData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAsteroidData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${API_KEY}`);
      const data = await response.json();
      setAsteroidData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching asteroid data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (asteroidId) {
      fetchAsteroidData(asteroidId);
    }
  };

  const handleRandomAsteroid = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`);
      const data = await response.json();
      const randomAsteroid = data.near_earth_objects[Math.floor(Math.random() * data.near_earth_objects.length)];
      fetchAsteroidData(randomAsteroid.id);
    } catch (error) {
      console.error('Error fetching random asteroid data:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asteroid Information Finder</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Here"
        value={asteroidId}
        onChangeText={setAsteroidId}
      />
      <Button title="Submit" onPress={handleSubmit} disabled={!asteroidId} />
      <View style={styles.space} />
      <Button title="Random Asteroid" onPress={handleRandomAsteroid} />
      {loading && <ActivityIndicator size="large" color="#e43f5a" style={styles.loading} />}
      {asteroidData && (
        <View style={styles.asteroidInfo}>
          <Text style={styles.infoText}><Text style={styles.bold}>Name:</Text> {asteroidData.name}</Text>
          <Text style={styles.infoText}><Text style={styles.bold}>NASA JPL URL:</Text> 
            <Text style={styles.link} onPress={() => Linking.openURL(asteroidData.nasa_jpl_url)}>
              {asteroidData.nasa_jpl_url}
            </Text>
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Is Potentially Hazardous:</Text> {asteroidData.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#e43f5a',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#1f4068',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#f5f5f5',
  },
  space: {
    height: 10,
  },
  loading: {
    marginTop: 20,
  },
  asteroidInfo: {
    marginTop: 20,
    backgroundColor: '#1f4068',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  infoText: {
    color: '#f5f5f5',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#e43f5a',
    textDecorationLine: 'underline',
  },
});
