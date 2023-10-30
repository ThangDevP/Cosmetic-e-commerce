const express = require('express')
const morgan = require('morgan')
// const hbs = require('express-handlebars');
// var app = express.createServer();
const router = express.Router();
const path = require('path');
const app = express()
const port = 8000

// Show request, HTTP logger
app.use(morgan('combined'))

// Use static file
app.use(express.static(path.join(__dirname, 'public')));

// 
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/public/views/html/home.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/login',function(req,res){
  res.sendFile(path.join(__dirname + '/public/views/html/login.html'));
  //__dirname : It will resolve to your project folder.
});
app.use('/', router);
// Local host --- Hosting
// Action ---> Dispatcher ---> Function handler
app.listen(port, () => {
  console.log(`Ecommerce website listening on http://localhost:${port}`)
})
