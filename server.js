const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 9090 });

const port = process.env.PORT || 3000


let clients = [];
console.log("all is good");

wss.on("connection", connection => {
  clients.push(connection);
  broadcast({ username: "Admin", message: "A user has entered the room " });
  connection.on("message", message => {
    const data = JSON.parse(message);
    broadcast(data);
  });
});

setInterval(cleanUp, 100);

const broadcast = message => {
  const data = JSON.stringify(message);
  clients.forEach(client => {
    client.send(data);
  });
};

function cleanUp() {
  const clientsLeaving = clients.filter(
    client => client.readyState === client.CLOSED
  );
  clients = clients.filter(client => client.readyState !== client.CLOSED);
  clientsLeaving.forEach(client =>
    broadcast({ username: "admin", message: "A user has left the room" })
  );
}

if( process.env.NODE_ENV === "production"){
  app.use(express.static("client/build"))
  app.get("*", (req, res)=> {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

// 

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})