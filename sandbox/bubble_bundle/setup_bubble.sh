#!/bin/sh

tar -xvzf bubble_bundle.tgz
cp start_bubble.sh ./bundle/
cd bundle/server/
npm install fibers@1.0.0
cd ../../
cp ./nginx_config/bubble /etc/nginx/sites-available/bubble
ln -s /etc/nginx/sites-available/bubble /etc/nginx/sites-enabled/bubble
cp ./upstart_config/bubble.conf /etc/init/bubble.conf

