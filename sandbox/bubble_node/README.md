# Campus Bubble: Node Rewrite

## Getting Started

    brew install node
    npm install
    grunt

## File Structure

- the Node server is in server.js
  - static assets from server/public
  - static assets from client/* (in dev only)
  - asset pipeline using Snockets
    - serves the production minified file from /application.js
- the Backbone-Marionette app is in client/*
    - look at client/manifest.js
