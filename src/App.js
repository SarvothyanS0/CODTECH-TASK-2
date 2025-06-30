import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = useRef(null);

  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:3001');

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'history') {
        setMessages(message.data);
      } else if (message.type === 'message') {
        setMessages(prev => [...prev, message.data]);
      }
    };

    return () => socket.current.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() !== '') {
      socket.current.send(input);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <h2>🗨️ Real-Time Chat</h2>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="message">{msg}</div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
