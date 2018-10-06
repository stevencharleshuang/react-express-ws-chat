import React from 'react';
import websocket from './services/socketService';
import './App.css';
import MainChat from './components/MainChat';

const chatHistory = [];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      connection: 'WS Service is unavailable',
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
    }
  }

  render() {
    console.log('Client state: ', this.state);
    console.log('Chat History: ', chatHistory);
    let response = this.state.response;
    return (
      <div className="App">
        <h1>Welcome to the Web Socket Dome, Dave</h1>
        <h2>Socket Server Connection Status: {this.state.connection}</h2>
        <p>Node Server Fetch Testing. Message = {this.state.data}</p>

        <form id="chat-input">
          <label>Server Comm:</label><br />
          <input onChange={this.handleChange} name="message" type="text" placeholder="Message" autoFocus autoComplete="off" />
        </form>
        <button onClick={this.handleSend}>Send</button>
        <h3>Incoming Message:</h3>
        <MainChat chatHistory={chatHistory} />
      </div>
    );
  }
}

export default App;
