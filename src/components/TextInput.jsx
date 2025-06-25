// src/components/TextInput.js

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import '../styles/TextInput.css'; 

const TextInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  helper,
  error,
  disabled,
  options = [], 
  multiline = false, 
  textareaClassName = '', 
  containerClassName = '', 
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1); // Added state

  const inputRef = useRef(null);
  const displayRef = useRef(null); // This will be dropdownDisplayRef
  const textareaRef = useRef(null);
  const dropdownListRef = useRef(null); // Added ref for dropdown list

  const isPassword = type === 'password';
  const isDropdown = type === 'dropdown';

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const selectedOption = isDropdown ?
    options.find(option => option.value === value) : null;

  const autoResizeTextarea = useCallback(() => {
    if (multiline && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = textareaRef.current.scrollHeight > 0 ? textareaRef.current.scrollHeight : 0;
      textareaRef.current.style.height = `${newHeight}px`;
      const maxHeight = parseFloat(getComputedStyle(textareaRef.current).getPropertyValue('--textarea-max-height')) || 240;
      if (newHeight > maxHeight) {
        textareaRef.current.classList.add('scrollable');
      } else {
        textareaRef.current.classList.remove('scrollable');
      }
    }
  }, [multiline]);

  useEffect(() => {
    autoResizeTextarea();
  }, [value, autoResizeTextarea]);

  useEffect(() => {
    if (isDropdownOpen && displayRef.current) {
      const rect = displayRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isDropdownOpen]);

  const toggleDropdown = useCallback(() => { // Wrapped in useCallback
    if (!disabled) {
      const newOpenState = !isDropdownOpen;
      setIsDropdownOpen(newOpenState);
      if (newOpenState) {
        const currentIndex = options.findIndex(opt => opt.value === value);
        setFocusedOptionIndex(currentIndex !== -1 ? currentIndex : 0);
      } else {
        setFocusedOptionIndex(-1);
        if (displayRef.current) displayRef.current.focus();
      }
    }
  }, [disabled, isDropdownOpen, options, value]);

  const handleOptionSelect = useCallback((option) => { // Wrapped in useCallback
    onChange({ target: { name, value: option.value } });
    setIsDropdownOpen(false);
    setFocusedOptionIndex(-1);
    if (displayRef.current) displayRef.current.focus();
  }, [name, onChange]);

  // Keyboard navigation for dropdown
  const handleDropdownKeyDown = useCallback((event) => { // Wrapped in useCallback
    if (disabled || !isDropdown) return;

    switch (event.key) {
      case 'Enter':
      case ' ': // Spacebar
        event.preventDefault();
        if (isDropdownOpen) {
          if (focusedOptionIndex >= 0 && focusedOptionIndex < options.length) {
            handleOptionSelect(options[focusedOptionIndex]);
          }
        } else {
          toggleDropdown(); // Open dropdown and set initial focus
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isDropdownOpen) {
          toggleDropdown(); // Open dropdown and set initial focus via toggleDropdown
        } else {
          setFocusedOptionIndex(prevIndex =>
            prevIndex < options.length - 1 ? prevIndex + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isDropdownOpen) {
          toggleDropdown(); // Open dropdown and set initial focus via toggleDropdown
        } else {
          setFocusedOptionIndex(prevIndex =>
            prevIndex > 0 ? prevIndex - 1 : options.length - 1
          );
        }
        break;
      case 'Escape':
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
          setFocusedOptionIndex(-1);
          if (displayRef.current) displayRef.current.focus();
        }
        break;
      case 'Tab':
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
          setFocusedOptionIndex(-1);
        }
        break;
      default:
        break;
    }
  }, [disabled, isDropdownOpen, focusedOptionIndex, options.length, handleOptionSelect, toggleDropdown, isDropdown]);

  // Scroll focused item into view
  useEffect(() => {
    if (isDropdownOpen && focusedOptionIndex >= 0 && dropdownListRef.current) {
      const optionElement = document.getElementById(`dropdown-option-${id}-${focusedOptionIndex}`);
      if (optionElement) {
        optionElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedOptionIndex, isDropdownOpen, id]);
  
  useEffect(() => {
    if (!isDropdown) return;

    const handleClickOutside = (event) => {
      if (displayRef.current && !displayRef.current.contains(event.target) &&
          dropdownListRef.current && !dropdownListRef.current.contains(event.target)) { 
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);  }, [isDropdown]);

  // Filter out invalid DOM props before creating commonInputProps
  const {
    multiline: _multiline,
    textareaClassName: _textareaClassName,
    containerClassName: _containerClassName,
    options: _options,
    helper: _helper,
    label: _label,
    helperText: _helperText,
    ...validRestProps
  } = rest;

  const commonInputProps = {
    id,
    name,
    className: `text-input ${value ? 'filled' : ''} ${error ? 'error' : ''}`,
    value,
    onChange: (e) => {
      onChange(e);
      if (multiline) {
        // autoResizeTextarea(); // This is now handled by useEffect on value change
      }
    },
    placeholder,
    disabled,
    ...validRestProps,
  };


  return (
    <div className={`text-input-wrapper ${containerClassName}`} ref={inputRef}>
      {label && <label htmlFor={id} className="text-label">{label}</label>}

      {isDropdown ? (
        <div className="input-container dropdown-container">
          <div
            ref={displayRef}
            className={`text-input dropdown-display ${isDropdownOpen ? 'focused' : ''} ${value ? 'filled' : ''} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={toggleDropdown}
            onKeyDown={handleDropdownKeyDown} // Added keydown handler
            tabIndex={disabled ? -1 : 0}
            role="combobox" // Changed role to combobox
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-controls={isDropdownOpen ? `dropdown-list-${id}` : undefined} // Points to list id
            {...validRestProps} 
          >
            <span>
              {selectedOption ? selectedOption.label : <span className="dropdown-placeholder">{placeholder}</span>}
            </span>
            <svg className={`dropdown-arrow ${isDropdownOpen ? 'dropdown-arrow-open' : ''}`}
                 width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {isDropdownOpen && createPortal(
            <ul
              id={`dropdown-list-${id}`} // Added ID for aria-controls
              className={`dropdown-list farewell-scrollbar`}
              style={{
                position: 'absolute',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`
              }}
              role="listbox"
              aria-activedescendant={focusedOptionIndex >= 0 ? `dropdown-option-${id}-${focusedOptionIndex}` : undefined} // Added
              ref={dropdownListRef} // Added ref
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  id={`dropdown-option-${id}-${index}`} // Added unique ID
                  className={`dropdown-list-item ${option.value === value ? 'dropdown-list-item-selected' : ''} ${index === focusedOptionIndex ? 'dropdown-list-item-focused' : ''}`} // Added focused class
                  onClick={() => handleOptionSelect(option)}
                  role="option"
                  aria-selected={option.value === value || index === focusedOptionIndex} // aria-selected can also reflect focus
                  onMouseEnter={() => setFocusedOptionIndex(index)} // Added mouse hover
                >
                  {option.label}
                </li>
              ))}
            </ul>,
            document.body
          )}
        </div>
      ) : multiline ? (
        <div className={`input-container`}>
          <textarea
            ref={node => { textareaRef.current = node; if (inputRef) inputRef.current = node; }} // Combine refs if needed or use separate
            {...commonInputProps}
            className={`${commonInputProps.className} ${textareaClassName}`}
            rows={1}
            style={{ overflowY: 'hidden' }}
          />
        </div>
      ) : (
        <div className={`input-container ${isPassword ? 'password-input-container' : ''}`}>          <input
            ref={node => { inputRef.current = node; }} // Simplified ref assignment
            type={inputType}
            {...commonInputProps}
          />

          {isPassword && (
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}
      {helper && !error && <div className="input-helper-text">{helper}</div>}
      {error && <div className="error-helper">{error}</div>}
    </div>
  );
};

export default TextInput;
