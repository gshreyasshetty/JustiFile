import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, TouchableOpacity, 
  TextInput, Image, FlatList, StatusBar, ActivityIndicator
} from 'react-native';
import { legalActsData } from './data/legalActsData';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [selectedAct, setSelectedAct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigateToHome = () => {
    setCurrentScreen('Home');
    setSelectedAct(null);
  };
  
  const navigateToActDetails = (act) => {
    setSelectedAct(act);
    setCurrentScreen('ActDetails');
  };
  
  const performSearch = (query) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setCurrentScreen('SearchResults');
    
    // Simulate search delay
    setTimeout(() => {
      const results = legalActsData.filter(act => {
        const searchLower = query.toLowerCase();
        
        // Check title, description, and keywords
        const titleMatch = act.title.toLowerCase().includes(searchLower);
        const descMatch = act.description.toLowerCase().includes(searchLower);
        const keywordMatch = act.keywords && act.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchLower)
        );
        
        // Check sections content if available
        const sectionMatch = act.sections && act.sections.some(section => 
          section.title.toLowerCase().includes(searchLower) || 
          section.content.toLowerCase().includes(searchLower)
        );
        
        // Check case laws if available
        const caseMatch = act.relevantCases && act.relevantCases.some(caseItem => 
          caseItem.title.toLowerCase().includes(searchLower) || 
          caseItem.description.toLowerCase().includes(searchLower)
        );
        
        return titleMatch || descMatch || keywordMatch || sectionMatch || caseMatch;
      })
      // Add relevance score and sort by it
      .map(act => {
        let score = 0;
        const searchLower = query.toLowerCase();
        
        // Higher score for title matches
        if (act.title.toLowerCase().includes(searchLower)) score += 10;
        
        // Medium score for description and keywords
        if (act.description.toLowerCase().includes(searchLower)) score += 5;
        if (act.keywords && act.keywords.some(k => k.toLowerCase().includes(searchLower))) score += 7;
        
        // Lower score for section matches
        if (act.sections && act.sections.some(s => s.title.toLowerCase().includes(searchLower))) score += 3;
        if (act.sections && act.sections.some(s => s.content.toLowerCase().includes(searchLower))) score += 2;
        
        // Lower score for case matches
        if (act.relevantCases && act.relevantCases.some(c => c.title.toLowerCase().includes(searchLower))) score += 3;
        
        return { ...act, relevanceScore: score };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      setSearchResults(results);
      setIsLoading(false);
    }, 500);
  };
  
  // Render the home screen
  const renderHome = () => {
    const commonSituations = [
      "Property Dispute",
      "Domestic Violence",
      "Consumer Rights",
      "Traffic Violation",
      "Employment Issue",
      "Cybercrime",
      "Rent Control",
      "Family Inheritance",
      "Medical Negligence",
      "Land Encroachment",
      "Business Contract",
      "Environmental Complaint"
    ];
    
    // Group situations by category for better organization
    const categorizedSituations = {
      "Personal": ["Domestic Violence", "Family Inheritance"],
      "Property": ["Property Dispute", "Land Encroachment", "Rent Control"],
      "Professional": ["Employment Issue", "Business Contract", "Medical Negligence"],
      "Consumer": ["Consumer Rights", "Traffic Violation"],
      "Digital": ["Cybercrime"],
      "Environment": ["Environmental Complaint"]
    };
    
    // Get first 3 acts for popular section
    const popularActs = legalActsData.slice(0, 3);
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>JustiFile</Text>
          <Text style={styles.headerSubtitle}>Indian Legal Acts Reference</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Describe your legal situation..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => performSearch(searchQuery)}
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => performSearch(searchQuery)}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Common Situations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.situationsContainer}>
          {commonSituations.map((situation, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.situationChip}
              onPress={() => {
                setSearchQuery(situation);
                performSearch(situation);
              }}
            >
              <Text style={styles.situationChipText}>{situation}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Text style={styles.sectionTitle}>Popular Legal Acts</Text>
        {popularActs.map(act => (
          <TouchableOpacity
            key={act.id}
            style={styles.actCard}
            onPress={() => navigateToActDetails(act)}
          >
            <Text style={styles.actCardTitle}>{act.title} ({act.year})</Text>
            <Text style={styles.actCardDescription} numberOfLines={2}>
              {act.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  
  // Render the act details screen
  const renderActDetails = () => {
    if (!selectedAct) return null;
    
    return (
      <View style={styles.container}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity onPress={navigateToHome} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailsTitle} numberOfLines={1}>{selectedAct.title}</Text>
        </View>
        
        <ScrollView style={styles.detailsContainer}>
          <View style={styles.detailsCard}>
            <Text style={styles.actYear}>Year: {selectedAct.year}</Text>
            <Text style={styles.actDescription}>{selectedAct.description}</Text>
            
            {selectedAct.keyFeatures && (
              <>
                <Text style={styles.sectionHeader}>Key Features</Text>
                {selectedAct.keyFeatures.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureText}>• {feature}</Text>
                  </View>
                ))}
              </>
            )}
            
            {selectedAct.sections && selectedAct.sections.length > 0 && (
              <>
                <Text style={styles.sectionHeader}>Important Sections</Text>
                {selectedAct.sections.map((section, index) => (
                  <View key={index} style={styles.sectionItem}>
                    <Text style={styles.sectionNumber}>Section {section.number}</Text>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.sectionContent}>{section.content}</Text>
                  </View>
                ))}
              </>
            )}
            
            {selectedAct.relevantCases && selectedAct.relevantCases.length > 0 && (
              <>
                <Text style={styles.sectionHeader}>Relevant Case Laws</Text>
                {selectedAct.relevantCases.map((caseItem, index) => (
                  <View key={index} style={styles.caseItem}>
                    <Text style={styles.caseTitle}>{caseItem.title}</Text>
                    <Text style={styles.caseDescription}>{caseItem.description}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };
  
  // Render search results screen
  const renderSearchResults = () => {
    return (
      <View style={styles.container}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity onPress={navigateToHome} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailsTitle}>Search Results</Text>
        </View>
        
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Refine your search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => performSearch(searchQuery)}
          />
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={40} color="#1e40af" />
            <Text style={styles.loadingText}>Searching legal database...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {searchResults.length} results found for "{searchQuery}"
            </Text>
            
            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.searchResultCard}
                    onPress={() => navigateToActDetails(item)}
                  >
                    <Text style={styles.searchResultTitle}>{item.title}</Text>
                    <Text style={styles.searchResultDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.searchResultsList}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
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
  
  // Main render function
  let content;
  switch (currentScreen) {
    case 'ActDetails':
      content = renderActDetails();
      break;
    case 'SearchResults':
      content = renderSearchResults();
      break;
    default:
      content = renderHome();
  }
  
  return (
    <>
      <StatusBar backgroundColor="#1e40af" barStyle="light-content" />
      <View style={styles.safeArea}>{content}</View>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1e40af',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  searchButton: {
    backgroundColor: '#1e40af',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  situationsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  situationChip: {
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  situationChipText: {
    fontSize: 14,
  },
  actCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  actCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actCardDescription: {
    color: '#666666',
  },
  detailsHeader: {
    backgroundColor: '#1e40af',
    padding: 16,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  detailsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  actYear: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  actDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 8,
  },
  featureItem: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    lineHeight: 22,
  },
  sectionItem: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  sectionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
  },
  caseItem: {
    marginBottom: 12,
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  caseDescription: {
    fontSize: 14,
    color: '#444444',
  },
  searchBarContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  resultsCount: {
    padding: 16,
    fontSize: 14,
    color: '#666666',
  },
  searchResultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  searchResultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  searchResultDescription: {
    color: '#666666',
  },
  searchResultsList: {
    paddingBottom: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default App;
