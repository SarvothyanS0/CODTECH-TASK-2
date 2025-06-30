const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = [];

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send existing messages to the new client
  ws.send(JSON.stringify({ type: 'history', data: messages }));

  ws.on('message', (message) => {
    const msg = message.toString();
    messages.push(msg);

    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'message', data: msg }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running at http://localhost:${PORT}`);
});
