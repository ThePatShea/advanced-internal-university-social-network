#!/bin/sh

export NGINX_PATH=/opt/nginx
mkdir $NGINX_PATH/conf/sites-available
mkdir $NGINX_PATH/conf/sites-enabled
cp ./nginx_config/bubble.secure $NGINX_PATH/conf/sites-available/bubble
cp ./nginx_config/nginx.conf.secure $NGINX_PATH/conf/nginx.conf
ln -s $NGINX_PATH/conf/sites-available/bubble $NGINX_PATH/conf/sites-enabled/bubble
service nginx restart
cp ./upstart_config/bubble.conf /etc/init/bubble.conf
