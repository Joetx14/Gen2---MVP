import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/buttons/SecondaryButton.css";

const SecondaryButton = ({ asLink, href, children, ...props }) => {
  if (asLink) {
    return (
      <Link to={href} className="secondary-button" {...props}>
        {children}
      </Link>
    );
  }
  return <button className="secondary-button" {...props}>{children}</button>;
};

export default SecondaryButton;
