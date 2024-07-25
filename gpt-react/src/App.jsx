import './App.css';
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

function ChatMessage({ message, type }) {
    console.log(message);
    return (
        <div className="chat-item">
            {
                type === "send" ?
                    (<div className="question">{message}</div>) :
                    (<div className="answer">{message}</div>)
            }
        </div>
    )
}

function App() {
    const [inputMessage, setInputMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [allMessages, setAllMessages] = useState([]);

    useEffect(() => {
        const newSocket = io("http://localhost:8080");
        setSocket(newSocket);

        newSocket.on("response", (message) => {
            setAllMessages(prevMessages => [
                ...prevMessages,
                {
                    type: "receive",
                    message
                }
            ]);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = () => {
        if (inputMessage.trim() === "") return;

        const newMessage = {
            type: "send",
            message: inputMessage.trim(),
        };

        setAllMessages(prevMessages => [
            ...prevMessages,
            newMessage
        ]);

        socket.emit("message", newMessage.message);
        setInputMessage(""); // Reset input field after sending message
    };

    const textPlaceholder = "Ask something...";

    return (
        <div className="main">
            <div className="container">
                <div className="chat">
                {
                    allMessages.map((message, index) => (
                        <ChatMessage
                            key={index}
                            message={message.message}
                            type={message.type}
                        />
                    ))
                }
                </div>
                <div className="input__section">
                    <input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        type="text"
                        placeholder={textPlaceholder}
                    />
                    <button onClick={sendMessage} className="input__section__btn">Send</button>
                </div>
            </div>
        </div>
    );
}

export default App;
