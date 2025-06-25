import React from 'react';
import PrimaryButton from '../buttons/PrimaryButton'; // Adjust path
import SecondaryButton from '../buttons/SecondaryButton'; // Adjust path
// Or use styled anchor tags

const ResourceTopicFilter = ({ topics, selectedTopic, onSelectTopic }) => {
  return (
    <div className="resources-filter-bar" style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
      {topics.map(topic => (
        selectedTopic === topic ? (
          <PrimaryButton 
            key={topic} 
            onClick={() => onSelectTopic(topic)}
            className="filter-button active" // Add classes for styling
            style={{ marginRight: 'var(--spacing-sm)' }} 
          >
            {topic}
          </PrimaryButton>
        ) : (
          <SecondaryButton 
            key={topic} 
            onClick={() => onSelectTopic(topic)}
            className="filter-button" // Add classes for styling
            style={{ marginRight: 'var(--spacing-sm)' }}
          >
            {topic}
          </SecondaryButton>
        )
      ))}
    </div>
  );
};

export default ResourceTopicFilter;
