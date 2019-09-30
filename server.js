const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ port: 9090 });

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
