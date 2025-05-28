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




