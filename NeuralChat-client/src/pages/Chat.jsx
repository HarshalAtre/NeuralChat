import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./chat.css"
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { grayColor, orange } from "../constants/color";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";



const Chat = ({ chatId, user }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);
  const [typingTimeoutw, setTypingTimeoutw] = useState(null);
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const [predictedEmoji, setPredictedEmoji] = useState('');
  const [timer, setTimer] = useState(null);
  const {isEmojify} = useSelector((state) => state.misc);
  
  const [time,setTime]=useState(2000)
  const { type } = useSelector((state) => state.misc);
  
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;
  
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const messageOnChange = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);

    if (typingTimeoutw) {
      clearTimeout(typingTimeoutw);
    }

    setTypingTimeoutw(setTimeout(async () => {
      const arr = inputValue.split(" ");
      const keyword = arr[arr.length - 1];

      console.log(keyword);

      if (keyword.trim()) {
        try {
          const response = await axios.post('https://neuralchat-ml.onrender.com/suggest', { keyword });
          setSuggestions(response.data.suggestions);
          setSelectedIndex(-1); // Reset the selected index
          console.log(response.data.suggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    }, 100));
    if (!IamTyping) {
      

      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);                                                               
    }, [2000]);
  };

  useEffect(() => {
    switch (type) {
      case 10:
        setTime(3500)
        break;
      case 20:
          setTime(2000)
          break;
      case 30:
          setTime(1000)
          break;    
      default:
        setTime(3000)
        break;
    }
  
  }, [type])
  
  const handleEmoji = async (e) => {
    const newText = e.target.value;
    setMessage(newText);
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(async() => {
    
    
    if(e.target.value.trim()){
      console.log(e.target.value.trim())
    try {
      const response = await axios.post('https://neuralchat-ml.onrender.com/predict', { text: newText });
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
      
    }, time);

    setTimer(newTimer); // Save the new timer
  };

  useEffect(() => {
    if (predictedEmoji) {
      setMessage(prevText => prevText.trim() + ` ${predictedEmoji}`);
      setPredictedEmoji("")
    }
  }, [predictedEmoji,setPredictedEmoji])

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    setSuggestions("");
    clearTimeout(typingTimeoutw)
    e.preventDefault();
    if (!message.trim()) return;
    // Emitting the message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId,dispatch]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];
  const inputRef = useRef(null);


  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();  // Prevent the default behavior of the Tab key
    }
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => (prevIndex + suggestions.length - 1) % suggestions.length);
    } else if (e.key === "Tab" && selectedIndex >= 0) {
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
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input field
    }
  };

   
  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Stack 
      className="dodle"
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
      </Stack>

      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
          style={{
            margin:"0px",
            backgroundColor:"rgba(207,195,254,0.5)",
            background: " linear-gradient(97deg, rgba(118,47,227,1) 0%, rgba(198,144,227,1) 34%, rgba(184,144,219,1) 68%, rgba(117,46,227,1) 100%)"
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>
          {suggestions.length > 0 && (
        <motion.div 
        initial={{ opacity: 0, x: "-100%" }}
        whileInView={{ opacity: 1 , x: 0 }}

        id="suggestionsContainer" style={{ border: '1px solid #ccc', position: 'absolute', backgroundColor: 'white' ,
          bottom:"4.5rem",left:"0px"
        }}>
          {suggestions.map((suggestion, index) => (
            <div 
            
              key={index}
              style={{
                minWidth:"5rem",
                padding: '5px',
                backgroundColor: index === selectedIndex ? '#ddd' : '#fff',
                cursor: 'pointer',
                borderBottom:"1px solid black",
                // borderRadius:"5px"
              }}
              
              onMouseDown={() => handleSuggestionClick(index)}
            >
              {suggestion.Word}
            </div>
          ))}
        </motion.div>
      )}
          <InputBox
          ref={inputRef}
            placeholder="Type Message Here..."
            value={message}
            onChange={isEmojify?handleEmoji:messageOnChange}
            onKeyDown={handleKeyDown} 
            style={{
              border:"0.1px solid purple"
            }}
          />
          

          <IconButton
            type="submit"
            onKeyDown={handleKeyDown}
            sx={{
              rotate: "-30deg",
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);
