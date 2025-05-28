SegarraJ_Interciclo/
│
├── Back/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── Angular/             <-- Código fuente Angular (todo el proyecto)
│   ├── apache.conf
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md




Dentro de Back/ crea estos archivos:


Archivo: Back/package.json
json

{
  "name": "websocket-server",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "ws": "^8.13.0"
  }
}
Archivo: Back/server.js


const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('Servidor WebSocket escuchando en ws://0.0.0.0:8080');

wss.on('connection', ws => {
  console.log('Cliente conectado');

  const interval = setInterval(() => {
    ws.send(`Mensaje dinámico: ${new Date().toLocaleTimeString()}`);
  }, 3000);

  ws.on('close', () => {
    console.log('Cliente desconectado');
    clearInterval(interval);
  });
});


Archivo: Back/Dockerfile


FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY server.js .

EXPOSE 8080

CMD ["node", "server.js"]





