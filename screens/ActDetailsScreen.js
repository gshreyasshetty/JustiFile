import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Divider, List } from 'react-native-paper';
import { legalActsData } from '../data/legalActsData';

const ActDetailsScreen = ({ route }) => {
  const { id } = route.params;
  
  // Find the selected act from our database
  const act = legalActsData.find(act => act.id === id) || {
    title: "Not Found",
    description: "Act information not available",
    sections: []
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{act.title}</Title>
          <Paragraph style={styles.year}>Year: {act.year}</Paragraph>
          <Divider style={styles.divider} />
          <Paragraph style={styles.description}>{act.description}</Paragraph>
          
          {act.keyFeatures && (
            <>
              <Title style={styles.sectionTitle}>Key Features</Title>
              {act.keyFeatures.map((feature, index) => (
                <List.Item
                  key={index}
                  title={feature}
                  left={props => <List.Icon {...props} icon="check-circle" />}
                  titleNumberOfLines={3}
                />
              ))}
            </>
          )}
          
          {act.sections && act.sections.length > 0 && (
            <>
              <Title style={styles.sectionTitle}>Important Sections</Title>
              {act.sections.map((section, index) => (
                <Card key={index} style={styles.sectionCard}>
                  <Card.Content>
                    <Title style={styles.sectionNumber}>Section {section.number}</Title>
                    <Paragraph style={styles.sectionName}>{section.title}</Paragraph>
                    <Divider style={styles.miniDivider} />
                    <Paragraph>{section.content}</Paragraph>
                  </Card.Content>
                </Card>
              ))}
            </>
          )}
          
          {act.relevantCases && act.relevantCases.length > 0 && (
            <>
              <Title style={styles.sectionTitle}>Relevant Case Laws</Title>
              {act.relevantCases.map((caseItem, index) => (
                <List.Item
                  key={index}
                  title={caseItem.title}
                  description={caseItem.description}
                  titleNumberOfLines={2}
                  descriptionNumberOfLines={3}
                />
              ))}
            </>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
  },
  year: {
    fontStyle: 'italic',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  description: {
    marginBottom: 20,
    lineHeight: 22,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
  },
  sectionCard: {
    marginBottom: 10,
  },
  sectionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionName: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  miniDivider: {
    marginVertical: 5,
  }
});

export default ActDetailsScreen;
