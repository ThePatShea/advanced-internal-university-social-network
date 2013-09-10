meteor bundle bubble_bundle.tgz --release 0.6.1
rm ~/emory_bubble/bubble_bundle.tgz
rm -rf ~/emory_bubble/bundle
mv bubble_bundle.tgz ~/emory_bubble/
tar -xvzf ~/emory_bubble/bubble_bundle.tgz -C ~/emory_bubble/
npm install fibers@1.0.0 --prefix ~/emory_bubble/bundle/server/node_modules/
MONGO_URL="mongodb://localhost:27017/bubble_development" ROOT_URL="https://www.emorybubble.com/" PORT=3000 node ~/emory_bubble/bundle/main.js
