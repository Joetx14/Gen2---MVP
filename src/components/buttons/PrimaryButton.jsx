import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/buttons/PrimaryButton.css";

/**
 * PrimaryButton Component
 * The main call-to-action button.
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content inside button (usually text).
 * @param {Function} [props.onClick] - Click handler.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Button type.
 * @param {boolean} [props.disabled=false] - Is the button disabled?
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {string} [props.ariaLabel] - Accessible label.
 * @param {boolean} [props.asLink=false] - Render as a link.
 * @param {string} [props.href] - Link destination.
 * @param {object} [props.props] - Other standard HTML button or link attributes.
 */
const PrimaryButton = ({
  asLink = false,
  href,
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ariaLabel,
  ...props
}) => {
  const buttonClasses = `primary-button ${className}`.trim();

  if (asLink) {
    return (
      <Link
        to={href}
        className={buttonClasses}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Link>
    );
  }

  const defaultAriaLabel = typeof children === 'string' ? children : undefined;
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || defaultAriaLabel}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
