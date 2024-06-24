import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmojiPredictor = () => {
  const [text, setText] = useState('');
  const [predictedEmoji, setPredictedEmoji] = useState('');
  const [timer, setTimer] = useState(null);

  // Function to handle form submission
  const handleOnChange = async (e) => {
    const newText = e.target.value;
    setText(newText);
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(async() => {
    
    
    if(e.target.value.trim()){
      console.log(e.target.value.trim())
    try {
      const response = await axios.post('http://localhost:5000/predict', { text: newText });
      console.log(response.data.predicted_emoji)
      setPredictedEmoji(response.data.predicted_emoji);
    } catch (error) {
      console.error("There was an error making the prediction:", error);
    }
  }else{
    setPredictedEmoji("")
  }
    // Clear previous timer
   
    // Set new timer to append emoji after 2 seconds of stop typing
      // Append emoji to the end of text if predictedEmoji is not empty
      
    }, 2000);

    setTimer(newTimer); // Save the new timer
  };

  
  useEffect(() => {
    if (predictedEmoji) {
      setText(prevText => prevText.trim() + ` ${predictedEmoji}`);
      setPredictedEmoji("")
    }
  }, [predictedEmoji,setPredictedEmoji])
  
  return (
    <div>
      <form >
        <input 
          type="text" 
          value={text} 
          onChange={handleOnChange} 
          placeholder="Enter your text" 
          
        />
        <button type="submit">Predict Emoji</button>
      </form>
      {/* {predictedEmoji && (
        <div>
          <h3>Predicted Emoji:</h3>
          <p>{predictedEmoji}</p>
        </div>
      )} */}
    </div>
  );
};

export default EmojiPredictor;
