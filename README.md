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
