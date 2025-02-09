import { useState } from "react";

export const AutoCompleteComponent = () => {
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([
    "Apple",
    "Orange",
    "Papaya",
    "Mango",
    "Kivi",
    "Banana",
  ]);

  const [selectedValue, setSelectedValue] = useState("");

  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  return (
    <>
      <AutoComplete
        options={autoCompleteOptions}
        onSelect={handleSelect}
        selectedValue={selectedValue}
      />
      {/* <div>{selectedValue}</div> */}
    </>
  );
};

const AutoComplete = ({
  options,
  onSelect,
  selectedValue,
  placeholder = "Search...",
}) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Track highlighted option

  const handleInputChange = (value) => {
    onSelect(value);
    setHighlightedIndex(-1); // Reset highlighted index
    if (value.trim() === "") {
      setFilteredOptions([]);
      return;
    }
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleKeyDown = (e) => {
    if (filteredOptions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        // Move down, but stay within bounds
        setHighlightedIndex((prevIndex) =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
        );
        break;

      case "ArrowUp":
        // Move up, but stay within bounds
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
        );
        break;

      case "Enter":
        // Select the highlighted option
        if (highlightedIndex >= 0) {
          handleInputChange(filteredOptions[highlightedIndex]);
          setShowSuggestions(false);
        }
        break;

      case "Escape":
        // Close the suggestions
        setShowSuggestions(false);
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <input
        placeholder={placeholder}
        value={selectedValue} // Ensure the input value reflects the state
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
        onKeyDown={handleKeyDown} // Handle arrow keys and Enter
      />
      {showSuggestions && selectedValue.trim().length > 0 && (
        <div>
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor:
                      highlightedIndex === index ? "#e0e0e0" : "transparent", // Highlight background
                  }}
                >
                  <button
                    onMouseDown={() => handleInputChange(item)}
                    style={{
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      width: "100%",
                      padding: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))
            ) : (
              <li>no item found..</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
