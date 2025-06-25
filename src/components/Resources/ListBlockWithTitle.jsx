import React from "react";
import BodyText from "../../atoms/BodyText";
import "../../styles/Resources/ListBlockWithTitle.css";

/**
 * List Block With Title Component
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Title text for the list block
 * @param {string} props.summaryText - Summary text displayed before the list
 * @param {boolean} props.ordered - Whether to display as ordered list (numbered) or unordered list (bullets)
 * @param {Array<string>} props.bodyText - Array of text items to display in the list
 */
const ListBlockWithTitle = ({
  title,
  summaryText,
  ordered = true,
  bodyText,
}) => {
  return (
    <div className="list-block">
      <h4 className="list-block-title">{title}</h4>
      <div className="list-block-summary">
        <BodyText text={summaryText} />
      </div>
      {ordered ? (
        <ol className="list-block-ordered">
          {bodyText.map((text, index) => (
            <li key={index} className="list-item">
              <BodyText text={text} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="list-block-unordered">
          {bodyText.map((text, index) => (
            <li key={index} className="list-item">
              <BodyText text={text} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListBlockWithTitle;
