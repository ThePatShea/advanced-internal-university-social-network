#
# * GET home page.
# 
exports.index = (req, res) ->
  res.render "index/index"

exports.partials = (req, res) ->
  name = req.params.name
  res.render "partials/" + name