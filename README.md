ya y?
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

Eso donde va, dile cual es el comando para generar un nuevo proyecto en angular, que se llama Front
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
ng new Front --defaults --skip-tests --routing=false
Esto crea un proyecto Angular llamado Front.

--defaults usa las opciones predeterminadas.

--skip-tests no crea archivos de test.

--routing=false no incluye configuración de rutas.
Luego accede a la carpeta:
cd Front
Ya dentro puedes trabajar y luego compilar para producción con:

bash
Copiar
Editar
ng build --configuration production

