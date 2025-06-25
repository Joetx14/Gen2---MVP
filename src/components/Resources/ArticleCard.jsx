import React from "react";
import { Link } from 'react-router-dom'; // Add this import
import "../../styles/Resources/ArticleCard.css";

/**
 * Article Card Component
 * @param {Object} props - Component props
 * @param {Object} props.article - Article data
 * @param {boolean} props.landscape - Whether to display in landscape mode
 */
const ArticleCard = ({ landscape = false, article }) => {
  const articleDate = new Date(article.publishedOn);
  const formattedDate = articleDate.toLocaleDateString("en-us", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  // Function to get the image URL directly from Sanity CDN
  const getSanityImageUrl = (image, width = 400, height = 250) => {
    if (!image || !image.asset || !image.asset._ref) {
      return ""; // Return empty if no image
    }

    // Extract the image ID from the reference
    const ref = image.asset._ref;
    const [_file, id, extension] = ref.split("-");

    // Create the base URL to the Sanity image CDN
    const baseUrl = `https://cdn.sanity.io/images/${process.env.REACT_APP_SANITY_PROJECT_ID}/content/`;

    // Add transformation parameters
    const params = `?w=${width}&h=${height}&fit=crop&auto=format`;

    return `${baseUrl}${id}.${extension}${params}`;
  };

  return (
    <div className={`article-card ${landscape ? "article-card-landscape" : ""}`}>
      <div
        className={`article-image-container ${
          landscape ? "article-image-landscape" : ""
        }`}
      >
        {article.mainImage ? (
          <img
            src={getSanityImageUrl(article.mainImage, 400, 250)}
            alt={article.title}
            className="article-card-image"
            loading="lazy"
          />
        ) : (
          <div className="article-card-image-placeholder"></div>
        )}
      </div>

      <div className="article-content">
        <div className="article-meta">
          {article.categories && article.categories[0] && (
            <div className="article-category">{article.categories[0].title}</div>
          )}
          <div className="article-date">{formattedDate}</div>
        </div>
        <h2 className="h3">{article.title}</h2>
        <p className="article-description text">{article.shortDesc}</p>
        
        {/* Replace HoverLink with a direct Link */}
        <Link to={`/resources/${article.slug}`} className="read-more-link">
          Read article →
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
