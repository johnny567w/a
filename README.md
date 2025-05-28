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


# Paso 2: Crear el frontend Angular (carpeta Frontend/)

dentro del fronted

cd Frontend
ng new Angular --routing=false --style=css

Archivo: Frontend/apache.conf
apacheconf

ServerName localhost

<VirtualHost *:80>
    DocumentRoot "/usr/local/apache2/htdocs"

    <Directory "/usr/local/apache2/htdocs">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog /proc/self/fd/2
    CustomLog /proc/self/fd/1 combined
</VirtualHost>


Archivo: Frontend/Dockerfile
# Etapa 1: build Angular app
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY Angular/ ./Angular/
WORKDIR /app/Angular

RUN npm run build --configuration production

# Etapa 2: servir con Apache
FROM httpd:2.4

COPY --from=build /app/Angular/dist/Angular /usr/local/apache2/htdocs/
COPY apache.conf /usr/local/apache2/conf/httpd.conf

EXPOSE 80




