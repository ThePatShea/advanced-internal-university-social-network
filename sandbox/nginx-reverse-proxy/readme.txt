The following configuration options are for Ubuntu 10.4

Chain the talkchool.net.crt and gd_bundle.crt certificates:

cat talkschool.net.crt gd_bundle.crt > talkschool.net.chained.crt

This puts the talkschool.net server certificate first, and then the go-daddy
authority cert, into one file.

----------------------------------------------------------------------
Edit /etc/nginx/nginx.conf and set:

	user pxferna;
----------------------------------------------------------------------

Create /etc/nginx/sites-available/bubble enter the following:



server {
    listen      80;
    server_name talkschool.net;
    rewrite ^ https://$server_name$request_uri? permanent;
}


  server {
        listen   443;

        access_log /var/log/nginx/meteorapp.access.log;
        error_log /var/log/nginx/meteorapp.error.log;

        location / {
                proxy_pass https://bubble.meteor.com;
                proxy_set_header X-Real-IP $remote_addr;
        }

        ssl on;
        ssl_certificate /etc/nginx/ssl/talkschool.net.crt;
        ssl_certificate_key /etc/nginx/ssl/talkschool.net.key;
        ssl_verify_depth 3;
  }


-----------------------------------------------------------------------

Create the folder /etc/nginx/ssl and put the certificate and key in it.

-----------------------------------------------------------------------

To start the Nginx server listening on port 443 run:

sudo service nginx start

