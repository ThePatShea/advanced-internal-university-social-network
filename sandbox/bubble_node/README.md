# Campus Bubble: Node Rewrite

## Getting Started

Make sure you have Node. I like Homebrew:

    > brew install node

Now install the dependencies via npm:

    > npm install

Now run the server, managed by Grunt:

    > grunt

...or in production:

    > NODE_ENV=production grunt # for production mode

## File Structure

- the Node server is in server.js
  - static assets from server/public
  - static assets from client/* (in dev only)
  - asset pipeline using Snockets
    - serves the production minified file from /application.js
- the Backbone-Marionette app is in client/*
    - look at client/manifest.js
