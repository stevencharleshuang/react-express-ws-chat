import React from 'react';

export default function ChatMessage(props) {
  return (
    <div className="chat-message">
      <form id="chat-input">
        <label>Server Comm:</label><br />
        <input 
          onChange={props.handleOnChange} 
          name="message" 
          type="text" 
          placeholder="Message" 
          autoFocus 
          autoComplete="off" />
      </form>
      <button onClick={props.handleSend}>Send</button>
    </div>
  );
}