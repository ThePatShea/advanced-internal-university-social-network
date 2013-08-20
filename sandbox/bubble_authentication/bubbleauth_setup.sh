#!/bin/sh

cp ./nginx_config/bubbleauth /etc/nginx/sites-available/bubbleauth
cp ./nginx_config/nginx.conf /etc/nginx/nginx.conf
ln -s /etc/nginx/sites-available/bubbleauth /etc/nginx/sites-enabled/bubbleauth
service nginx restart
cp ./upstart_config/bubbleauth.conf /etc/init/bubbleauth.conf
npm install

