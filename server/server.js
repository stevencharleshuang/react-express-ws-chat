const express         = require('express'),
      app             = express(),
      logger          = require('morgan'),
      http            = require('http').Server(app),
      path            = require('path'),
      PORT            = process.env.PORT || 5000,
      WebSocketServer = require('ws').Server,
      wss             = new WebSocketServer({
                          port: 8080,
                          clientTracking: true,
                        })

const uuidv4 = require('uuid/v4'),
      moment = require('moment')

app.use(logger('dev'));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../client/public')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to the Web Socket Server, Dave' });
});

// // Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.use((err, req, res, next) => {
  console.log(`I'm sorry, Dave. I'm afraid I can't do that.`);
  res.status(500).send(`I'm sorry, Dave. I'm afraid I can't do that.`);
});

let users = new Set();
let clients = [];
let chatMessages = [];
// Begin WS
wss.on('connection', (ws, req) => {
  let userID = uuidv4();
  let username = 'Unsung Hero';
  let id = req.headers['sec-websocket-key'];
  console.log('New Client Connected', userID);
  !users[userID] ? users[userID] = { id, username, userID, ws } : null
  console.log({ users });
  ws.send(JSON.stringify({ connection: `${userID} is connected!` }));
  // ws.send(JSON.stringify({ users }));

  clients.push(ws);
  // something here causing a crash in sockets server
  // clients.forEach((client) => {
  //   client.send(JSON.stringify({ users }));
  // });

  for (let user in users) {
    console.log(user);
    users[user].ws.send(JSON.stringify({ message: 'hi' }));
  }

  ws.on('message', (message) => {
    let timestamp = moment().format('YYYYMMDDHHmmss');
    let parsedMsg = JSON.parse(message);
    let type = parsedMsg.type;
    let body = parsedMsg.body;
    console.log('client sent a message', { parsedMsg });
    if (type === 'username') {
      console.log('Socks Server: Client submitted username =>', body);
      username = body;
    }
    if (type === 'chatMsg') {
      chatMessages.push(body);
      console.log('Socks Server: Client sent a chat message =>', body);
      // clients.forEach((client) => {
      //   client.send(JSON.stringify({ res: { userID, username, timestamp, body } }));
      // });
      for (let user of users) {
        users[user].ws.send(JSON.stringify({ res: { chatMessages } }));
      }
    }
    if (type === 'manualPing') {
      console.log('Socks Server: Received manual ping from user =>', body);
    }
  });
});


// End WS

app.listen(PORT, () => {
  console.log(`Server up and running! Port: ${PORT} Env: ${app.get('env')}`);
});
