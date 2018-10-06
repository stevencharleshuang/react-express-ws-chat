import React from 'react';

export default function MainChat(props) {
  console.log('MainChat Props:', props);
  let chatHistory = props.chatHistory;
  let chatBoard = chatHistory.map((msg, i) => {
    return (
      <li key={i}>{msg.user} {msg.timespamp}: {msg.parsedMsg}</li>
    );
  });
  return (
    <div className="main-chat">
      <h1>Main Chat</h1>
      <ul>
        {chatBoard}
      </ul>
    </div>
  );
}
