import React from "react";
// You can potentially share the secondary button styles
import "../../styles/buttons/SecondaryButton.css";

const GoBackButton = ({ children, onClick, disabled = false, className = '', ...props }) => {
  // Use the secondary-button class for base styling, plus any custom classes
  const buttonClasses = `secondary-button ${className}`.trim();

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Go back: ${typeof children === 'string' ? children : ''}`}
      {...props}
    >
      {/* Include the arrow icon permanently */}
      <img
        src="/Picture/goback--arrow-right.svg" // <-- Public path to your arrow icon
        alt="Go back arrow"
        className="secondary-button-icon" // <-- Use the icon class defined in SecondaryButton.css
      />

      {/* Render the button text (e.g., "Go back") */}
      {children}
    </button>
  );
};

export default GoBackButton;
