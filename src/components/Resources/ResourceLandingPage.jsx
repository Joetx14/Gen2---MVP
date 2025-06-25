import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StandardLayout from '../StandardLayout';
import SearchBar from './SearchBar';
import ArticleCard from './ArticleCard';
import ResourceTopicFilter from './ResourceTopicFilter';
import sanityClient from '../../utils/sanityClient';
import '../../styles/Resources/Resources.css';

const ResourceLandingPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [topics, setTopics] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticlesAndCategories = async () => {
      setIsLoading(true);
      setError(null);
      
      // GROQ query to fetch articles and their referenced category titles and slugs
      const articleQuery = `*[_type == "article"] | order(publishedOn desc) {
        title,
        "slug": slug.current,
        mainImage,
        "categories": categories[]->{title, "slug": slug.current},
        publishedOn,
        shortDesc,
        featured
      }`;

      try {
        const fetchedArticles = await sanityClient.fetch(articleQuery);
        
        // Find featured article if any
        const featured = fetchedArticles.find(article => article.featured === true);
        if (featured) {
          setFeaturedArticle(featured);
          // Remove featured from regular list
          const regularArticles = fetchedArticles.filter(article => article !== featured);
          setArticles(regularArticles || []);
          setFilteredArticles(regularArticles || []);
        } else {
          // If no featured article, use the first one as featured
          setFeaturedArticle(fetchedArticles[0]);
          setArticles(fetchedArticles.slice(1) || []);
          setFilteredArticles(fetchedArticles.slice(1) || []);
        }

        // Extract unique topics for the filter
        const uniqueCategories = new Set(['All']);
        (fetchedArticles || []).forEach(article => {
          article.categories?.forEach(cat => uniqueCategories.add(cat.title));
        });
        setTopics(Array.from(uniqueCategories));

      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError("Failed to load articles. Please try again later.");
        setArticles([]);
        setFilteredArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticlesAndCategories();
  }, []);

  // Filter articles based on topic and search term
  useEffect(() => {
    let filtered = [...articles];
    
    // Filter by topic
    if (selectedTopic !== 'All') {
      filtered = filtered.filter(article =>
        article.categories?.some(cat => cat.title === selectedTopic)
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title?.toLowerCase().includes(term) ||
        article.shortDesc?.toLowerCase().includes(term)
      );
    }
    
    setFilteredArticles(filtered);
  }, [selectedTopic, searchTerm, articles]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) return (
    <StandardLayout title="Resources">
      <p className="loading-message">Loading articles...</p>
    </StandardLayout>
  );
  
  if (error) return (
    <StandardLayout title="Resources">
      <p className="error-message">{error}</p>
    </StandardLayout>
  );

  return (
    <>
      <StandardLayout
        title="Articles & insights that will help you navigate"
        subtitle="Explore topics by category or discover our latest publications."
        className="resources-page"
      >
        <div className="resources-controls">
          <ResourceTopicFilter
            topics={topics}
            selectedTopic={selectedTopic}
            onSelectTopic={handleTopicSelect}
          />
          <SearchBar 
            placeholder="Search articles..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Featured Article Section */}
        {featuredArticle && !searchTerm && selectedTopic === 'All' && (
          <div className="featured-article">
            <div className="featured-article-content">
              <div className="featured-article-image">
                {featuredArticle.mainImage ? (
                  <img 
                    src={urlFor(featuredArticle.mainImage).width(600).height(400).url()} 
                    alt={featuredArticle.title}
                  />
                ) : (
                  <div className="placeholder-image"></div>
                )}
              </div>
              <div className="featured-article-details">
                {featuredArticle.categories && featuredArticle.categories[0] && (
                  <span className="article-category">{featuredArticle.categories[0].title}</span>
                )}
                {featuredArticle.publishedOn && (
                  <span className="article-date">{formatDate(featuredArticle.publishedOn)}</span>
                )}
                <h2 className="featured-article-title">{featuredArticle.title}</h2>
                {featuredArticle.shortDesc && (
                  <p className="featured-article-excerpt">{featuredArticle.shortDesc}</p>
                )}
                <Link to={`/resources/${featuredArticle.slug}`} className="read-article-link">
                  Read article <span className="arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="resources-article-grid">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div key={article.slug} className="article-card">
                <div className="article-image">
                  {article.mainImage ? (
                    <img 
                      src={urlFor(article.mainImage).width(400).height(250).url()} 
                      alt={article.title}
                    />
                  ) : (
                    <div className="placeholder-image"></div>
                  )}
                </div>
                <div className="article-content">
                  <div className="article-meta">
                    {article.categories && article.categories[0] && (
                      <span className="article-category">{article.categories[0].title}</span>
                    )}
                    {article.publishedOn && (
                      <span className="article-date">{formatDate(article.publishedOn)}</span>
                    )}
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  {article.shortDesc && (
                    <p className="article-excerpt">{article.shortDesc}</p>
                  )}
                  <Link to={`/resources/${article.slug}`} className="read-article-link">
                    Read article <span className="arrow">→</span>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="no-articles-message">
              No articles found matching your search criteria. Try adjusting your filters or search term.
            </p>
          )}
        </div>
      </StandardLayout>
      {/* Footer is included by StandardLayout */}
    </>
  );
};

export default ResourceLandingPage;
