import React from 'react';
import websocket from './services/socketService';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
    }
  }

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
      let status = JSON.parse(e.data)
      console.log('message received', status);
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Welcome to the Web Socket Dome, Dave</h1>
        <p>Node Server Fetch Testing. Message = {this.state.data}</p>
      </div>
    );
  }
}

export default App;
