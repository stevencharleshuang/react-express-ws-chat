import React from 'react';
import websocket from './services/socketService';
import './App.css';
import OnlineUsers from './components/OnlineUsers';
import MainChat from './components/MainChat';

const chatHistory = [];
const users = [];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      connection: 'WS Service is unavailable',
      users: users,
      input: '',
      response: chatHistory,
    }
  }

  // Form Handlers
  handleChange = (e) => {
    // console.log('handleChange: ', e.target.value)
    this.setState({
      input: e.target.value,
    });
  }

  handleSend = (e) => {
    e.preventDefault();
    let input = this.state.input
    // console.log('handleSend: ', this.state.input);
    websocket.send(JSON.stringify(this.state.input));
    this.clearChatInput();
  }

  clearChatInput = () => {
    document.getElementById("chat-input").reset();
  }

  // Life Cycle Methods
  componentWillMount() {
    // Test Fetch
    const url = 'http://localhost:5000/api';
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json'
      }
    })
      .then(res => res.json())
      .then(response => {
        console.log('Success:', (response));
        this.setState({ data: response.message })
      })
      .catch((error) => {
        this.setState({ data: 'Server Fetch Error' })
        console.error('Error:', error);
      });
  }

  componentDidMount() {
    websocket.onmessage = (e) => {
      let message = JSON.parse(e.data)
      console.log('message received', message);
      if (message.connection) {
        this.setState({ connection: message.connection })
      }
      if (message.res) {
        chatHistory.push(message.res);
        this.setState({ response: chatHistory });
      }
      if (message.users) {
        console.log('message.users', message.users);
        for (let user in message.users) {
          users.push(message.users[user].id);
        }
        this.setState({ response: users });
      }
    }
  }

  render() {
    console.log('Client state: ', this.state);
    console.log('Chat History: ', chatHistory);
    let response = this.state.response;
    let onlineUsers = this.state.users
    return (
      <div className="App">
        <h1>Welcome to the Web Socket Dome, Dave</h1>
        <h2>Socket Server Connection Status: {this.state.connection}</h2>
        <p>Node Server Fetch Testing. Message = {this.state.data}</p>
        <h3>Online Users:</h3>
        <OnlineUsers onlineUsers={onlineUsers} />

        <h3>Messages:</h3>
        <MainChat chatHistory={chatHistory} />

        <form id="chat-input">
          <label>Server Comm:</label><br />
          <input onChange={this.handleChange} name="message" type="text" placeholder="Message" autoFocus autoComplete="off" />
        </form>
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}

export default App;
