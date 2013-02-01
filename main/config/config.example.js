
module.exports = {
    development: {
      db: 'mongodb://nodejitsu_campusbubble:mm0hjn9lob87vt9eopnpshp13b@ds049537.mongolab.com:49537/nodejitsu_campusbubble_nodejitsudb4086692456',
      facebook: {
          clientID: "219781404699497"
        , clientSecret: "11efd0dea9edbb5461a0b74c6227ff42"
        , callbackURL: "http://localhost:3000/auth/facebook/callback"
      },
      twitter: {
          clientID: "CONSUMER_KEY"
        , clientSecret: "CONSUMER_SECRET"
        , callbackURL: "http://localhost:3000/auth/twitter/callback"
      },
      github: {
          clientID: 'APP_ID'
        , clientSecret: 'APP_SECRET'
        , callbackURL: 'http://localhost:3000/auth/github/callback'
      },
      google: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://localhost:3000/auth/google/callback"
      }
    }
  , test: {

    }
  , production: {
      db: 'mongodb://nodejitsu_campusbubble:vn94subvihmm5j843t4to71s5g@ds049537.mongolab.com:49537/nodejitsu_campusbubble_nodejitsudb9203155674',
      facebook: {
          clientID: "574730455889400"
        , clientSecret: "6df6e97d12948de097b0e31667a8804b"
        , callbackURL: "http://test.campusbubble.jit.su/auth/facebook/callback"
      },
      twitter: {
          clientID: "CONSUMER_KEY"
        , clientSecret: "CONSUMER_SECRET"
        , callbackURL: "http://test.campusbubble.jit.su/auth/twitter/callback"
      },
      github: {
          clientID: 'APP_ID'
        , clientSecret: 'APP_SECRET'
        , callbackURL: 'http://test.campusbubble.jit.su/auth/github/callback'
      },
      google: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://test.campusbubble.jit.su/auth/google/callback"
      }
    }
}
