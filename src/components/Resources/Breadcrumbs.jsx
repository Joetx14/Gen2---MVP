import React from 'react';
// import { Link } from 'react-router-dom'; // If using React Router for links

const Breadcrumbs = ({ path }) => {
  // path is an array of objects: [{ label: 'Home', href: '/' }, { label: 'Category' }]
  return (
    <nav aria-label="breadcrumb" className="resources-breadcrumbs">
      {path.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && <span className="breadcrumb-separator" aria-hidden="true"> &gt; </span>}
          {item.href ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
