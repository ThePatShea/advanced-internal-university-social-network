#!/bin/sh

tar -xvzf bubble_bundle.tgz
cp start_bubble.sh ./bundle/
cd bundle/server/
npm install fibers@1.0.0
cd ../../

