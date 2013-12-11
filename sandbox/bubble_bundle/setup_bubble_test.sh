#!/bin/sh

cp ./nginx_config/bubble.test /etc/nginx/sites-available/bubble
cp ./nginx_config/nginx.conf.test /etc/nginx/nginx.conf
ln -s /etc/nginx/sites-available/bubble /etc/nginx/sites-enabled/bubble
service nginx restart
cp ./upstart_config/objectrocket/bubble.conf /etc/init/bubble.conf
