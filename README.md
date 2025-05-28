Borro eso pa enviar de nuevo


no me mandes tan desorganizado donde va cada cosa lol
FROM httpd:2.4

COPY apache.conf /usr/local/apache2/conf/httpd.conf
COPY Angular/ /usr/local/apache2/htdocs/

ServerName localhost

<VirtualHost *:80>
    DocumentRoot /usr/local/apache2/htdocs

    <Directory /usr/local/apache2/htdocs>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>


ServerName localhost

<VirtualHost *:80>
    DocumentRoot /usr/local/apache2/htdocs

    <Directory /usr/local/apache2/htdocs>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
Va en el archivo apache.conf

FROM httpd:2.4

COPY apache.conf /usr/local/apache2/conf/httpd.conf
COPY Angular/ /usr/local/apache2/htdocs/

Luego accede a la carpeta:
cd Front
Ya dentro puedes trabajar y luego compilar para producción con:

bash
Copiar
Editar
ng build --configuration production

  ----
  Archivo: Dockerfile

dockerfile
Copiar
FROM httpd:2.4

COPY apache.conf /usr/local/apache2/conf/httpd.conf
COPY Angular/ /usr/local/apache2/htdocs/

Archivo: apache.conf

apache
Copiar
ServerName localhost

<VirtualHost *:80>
    DocumentRoot /usr/local/apache2/htdocs

    <Directory /usr/local/apache2/htdocs>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>


Eso me da 
Carpeta: SegarraJ_Interciclo/Frontend
1. Archivo: Dockerfile
dockerfile
Copiar
FROM httpd:2.4

COPY apache.conf /usr/local/apache2/conf/httpd.conf
COPY Angular/ /usr/local/apache2/htdocs/
2. Archivo: apache.conf
apache
Copiar
ServerName localhost

<VirtualHost *:80>
    DocumentRoot /usr/local/apache2/htdocs

    <Directory /usr/local/apache2/htdocs>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
3. Carpeta: Angular/
Aquí debes colocar la carpeta compilada de Angular (resultado de ng build --configuration production), que contiene archivos como index.html, main.js, assets/, etc.

Carpeta: SegarraJ_Interciclo/Back
1. Archivo: Dockerfile
dockerfile
Copiar
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY server.js .

EXPOSE 8081

CMD ["npm", "start"]
2. Archivo: package.json
json
Copiar
{
  "name": "websocket-server",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "ws": "^8.13.0"
  },
  "scripts": {
    "start": "node server.js"
  }
}
3. Archivo: server.js
javascript
Copiar
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  let count = 0;

  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(`Mensaje dinámico #${++count} desde WebSocket`);
    }
  }, 3000);

  ws.on('close', () => {
    console.log('Cliente desconectado');
    clearInterval(interval);
  });
});
Archivo raíz: SegarraJ_Interciclo/docker-compose.yml
yaml
Copiar
version: "3.8"

services:
  frontend:
    build: ./Frontend
    ports:
      - "8080:80"
    depends_on:
      - back

  back:
    build: ./Back
    ports:
      - "8081:8081"

