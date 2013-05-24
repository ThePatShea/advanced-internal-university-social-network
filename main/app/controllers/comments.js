var mongoose = require('mongoose')
  , Comment = mongoose.model('Comment')

exports.create = function (req, res) {
  var comment  =  new Comment(req.body)
    , bubble   =  req.bubble
    , post     =  req.post

  comment._user  =  req.user

  comment.save(function (err) {
    if (err) throw new Error('Error while saving comment')
    post.comments.push(comment._id)
    post.save(function (err) {
      if (err) throw new Error('Error while saving post')
      res.redirect('/bubbles/'+bubble.id+'/'+req.body.bubble_section+'/view/'+post.id+'#comments')
    })
  })
}
