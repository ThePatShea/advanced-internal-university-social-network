#!/bin/sh

tar -xvzf bubble_bundle.tgz
cp start_bubble.sh ./bundle/
cd bundle/server/
npm install fibers@1.0.0
cd ../../
cp ./nginx_config/bubble /etc/nginx/sites-available/bubble
cp ./nginx_config/nginx.conf /etc/nginx/nginx.conf
ln -s /etc/nginx/sites-available/bubble /etc/nginx/sites-enabled/bubble
service nginx restart
cp ./upstart_config/bubble.conf /etc/init/bubble.conf
