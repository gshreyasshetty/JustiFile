import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Button, Chip } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = () => {
    navigation.navigate('SearchResults', { query: searchQuery });
  };

  const commonSituations = [
    "Property Dispute",
    "Domestic Violence",
    "Consumer Rights",
    "Traffic Violation",
    "Employment Issue",
    "Cybercrime"
  ];

  const commonActs = [
    {
      id: 1,
      title: "Indian Penal Code",
      description: "The main criminal code of India that covers all substantive aspects of criminal law.",
      year: "1860"
    },
    {
      id: 2,
      title: "Constitution of India",
      description: "The supreme law of India that establishes the framework for governance and fundamental rights.",
      year: "1950"
    },
    {
      id: 3,
      title: "Code of Criminal Procedure",
      description: "The main legislation on procedure for administration of criminal law in India.",
      year: "1973"
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/law-logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Describe your legal situation..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          onSubmitEditing={handleSearch}
        />
        <Button 
          mode="contained" 
          onPress={handleSearch}
          style={styles.searchButton}
        >
          Search
        </Button>
      </View>
      
      <View style={styles.chipContainer}>
        <Paragraph style={styles.sectionTitle}>Common Situations:</Paragraph>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {commonSituations.map((situation, index) => (
            <Chip 
              key={index} 
              mode="outlined" 
              style={styles.chip}
              onPress={() => navigation.navigate('SearchResults', { query: situation })}
            >
              {situation}
            </Chip>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.actsContainer}>
        <Paragraph style={styles.sectionTitle}>Popular Legal Acts:</Paragraph>
        {commonActs.map(act => (
          <Card 
            key={act.id}
            style={styles.card}
            onPress={() => navigation.navigate('ActDetails', { 
              id: act.id,
              title: act.title
            })}
          >
            <Card.Content>
              <Title>{act.title} ({act.year})</Title>
              <Paragraph>{act.description}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    marginBottom: 10,
    elevation: 2,
  },
  searchButton: {
    marginTop: 5,
  },
  chipContainer: {
    padding: 16,
    paddingTop: 0,
  },
  chipScroll: {
    flexDirection: 'row',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
});

export default HomeScreen;
