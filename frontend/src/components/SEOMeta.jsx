// src/components/SEOMeta.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * A component to manage SEO meta tags dynamically in a Vite + React 19 app
 * @param {string} title - Page title
 * @param {string} description - Meta description
 * @param {string} keywords - Comma-separated keywords
 * @param {string} canonical - Canonical URL
 * @param {Object} openGraph - OpenGraph meta (title, description, image, url)
 */
function SEOMeta({ title, description, keywords, canonical, openGraph = {} }) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute("content", description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && keywords) {
      metaKeywords.setAttribute("content", keywords);
    }

    // Update canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (!linkCanonical) {
        linkCanonical = document.createElement("link");
        linkCanonical.rel = "canonical";
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonical;
    }

    // Update OpenGraph meta
    if (openGraph) {
      const ogTags = {
        "og:title": openGraph.title || title,
        "og:description": openGraph.description || description,
        "og:image": openGraph.image,
        "og:url": openGraph.url || window.location.href,
      };

      Object.entries(ogTags).forEach(([property, content]) => {
        if (content) {
          let metaTag = document.querySelector(`meta[property="${property}"]`);
          if (!metaTag) {
            metaTag = document.createElement("meta");
            metaTag.setAttribute("property", property);
            document.head.appendChild(metaTag);
          }
          metaTag.setAttribute("content", content);
        }
      });
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (title) document.title = "Default Title"; // Reset to default
    };
  }, [title, description, keywords, canonical, openGraph]);

  return null; // This component doesn't render anything
}

SEOMeta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  canonical: PropTypes.string,
  openGraph: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string,
  }),
};

export default SEOMeta;
