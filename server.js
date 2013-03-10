var express = require('express'),
    impact = require('impactjs'),
    port = 8080,
    app = express()

app.configure(function(){
  app.set('views', __dirname + '/views')
  app.use(logErrors)
  app.use(express.methodOverride())
  app.use(express.bodyParser())
  app.use(app.router)
})

app.get('/', function(req, res){
  res.render('index.jade', {
    locals: { title: 'Example node-impact server' }
  })
})

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

var im = impact.listen(app, { root: __dirname + '/public' })
app.use(express.static(im.root))

app.listen(port)

console.log('app listening on port', port)
