// Require base scripts
  var cronJob     = require('cron').CronJob
    , base_curate = require("./curate.js")
    , express     = require('express')

// Run the cron job
  new cronJob('0 15 6 * * *', function() {
    base_curate.bubble_curate()
  }, null, true)


// Start the app by listening on <port>
  var app = express()
  var port = process.env.PORT || 3000
  app.listen(port)
  console.log('Campus Bubble Curate started on port '+port)
