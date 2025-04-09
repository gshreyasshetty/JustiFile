import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Card, Title, Paragraph, Text, Searchbar, ActivityIndicator } from 'react-native-paper';
import { legalActsData } from '../data/legalActsData';

const SearchResultsScreen = ({ route, navigation }) => {
  const { query } = route.params;
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchLegalActs(query);
  }, [query]);

  const searchLegalActs = (searchText) => {
    setLoading(true);
    
    // Simulate a search delay
    setTimeout(() => {
      const filteredResults = legalActsData.filter(act => {
        const searchTermLower = searchText.toLowerCase();
        // Search in title, description and keywords
        return (
          act.title.toLowerCase().includes(searchTermLower) ||
          act.description.toLowerCase().includes(searchTermLower) ||
          (act.keywords && act.keywords.some(keyword => 
            keyword.toLowerCase().includes(searchTermLower)
          ))
        );
      });
      
      setResults(filteredResults);
      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    searchLegalActs(searchQuery);
  };

  const renderActItem = ({ item }) => (
    <Card 
      style={styles.card}
      onPress={() => navigation.navigate('ActDetails', { 
        id: item.id,
        title: item.title
      })}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph numberOfLines={2}>{item.description}</Paragraph>
        {item.relevance && (
          <View style={styles.relevanceContainer}>
            <Text style={styles.relevanceText}>Relevance: {item.relevance}</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Refine your search..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        onSubmitEditing={handleSearch}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={40} color="#1e40af" />
          <Text style={styles.loadingText}>Searching legal database...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.resultsText}>
            {results.length} results found for "{query}"
          </Text>
          
          {results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={renderActItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No legal acts found matching your query.
              </Text>
              <Text>
                Try using different keywords or browse popular acts from the home screen.
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  resultsText: {
    marginBottom: 10,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
  },
  relevanceContainer: {
    marginTop: 8,
  },
  relevanceText: {
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default SearchResultsScreen;
