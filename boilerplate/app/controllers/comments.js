var mongoose = require('mongoose')
  , Comment = mongoose.model('Comment')

exports.create = function (req, res) {
  var comment = new Comment(req.body)
    , event = req.event
    , bubble = req.bubble

  comment._user = req.user

  comment.save(function (err) {
    if (err) throw new Error('Error while saving comment')
    event.comments.push(comment._id)
    event.save(function (err) {
      if (err) throw new Error('Error while saving post')
      res.redirect('/bubbles/'+bubble.id+'/events/'+event.id+'#comments')
    })
  })
}
