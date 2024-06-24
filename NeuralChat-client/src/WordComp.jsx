import React, { useState } from 'react';
import axios from 'axios';

const WordComp = () => {
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const messageOnChange = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(setTimeout(async () => {
      const arr = inputValue.split(" ");
      const keyword = arr[arr.length - 1];

      console.log(keyword);

      if (keyword.trim()) {
        try {
          const response = await axios.post('http://127.0.0.1:5000/suggest', { keyword });
          setSuggestions(response.data.suggestions);
          setSelectedIndex(-1); // Reset the selected index
          console.log(response.data.suggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    }, 500));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => (prevIndex + suggestions.length - 1) % suggestions.length);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      const selectedSuggestion = suggestions[selectedIndex].Word;
      const arr = message.split(" ");
      arr[arr.length - 1] = selectedSuggestion; // Replace the last word with the selected suggestion
      setMessage(arr.join(" "));
      setSuggestions([]); // Clear suggestions
      setSelectedIndex(-1); // Reset selected index
    }
  };

  const handleSuggestionClick = (index) => {
    const selectedSuggestion = suggestions[index].Word;
    const arr = message.split(" ");
    arr[arr.length - 1] = selectedSuggestion; // Replace the last word with the selected suggestion
    setMessage(arr.join(" "));
    setSuggestions([]); // Clear suggestions
    setSelectedIndex(-1); // Reset selected index
  };

  return (
    <div>
      <input 
        type="text" 
        value={message} 
        onChange={messageOnChange} 
        onKeyDown={handleKeyDown} 
        placeholder="Type your message..." 
      />
      
    </div>
  );
};

export default WordComp;
