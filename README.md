ya y?
FROM httpd:2.4

COPY apache.conf /usr/local/apache2/conf/httpd.conf
COPY Angular/ /usr/local/apache2/htdocs/

