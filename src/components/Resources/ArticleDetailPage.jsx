import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StandardLayout from '../StandardLayout';
import sanityClient from '../../utils/sanityClient';
import '../../styles/Resources/Resources.css';

// Only keep the PortableText import
import { PortableText } from '@portabletext/react';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const query = `
          *[_type == "article" && slug.current == $slug][0] {
            title,
            "slug": slug.current,
            publishedOn,
            shortDesc,
            mainImage {
              asset-> {
                _id,
                url
              },
              alt,
              caption,
              attribution
            },
            "categories": categories[]->{ title, "slug": slug.current },
            bodyContent
          }
        `;
        
        const article = await sanityClient.fetch(query, { slug });
        
        if (!article) {
          setError('Article not found');
          setIsLoading(false);
          return;
        }
        
        setArticle(article);
        
        // Fetch related articles
        const relatedQuery = `
          *[_type == "article" && 
            slug.current != $slug && 
            count((categories[]->._id)[@ in ^.^.categories[]->._id]) > 0] | order(publishedOn desc)[0...3] {
            title,
            "slug": slug.current,
            shortDesc,
            mainImage,
            publishedOn,
            "categories": categories[]->{ title }
          }
        `;
        
        const relatedResults = await sanityClient.fetch(relatedQuery, { slug });
        setRelatedArticles(relatedResults);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [slug]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Define PortableText components for rich content
  const ptComponents = {
    types: {
      // Replace custom component with direct implementation
      textBlockWithTitle: ({ value }) => (
        <div className="text-block-with-title">
          <h3 className="text-block-title">{value.title}</h3>
          <div className="text-block-body">{value.bodyText}</div>
        </div>
      ),
      // Replace custom component with direct implementation
      listBlockWithTitle: ({ value }) => (
        <div className="list-block-with-title">
          <h3 className="list-block-title">{value.title}</h3>
          {value.summaryText && <p className="list-block-summary">{value.summaryText}</p>}
          {value.ordered ? (
            <ol className="list-block-items">
              {value.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          ) : (
            <ul className="list-block-items">
              {value.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ),
      image: ({ value }) => (
        <figure className="article-image">
          <img 
            src={getSanityImageUrl(value, 800)} // Use the new function here
            alt={value.alt || ''}
            loading="lazy"
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
        return (
          <a 
            href={value.href} 
            rel={rel}
            target={value.blank ? '_blank' : undefined}
          >
            {children}
          </a>
        );
      },
    },
  };

  // New function to get Sanity image URL
  const getSanityImageUrl = (image, width = 800, height) => {
    if (!image || !image.asset || !image.asset._ref) {
      return ""; // Return empty if no image
    }

    // Extract the image ID from the reference
    const ref = image.asset._ref;
    const [_file, id, extension] = ref.split('-');
    
    // Create the base URL to the Sanity image CDN
    const baseUrl = `https://cdn.sanity.io/images/${process.env.REACT_APP_SANITY_PROJECT_ID}/content/`;
    
    // Add transformation parameters
    const params = height 
      ? `?w=${width}&h=${height}&fit=crop&auto=format` 
      : `?w=${width}&auto=format`;
    
    return `${baseUrl}${id}.${extension}${params}`;
  };

  if (isLoading) {
    return <StandardLayout title="Loading article..."><p>Loading...</p></StandardLayout>;
  }
  
  if (error) {
    return <StandardLayout title="Error"><p>Could not load article. {error}</p></StandardLayout>;
  }
  
  if (!article) {
    return <StandardLayout title="Not Found"><p>Article not found.</p></StandardLayout>;
  }

  return (
    <StandardLayout 
      title={article.title}
      subtitle={article.categories?.[0]?.title 
        ? `${article.categories[0].title} - Published on ${formatDate(article.publishedOn)}`
        : `Published on ${formatDate(article.publishedOn)}`
      }
    >
      {/* Breadcrumbs */}
      <div className="article-breadcrumbs">
        <Link to="/resources">Resources</Link>
        {article.categories?.[0] && (
          <>
            <span> / </span>
            <Link to={`/resources?topic=${encodeURIComponent(article.categories[0].title)}`}>
              {article.categories[0].title}
            </Link>
          </>
        )}
        <span> / {article.title}</span>
      </div>

      {/* Main Image */}
      {article.mainImage && (
        <div className="article-main-image-container">
          <img 
            src={getSanityImageUrl(article.mainImage, 800)} // Use the new function here
            alt={article.mainImage.alt || article.title}
            className="article-main-image"
          />
          {article.mainImage.caption && (
            <figcaption className="article-image-caption">
              {article.mainImage.caption}
              {article.mainImage.attribution && (
                <span className="image-attribution"> — {article.mainImage.attribution}</span>
              )}
            </figcaption>
          )}
        </div>
      )}

      {/* Article Body Content */}
      <div className="article-body-content">
        <PortableText
          value={article.bodyContent}
          components={ptComponents}
        />
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="related-articles-section">
          <h2 className="related-articles-title">Related Articles</h2>
          <div className="resources-article-grid">
            {relatedArticles.map(related => (
              <div key={related.slug} className="article-card">
                {related.mainImage && (
                  <div className="article-image">
                    <img 
                      src={getSanityImageUrl(related.mainImage, 300, 200)} // Use the new function here
                      alt={related.title}
                    />
                  </div>
                )}
                <div className="article-content">
                  <h3 className="article-title">{related.title}</h3>
                  {related.shortDesc && (
                    <p className="article-excerpt">{related.shortDesc}</p>
                  )}
                  <Link to={`/resources/${related.slug}`} className="read-article-link">
                    Read article →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </StandardLayout>
  );
};

export default ArticleDetailPage;
