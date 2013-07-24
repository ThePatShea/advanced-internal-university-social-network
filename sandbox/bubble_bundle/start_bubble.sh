#!/bin/sh
export MONGO_URL='mongodb://bubblesandbox:F302pinpulse@ds037508.mongolab.com:37508/bubble_sandbox'
export ROOT_URL='http://54.225.225.43/'
export MAIL_URL='smtp://no-reply%40thecampusbubble.com:u3nT8dAC@smtp.gmail.com:465/'
export PORT=80

PORT=$PORT ROOT_URL=$ROOT_URL MONGO_URL=$MONGO_URL forever start main.js
