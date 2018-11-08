import React from 'react';
import websocket from './services/socketService';
import './App.css';
import OnlineUsers from './components/OnlineUsers';
import MainChat from './components/MainChat';
import Username from './components/Username';
import ChatMessage from './components/ChatMessage';
import ManualPing from './components/ManualPing';

const chatHistory = [];
// let users = [];
let users = new Set();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      connection: 'WS Service is unavailable',
      username: '',
      users,
      message: '',
      response: chatHistory,
    }
  }

  // Form Handlers
  handleUsernameSubmit = (e) => {
    e.preventDefault();
    console.log('User submitted Username!', this.state.username);
    websocket.send(JSON.stringify({
      type: 'username',
      body: this.state.username
    }));
    // this.handleSubmit(this.state);
  }

  handleSubmit = (formData) => {
    /** ToDo: Implement with Tokens
     const url = '/api/auth/login';
     fetch(url, {
       method: 'POST',
       body: JSON.stringify(formData),
       headers: {
         'Content-Type': 'application/json; charset=utf-8',
         Accept: 'application/json'
        }
      })
      .then(res => res.json())
      .then(response => {
        // console.log('Success:', (response));
        TokenService.save(response.token);
        UserService.save(response.user, response.user.id, response.user.username);
        this.setState((prevState) => ({
          authenticated: !prevState.authenticated,
          loggedInUser: response.user,
          redirect: !prevState.redirect
        }));
      })
      .catch(error => {
        console.error('Error:', error)
        this.setState((prevState) => ({
          error: !prevState.error,
        }))
      });
    */ 
  }

  handleOnChange = (e) => {
    // console.log('handleOnChange: ', e.target.value)
    const value = e.target.value
    const name = e.target.name;
    this.setState({
      [name]: value
    });
  }

  handleSend = (e) => {
    e.preventDefault();
    let input = this.state.input
    // console.log('handleSend: ', this.state.input);
    websocket.send(JSON.stringify({
      type: 'chatMsg',
      body: this.state.message
    }));
    this.clearChatInput();
  }

  clearChatInput = () => {
    document.getElementById("chat-input").reset();
  }

  /**
   * handleServerMessages
   * 
   * This method accepts a message type from the socket server, 
   * then performs various actions depending on what the message type is.
   * 
   * @param {object} msg: a response message from the socket server
   */
  handleServerMessages = (msg) => {
    // If incoming message type is 'connection', 
    // set state of connection to received connection status
    if (msg.connection) {
      this.setState({ connection: msg.connection })
    }
    // If incoming message type is 'res', 
    // push response to chatHistory, 
    // set state of response to updated chat history
    if (msg.res) {
      chatHistory.push(msg.res);
      this.setState({ response: chatHistory });
    }
    // If incoming message type is users
    // iterate through list of users, 
    // push to users array, 
    // set state of users to users
    if (msg.users) {
      console.log('msg.users', msg.users);
      // users = [];
      for (let user in msg.users) {
        if (!users[user]) {
          users[user] = msg.users[user];
        } 
        // if (users.indexOf(user === -1)) {
        //   users.push(`Username: ${msg.users[user].username}, UserID: ${msg.users[user].id}`);
        // }
      }
      this.setState({ users });
    }
  }

  handleManualPing = () => {
    console.log('Client handled Manual Ping!');
    websocket.send(JSON.stringify({
      type: 'manualPing',
      body: this.state.username
    }));
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
      let message = JSON.parse(e.data);
      console.log('message received', message);
      this.handleServerMessages(message);
    }
  }

  render() {
    console.log('Client state: ', this.state);
    // console.log('Chat History: ', chatHistory);
    let response = this.state.response;
    let onlineUsers = this.state.users
    console.log({onlineUsers});
    return (
      <div className="App">
        <h1>Welcome to the Web Socket Dome, Dave</h1>
        <h2>Socket Server Connection Status: {this.state.connection}</h2>
        <p>Node Server Fetch Testing. Message = {this.state.data}</p>
          <Username 
            handleOnChange={this.handleOnChange}
            handleUsernameSubmit={this.handleUsernameSubmit}
          />
        <h3>Online Users:</h3>
        {/* <OnlineUsers onlineUsers={onlineUsers} /> */}

        <h3>Messages:</h3>
        <MainChat chatHistory={chatHistory} />

        <ChatMessage 
          handleOnChange={this.handleOnChange}
          handleSend={this.handleSend}
        />

        {/* Testing Only! TBR! */}
        <br />
        <ManualPing handleManualPing={this.handleManualPing}/>
      </div>
    );
  }
}

export default App;
