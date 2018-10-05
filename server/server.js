
const express         = require('express'),
      app             = express(),
      logger          = require('morgan'),
      http            = require('http').Server(app),
      path            = require('path'),
      uuidv4          = require('uuid/v4');
      PORT            = process.env.PORT || 5000,
      WebSocketServer = require('ws').Server,
      wss             = new WebSocketServer({
                          port: 8080,
                          clientTracking: true,
                        })

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

// Begin WS
wss.on('connection', (ws, req) => {
  let user = uuidv4();
  console.log('New Client Connected', user);
  !users[user] ? users[user] = { id: req.headers['sec-websocket-key'] } : null
  console.log({ users });
  ws.send(JSON.stringify({ status: `${user} is connected!` }));

  ws.on('message', (message) => {
    let parsedMsg = JSON.parse(message)
    console.log({ parsedMsg });
  })
});


// End WS

app.listen(PORT, () => {
  console.log(`Server up and running! Port: ${PORT} Env: ${app.get('env')}`);
});
