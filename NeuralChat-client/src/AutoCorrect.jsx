import React, { useState } from 'react';
import axios from 'axios';

const AutoCorrect = () => {
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (keyword) {
            try {
                const response = await axios.post('http://127.0.0.1:5000/suggest', { keyword });
                setSuggestions(response.data.suggestions);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={keyword}
                    onChange={handleInputChange}
                    placeholder="Enter a sentence"
                />
                <button type="submit">Get Suggestions</button>
            </form>
            <ul>
                {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
        </div>
    );
};

export default AutoCorrect;
